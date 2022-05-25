from datetime import date, datetime,timedelta
from email import message
from lib2to3.pgen2 import token
from re import U
from flask import Flask, jsonify, redirect, render_template, url_for, request, redirect, Response, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from time import gmtime,strftime
import paho.mqtt.client as mqtt
import json
from flask_cors import CORS, cross_origin
from sqlalchemy import desc
import jwt
from functools import wraps
import os

app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///first.db'
app.config['SECRET_KEY']='thisisasecretkey'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db=SQLAlchemy(app)
CORS(app)

#sadads
def on_connect(client, userdata, flags, rc):
    print('Connected with result code '+str(rc))
    client.subscribe('v3/+/devices/+/up')
    
def on_message(client, userdata, msg):
    mensagem = json.loads(msg.payload)
    uplink = mensagem['uplink_message']
    decoded_payload=uplink['decoded_payload']
    coordenadas=decoded_payload['str']
    print("coordenadas: "+coordenadas)
    print(msg.topic)
    print(client)
    adicionar_coordenadas(coordenadas)
     

#tabelaUtilizadoresss
class Utilizadores(db.Model):
    __tablename__ = 'utilizadores'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(256), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    admin = db.Column(db.Boolean) 
    
    #gerar Hashing da password
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_json(self):
        return {
            "id": self.id,
            "email": self.email,
            "password_hash": self.password_hash,
            "admin": self.admin
        }


class Veiculos(db.Model):
    __tablename__ = 'veiculos'
    id = db.Column(db.Integer, primary_key=True)
    matricula = db.Column(db.String(256), unique=True, nullable=False)
    utilizador_id= db.Column(db.Integer,db.ForeignKey('utilizadores.id'))
    device_id = db.Column(db.String(256), nullable=True)
    tipo=db.Column(db.String(256), unique=False, nullable=False)
    
    def to_json(self):
        return {
            "id": self.id,
            "matricula": self.matricula,
            "utilizador_id": self.utilizador_id,
            "device_id": self.device_id,
            "tipo":self.tipo
        }

class Coordenadas(db.Model):
    __tablename__ = 'coordenadas'
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    veiculo_id = db.Column(db.Integer,db.ForeignKey('veiculos.id'))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_json(self):
        return {
            "id": self.id,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "veiculo_id": self.veiculo_id,   
        }

#db.drop_all()
db.create_all()
    
#funcoes auxx
def getLongitude():
    longitude=-8.60680757276
    return longitude

def getLatitude():
    latitude=41.1706859839
    return latitude

def gerar_resposta(status, nome_do_conteudo, conteudo, mensagem=False):
    body = {}
    body[nome_do_conteudo] = conteudo

    if (mensagem):
        body["mensagem"] = mensagem

    return Response(json.dumps(body), status=status, mimetype="application/json")    

def token_required(f):


    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']
        # return 401 if token is not passed
        if not token:
            return jsonify({'message': 'Token is missing !!'}), 401
        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(token, app.config['SECRET_KEY'],algorithms=['HS256'])
            current_user = Utilizadores.query.filter_by(email=data['user']).first()
        except:
            return jsonify({
                'message': 'Token is invalid !!'
            }), 403
        # returns the current logged in users contex to the routes
        return f(current_user, *args, **kwargs)

    return decorated

@app.route("/",methods=["GET"])
def index():
    return gerar_resposta(200, "","")


#LOGIN ROUTE        
@app.route("/login", methods=["POST"])
@cross_origin()
def utilizadores_login():
    body = request.get_json() #data=conteudo do form
    utilizador_objeto = Utilizadores.query.filter_by(email=body['email']).first()
    if utilizador_objeto:
        utilizador_json = utilizador_objeto.to_json()
        if check_password_hash(utilizador_json['password_hash'],body['password']):
            token=jwt.encode({'user':body['email'], 'exp':datetime.utcnow()+ timedelta(minutes=1440)},app.config['SECRET_KEY'])
            utilizador_json["token"]=token
            return gerar_resposta(200, "login", utilizador_json)
        return gerar_resposta(400, "login", {}, "Wrong Credentials")
    else:
        return gerar_resposta(401, "login", {}, "User Not Found")

#REGISTER ROUTE
@app.route("/registo", methods=["POST"])
@cross_origin()
def cria_utilizador():
    body = request.get_json()
    if(Utilizadores.query.filter_by(email=body['email']).first()):
        return gerar_resposta(400, "utilizadores", {}, "Já existe um utilizador registado com este email")
    try:
        utilizador = Utilizadores(email=body["email"],password_hash=generate_password_hash(body["password"],method='sha256'))
        db.session.add(utilizador)
        db.session.commit()
        return gerar_resposta(200, "utilizadores", utilizador.to_json(), "Criado com sucesso")
    except Exception as e:
        print('Erro', e) #debug
        return gerar_resposta(400, "utilizadores", {}, "Ocorreu um erro ao fazer o seu registo, tente novamente") #frontend testa se retornaa Uuilizadores vazio provavelmente

#ADD VEICULO ROUTE
@app.route("/addVeiculo/<utilizador_id>", methods=["POST"])
def adicionar_veiculo(utilizador_id):
    body = request.get_json()
    print(body)
    if(Veiculos.query.filter_by(matricula=body["matricula"]).first()):
        return gerar_resposta(400, "veiculos", {}, "Este veiculo já se encontra registado")
    try:
        Veiculo = Veiculos(matricula=body["matricula"],device_id=body["device_id"],tipo=body["tipo"],utilizador_id=utilizador_id)
        db.session.add(Veiculo)
        db.session.commit()
        return gerar_resposta(200, "veiculos", Veiculo.to_json(), "Criado com sucesso")
    except Exception as e:
        print('Erro', e) #debug
        return gerar_resposta(400, "veiculos", {}, "Ocorreu um erro ao registar veiculos, tente novamente")

