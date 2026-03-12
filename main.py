from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date, timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# ==========================================
# ⚙️ INICIALIZAÇÃO DO SISTEMA
# ==========================================
app = FastAPI(
    title="API Baply ERP",
    description="Motor backend escalável (SaaS) com Dashboard, Auth e Cloudinary",
    version="1.0.0-beta" # Chegamos na versão 1.0 do Backend Base!
)

# ==========================================
# 🛡️ MÓDULO DE SEGURANÇA (Autenticação JWT)
# ==========================================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

banco_usuarios_fake = {
    "jean.brito": {
        "username": "jean.brito",
        "nome_completo": "Jean Brito",
        "senha_hash": "senha123", 
        "nivel_acesso": "Admin"
    },
    "vendedor": {
        "username": "vendedor",
        "nome_completo": "Vendedor Padrão",
        "senha_hash": "venda123",
        "nivel_acesso": "Operacional"
    }
}

@app.post("/login", tags=["Segurança"])
def login_para_obter_token(form_data: OAuth2PasswordRequestForm = Depends()):
    usuario_db = banco_usuarios_fake.get(form_data.username)
    if not usuario_db or form_data.password != usuario_db["senha_hash"]:
        raise HTTPException(status_code=400, detail="Usuário ou senha incorretos")
        
    token_falso = f"token_seguro_de_{form_data.username}"
    return {"access_token": token_falso, "token_type": "bearer", "nivel": usuario_db["nivel_acesso"]}

def obter_usuario_atual(token: str = Depends(oauth2_scheme)):
    username = token.replace("token_seguro_de_", "")
    if username not in banco_usuarios_fake:
        raise HTTPException(status_code=401, detail="Crachá (Token) inválido ou expirado.")
    return banco_usuarios_fake[username]

# ==========================================
# 📐 MODELOS DE DADOS
# ==========================================
class CredenciaisCloudinary(BaseModel):
    cloud_name: str
    api_key: str
    api_secret: str

class ConfiguracaoLoja(BaseModel):
    id_loja: str
    nome_loja: str
    cloudinary: Optional[CredenciaisCloudinary] = None

class ClienteEntrada(BaseModel):
    nome: str
    telefone: Optional[str] = None
    endereco: Optional[str] = "Não informado"

class Cliente(ClienteEntrada):
    codigo_cliente: str 
    status_cadastro: str = "Ativo"

class Produto(BaseModel):
    codigo: str
    nome: str
    estoque_atual: int
    preco_venda: float
    custo: float
    url_foto: Optional[str] = None

class ItemCarrinho(BaseModel):
    codigo_produto: str
    quantidade: int
    preco_unitario: float

class Parcela(BaseModel):
    numero: int
    data_vencimento: date
    valor: float
    status: str = "Pendente"

class Venda(BaseModel):
    codigo_cliente: str
    metodo_pagamento: str 
    itens: List[ItemCarrinho]
    total_com_desconto: float
    qtd_parcelas: Optional[int] = 1

# ==========================================
# 🗄️ BANCO DE DADOS TEMPORÁRIO
# ==========================================
banco_configuracoes_fake = {
    "LOJA-001": {"id_loja": "LOJA-001", "nome_loja": "Loja Teste", "cloudinary": None}
}
banco_clientes_fake = []
banco_produtos_fake = [
    {"codigo": "101.1", "nome": "Lençol Casal Padrão", "estoque_atual": 15, "preco_venda": 89.90, "custo": 45.00, "url_foto": None},
]
banco_vendas_fake = []
banco_contas_receber_fake = []

# ==========================================
# 🌐 ROTAS DA API
# ==========================================
@app.get("/", tags=["Status"])
def status_do_sistema():
    return {"mensagem": "API Baply online, segura e operante! 🚀"}

# --- 📊 DASHBOARD PROTEGIDO ---
# O 'Depends' aqui é o que exige o login! Se o App Android não mandar o token, a API bloqueia.
@app.get("/dashboard", tags=["Dashboard"])
def obter_metricas_dashboard(usuario_logado: dict = Depends(obter_usuario_atual)):
    total_vendas_reais = sum(v["total_com_desconto"] for v in banco_vendas_fake if v.get("status_venda") != "Cancelada")
    dinheiro_na_rua = sum(conta["fatura"]["valor"] for conta in banco_contas_receber_fake if conta["fatura"]["status"] == "Pendente")
    capital_em_estoque = sum(p["estoque_atual"] * p["custo"] for p in banco_produtos_fake)
    qtd_produtos_risco = len([p for p in banco_produtos_fake if p["estoque_atual"] <= 3])

    return {
        "usuario_logado": usuario_logado["nome_completo"],
        "financeiro": {
            "vendas_totais": round(total_vendas_reais, 2),
            "recebiveis_futuros": round(dinheiro_na_rua, 2),
            "caixa_estimado": round(total_vendas_reais - dinheiro_na_rua, 2)
        },
        "estoque": {
            "capital_parado_custo": round(capital_em_estoque, 2),
            "produtos_em_alerta": qtd_produtos_risco
        }
    }

