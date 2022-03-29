from ctypes import get_last_error
from subprocess import REALTIME_PRIORITY_CLASS
from flask import Flask, redirect, render_template, url_for, request, redirect, Response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from time import gmtime,strftime
import folium
from multiprocessing import Process,Pipe
import json
import paho.mqtt.client as mqtt
import json
from flask_cors import CORS
from sqlalchemy import desc


app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///first.db'
app.config['SECRET_KEY']='thisisasecretkey'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db=SQLAlchemy(app)
CORS(app)

def on_connect(client, userdata, flags, rc):
    print('Connected with result code '+str(rc))
    client.subscribe('v3/+/devices/+/up')
    
def on_message(client, userdata, msg):
    mensagem = json.loads(msg.payload)
    uplink = mensagem['uplink_message']
    decoded_payload=uplink['decoded_payload']
    coordenadas=decoded_payload['str']
    print("coordenadas: "+coordenadas)
    adicionar_coordenadas(1,coordenadas)
     

#tabelaUtilizadores
class Utilizadores(db.Model):
    __tablename__ = 'utilizadores'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(256), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    admin = db.Column(db.Boolean) 
      
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
    
    def to_json(self):
        return {
            "id": self.id,
            "matricula": self.matricula,
            "utilizador_id": self.utilizador_id,
        }

class Coordenadas(db.Model):
    __tablename__ = 'coordenadas'
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    veiculo_id = db.Column(db.Integer,db.ForeignKey('veiculos.id'))
    device_id = db.Column(db.String(256), nullable=True)
    
    def to_json(self):
        return {
            "id": self.id,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "veiculo_id": self.veiculo_id,
            "device_id": self.device_id
        }

#db.drop_all()
db.create_all()
    
#funcoes aux
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
    
    
#INDEX ROUTE
@app.route('/',methods=['POST','GET'])
def index():    
        return render_template('index.html')
        
#LOGIN ROUTE        
@app.route("/login", methods=["POST"])
def utilizadores_login():
    body = request.get_json() #data=conteudo do form
    utilizador_objeto = Utilizadores.query.filter_by(email=body['email']).first()
    if utilizador_objeto:
        utilizador_json = utilizador_objeto.to_json()
        if utilizador_json['password_hash'] == body['password']:
            return gerar_resposta(200, "login", utilizador_json)
        return gerar_resposta(400, "login", {}, "Wrong Credentials")
    else:
        return gerar_resposta(400, "login", {}, "User Not Found")

#REGISTER ROUTE
@app.route("/registo", methods=["POST"])
def cria_utilizador():
    body = request.get_json()
    if(Utilizadores.query.filter_by(email=body["email"]).first()):
        return gerar_resposta(400, "utilizadores", {}, "Já existe um utilizador registado com este email")
    try:
        utilizador = Utilizadores(email=body["email"],password_hash=body["password"])
        db.session.add(utilizador)
        db.session.commit()
        return gerar_resposta(200, "utilizadores", utilizador.to_json(), "Criado com sucesso")
    except Exception as e:
        print('Erro', e) #debug
        return gerar_resposta(400, "utilizadores", {}, "Ocorreu um erro ao fazer o seu registo, tente novamente") #frontend testa se retornaa Uuilizadores vazio provavelmente

#ADD VEICULO ROUTE
@app.route("/addVeiculos/<utilizador_id>", methods=["POST"])
def adicionar_veiculo(utilizador_id):
    body = request.get_json()
    if(Veiculos.query.filter_by(matricula=body["matricula"]).first()):
        return gerar_resposta(400, "veiculos", {}, "Este veiculo já se encontra registado")
    try:
        Veiculo = Veiculos(matricula=body["matricula"],utilizador_id=utilizador_id)
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
@app.route("/veiculos/<id>", methods=["DELETE"])
def remover_veiculos(id):
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
        return gerar_resposta(201, "utilizadores", utilizador.to_json(), "Atualizado com sucesso")
    except Exception as e:
        print('Erro', e)
        return gerar_resposta(400, "utilizadores", {}, "Erro ao atualizar")

#UPDATE VEICULO ROUTE
@app.route("/veiculos/<id>", methods=["PUT"])
def edita_veiculos(id):
    veiculo = Veiculos.query.filter_by(id=id).first()
    body = request.get_json()
    try:
        if ('matricula' in body):
            veiculo.matricula = body['matricula']
        if ('lopy' in body):
            veiculo.lopy = body['lopy']
        db.session.add(veiculo)
        db.session.commit()
        return gerar_resposta(200, "veiculos", veiculo.to_json(), "Veiculo atualizado com sucesso")
    except Exception as e:
        print('Erro', e)
        return gerar_resposta(400, "veiculos", {}, "Erro ao atualizar veiculo")
   
   
#GET VEICULOS POR USER ID 
@app.route("/frota/<utilizador_id>", methods=["GET"])
def get_veiculos(utilizador_id):
    veiculo_object = Veiculos.query.filter_by(utilizador_id=utilizador_id).all()
    veiculo_json=[veiculos.to_json() for veiculos in veiculo_object]
    return gerar_resposta(200, "veiculos", veiculo_json)

#ADD COORDENADAS DB
def adicionar_coordenadas(veiculo_id,data):#, receber coordenadas):
    aux=data.split(',')
    coordenadas = Coordenadas(latitude=aux[0],longitude=aux[1],veiculo_id=veiculo_id)
    db.session.add(coordenadas)
    db.session.commit()

#GET LAST COORDENADAS
def get_last_coordenadas(veiculo_id):
    coordenadas=Coordenadas.query.filter_by(veiculo_id=veiculo_id).order_by(desc(Coordenadas.id)).first()
    return coordenadas


#GENERETE MAPA ROUTE
@app.route('/mapa',methods=['POST','GET'])
def localization():
    coordenadas=get_last_coordenadas(1)
    return gerar_resposta(200,"coordenadas",coordenadas.to_json())


        

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.tls_set()
client.username_pw_set('teste-lpi@ttn',password='NNSXS.CC4YFOCSK6RASFCASXQBNEXKOHCOAWS7OPCRBEY.ROK7L35RKDO5FCUYK5COL5OWBN4Z5MTMG46JQEY6LCSHZTEUCCGA')
client.connect('eu1.cloud.thethings.network', 8883, 60)  
client.loop_start()

if __name__=="__main__":
    app.run(debug=True)