#REMOVE UTILIZADOR ROUTE
@app.route("/utilizador/<id>", methods=["DELETE"])
def remover_utilizador(id):
    utilizador = Utilizadores.query.filter_by(id=id).first()
    try:
        db.session.delete(utilizador)
        db.session.commit()
        return gerar_resposta(200, "utilizadores", utilizador.to_json(), "Removido com sucesso")
    except Exception as e:
        print('Erro', e)
        return gerar_resposta(400, "utilizadores", {}, "Erro ao remover")

#REMOVE VEICULO ROUTE
@app.route("/removerVeiculo/<id>", methods=["DELETE"])
def remover_veiculos(id):
    print(id)
    veiculo = Veiculos.query.filter_by(id=id).first()
    try:
        db.session.delete(veiculo)
        db.session.commit()
        return gerar_resposta(200, "veiculos", veiculo.to_json(), "Veiculo eliminada com sucesso")
    except Exception as e:
        print('Erro', e)
        return gerar_resposta(400, "veiculos", {}, "Erro ao eliminar veiculo")


#UPDATE UTILIZADOR ROUTE
@app.route("/utilizador/<id>", methods=["PUT"])
def editar_utilizador(id):
    utilizador = Utilizadores.query.filter_by(id=id).first()
    body = request.get_json()
    try:
        if ('email' in body):
            utilizador.email = body['email']
        if ('password' in body):
            utilizador.password = body['password']
        db.session.add(utilizador)
        db.session.commit()
        return gerar_resposta(200, "utilizadores", utilizador.to_json(), "Atualizado com sucesso")
    except Exception as e:
        print('Erro', e)
        return gerar_resposta(400, "utilizadores", {}, "Erro ao atualizar")

#UPDATE VEICULO ROUTE
@app.route("/editarVeiculo/<id>", methods=["PUT"])
def edita_veiculos(id):
    veiculo = Veiculos.query.filter_by(id=id).first()
    body = request.get_json()
    try:
        if ('tipo' in body):
            veiculo.tipo = body['tipo']
        if ('device_id' in body):
            veiculo.device_id= body['device_id']
        db.session.add(veiculo)
        db.session.commit()
        return gerar_resposta(200, "veiculos", veiculo.to_json(), "Veiculo atualizado com sucesso")
    except Exception as e:
        print('Erro', e)
        return gerar_resposta(400, "veiculos", {}, "Erro ao atualizar veiculo")
   
   
@app.route("/homeInfo/<utilizador_id>", methods=["GET"])
@token_required
def homeInfo(current_user,utilizador_id):
    veiculos=Veiculos.query.filter_by(utilizador_id=current_user.id).all()
    response=len(veiculos)
    for i in veiculos:
        aux=Coordenadas.query.filter_by(veiculo_id=i.id).order_by(desc(Coordenadas.id)).first()
    if(aux!=None):
        return gerar_resposta(200, "info",{"nrveiculos" : response, "hora":aux.created_date.strftime("%m/%d/%Y, %H:%M")},"")
    else:
        return gerar_resposta(200, "info",{"nrveiculos" : response, "hora":"Informações indisponiveis neste momento."},"")

    
    
   
#GET VEICULOS POR USER ID 
@app.route("/frota/<utilizador_id>", methods=["GET"])
@token_required
def get_veiculos(current_user,utilizador_id):
    veiculo_object = Veiculos.query.filter_by(utilizador_id=current_user.id).all()
    veiculo_json=[veiculos.to_json() for veiculos in veiculo_object]
    return gerar_resposta(200, "veiculos", veiculo_json)

#ADD COORDENADAS DB
def adicionar_coordenadas(data):#, receber coordenadas):
    aux=data.split(',')
    device_id=aux[2]
    veiculo=Veiculos.query.filter_by(device_id=device_id).first()
    coordenadas = Coordenadas(latitude=aux[0],longitude=aux[1],veiculo_id=veiculo.id)
    db.session.add(coordenadas)
    db.session.commit()

#GET LAST COORDENADAS
def get_last_coordenadas(veiculo_id):
    coordenadas=Coordenadas.query.filter_by(veiculo_id=veiculo_id).order_by(desc(Coordenadas.id)).first()
    return coordenadas


#getVeiculosbyUserID
def getVeiculosbyUserID(utilizador_id):
    veiculos = Veiculos.query.filter_by(utilizador_id=utilizador_id).all()
    return veiculos

#GENERETE MAPA ROUTE
@app.route('/mapa/<utilizador_id>',methods=['GET'])
@token_required
def localization(current_user,utilizador_id):
    veiculos=getVeiculosbyUserID(current_user.id)
    array=[]
    array2=[]
    for i in veiculos:
        if(get_last_coordenadas(i.id)!=None):
            array.append(get_last_coordenadas(i.id).to_json())
            array2.append(i.to_json())
            
    filename = os.path.join(app.static_folder, '', 'hospitais.json')
    with open(filename) as test_file:
        hospitais= json.load(test_file)
    
    return gerar_resposta(200,"data",{"coordenadas":array,"veiculos":array2,"hospitais":hospitais})





if __name__=="__main__":
    client = mqtt.Client("teste")
    client.on_connect = on_connect
    client.on_message = on_message
    client.tls_set()
    client.username_pw_set('teste-lpi@ttn',password='NNSXS.CC4YFOCSK6RASFCASXQBNEXKOHCOAWS7OPCRBEY.ROK7L35RKDO5FCUYK5COL5OWBN4Z5MTMG46JQEY6LCSHZTEUCCGA')
    client.connect('eu1.cloud.thethings.network', 8883, 60)  
    client.loop_start()
    app.run(debug=True)