# --- ⚙️ CONFIGURAÇÕES & CLOUDINARY ---
@app.put("/configuracoes/{id_loja}/cloudinary", tags=["Configurações"])
def configurar_cloudinary(id_loja: str, credenciais: CredenciaisCloudinary):
    if id_loja not in banco_configuracoes_fake:
        raise HTTPException(status_code=404, detail="Loja não encontrada no sistema Baply.")
    banco_configuracoes_fake[id_loja]["cloudinary"] = credenciais.model_dump()
    return {"mensagem": "Integração com Cloudinary ativada com sucesso! ☁️"}

# --- 👥 CRM ---
@app.post("/clientes", response_model=Cliente, tags=["CRM"])
def cadastrar_cliente(novo_cliente: ClienteEntrada):
    codigo_gerado = f"CLI-{(len(banco_clientes_fake) + 1):03d}"
    cliente_final = Cliente(**novo_cliente.model_dump(), codigo_cliente=codigo_gerado)
    banco_clientes_fake.append(cliente_final.model_dump())
    return cliente_final

@app.get("/clientes", response_model=List[Cliente], tags=["CRM"])
def listar_clientes():
    return banco_clientes_fake

# --- 📦 ESTOQUE E PRODUTOS ---
@app.get("/produtos", response_model=List[Produto], tags=["Estoque"])
def listar_produtos():
    return banco_produtos_fake

@app.post("/produtos", response_model=Produto, tags=["Estoque"])
def cadastrar_produto(novo_produto: Produto):
    banco_produtos_fake.append(novo_produto.model_dump())
    return novo_produto

# --- 🛒 VENDAS E BORRACHA MÁGICA ---
@app.post("/vendas", tags=["Vendas"])
def registrar_venda(nova_venda: Venda):
    venda_dict = nova_venda.model_dump()
    venda_dict["id_venda"] = f"VEN-{(len(banco_vendas_fake) + 1):05d}"
    venda_dict["status_venda"] = "Ativa"
    
    for item in nova_venda.itens:
        for produto in banco_produtos_fake:
            if produto["codigo"] == item.codigo_produto:
                produto["estoque_atual"] -= item.quantidade
                
    if nova_venda.metodo_pagamento == "Crediário Loja" and nova_venda.qtd_parcelas > 1:
        valor_parcela = round(nova_venda.total_com_desconto / nova_venda.qtd_parcelas, 2)
        for i in range(nova_venda.qtd_parcelas):
            fatura = Parcela(numero=i + 1, data_vencimento=date.today() + timedelta(days=30 * (i + 1)), valor=valor_parcela)
            banco_contas_receber_fake.append({"id_venda": venda_dict["id_venda"], "codigo_cliente": nova_venda.codigo_cliente, "fatura": fatura.model_dump()})
            
    banco_vendas_fake.append(venda_dict)
    return {"mensagem": "Venda registrada!", "recibo": venda_dict}

@app.get("/vendas", tags=["Vendas"])
def listar_vendas():
    return banco_vendas_fake

@app.delete("/vendas/{id_venda}", tags=["Vendas"])
def estornar_venda_borracha_magica(id_venda: str):
    global banco_contas_receber_fake 

    venda_alvo = next((v for v in banco_vendas_fake if v.get("id_venda") == id_venda), None)
    if not venda_alvo: raise HTTPException(status_code=404, detail="Venda não encontrada.")
    if venda_alvo.get("status_venda") == "Cancelada": raise HTTPException(status_code=400, detail="Venda já estornada.")

    for item in venda_alvo["itens"]:
        for prod in banco_produtos_fake:
            if prod["codigo"] == item["codigo_produto"]:
                prod["estoque_atual"] += item["quantidade"]

    banco_contas_receber_fake = [c for c in banco_contas_receber_fake if c.get("id_venda") != id_venda]
    venda_alvo["status_venda"] = "Cancelada"

    return {"mensagem": f"Venda {id_venda} cancelada. Estoque devolvido e cobranças anuladas."}

# --- 💸 COBRANÇA ---
@app.get("/financeiro/receber", tags=["Financeiro"])
def contas_a_receber():
    return banco_contas_receber_fake

@app.put("/financeiro/receber/{codigo_cliente}/{numero_parcela}/pagar", tags=["Financeiro"])
def pagar_parcela_crediario(codigo_cliente: str, numero_parcela: int):
    for conta in banco_contas_receber_fake:
        if conta["codigo_cliente"] == codigo_cliente and conta["fatura"]["numero"] == numero_parcela:
            conta["fatura"]["status"] = "Pago"
            return {"mensagem": "Baixa efetuada! ✅"}
    raise HTTPException(status_code=404, detail="Fatura não encontrada.")
