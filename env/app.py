from sqlite3 import connect
from xml.sax import make_parser
from flask import Flask, redirect, render_template, url_for, request, redirect, Response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import folium


import json

app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///first.db'
app.config['SECRET_KEY']='thisisasecretkey'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db=SQLAlchemy(app)


#tabelaUtilizadores
class Utilizadores(db.Model):
    __tablename__ = 'utilizadores'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
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
    matricula = db.Column(db.String(200), unique=True, nullable=False)
    lopy= db.Column(db.String(200), nullable=False)
    
    def to_json(self):
        return {
            "id": self.id,
            "matricula": self.matricula,
            "lopy": self.lopy,
            
        }
    
    
#funcoes aux
def getLongitude():
    longitude=-8.60680757276
    return longitude

def getLatitude():
    latitude=41.1706859839
    return latitude

def gerar_response(status, nome_do_conteudo, conteudo, mensagem=False):
    body = {}
    body[nome_do_conteudo] = conteudo

    if (mensagem):
        body["mensagem"] = mensagem

    return Response(json.dumps(body), status=status, mimetype="application/json")    
    
@app.route("/login", methods=["POST"])
def utilizadores_login():
    data = request.get_json() #data=conteudo do form
    utilizador_objeto = Utilizadores.query.filter_by(email=data['email']).first()
    if utilizador_objeto:
        utilizador_json = utilizador_objeto.to_json()
        # if verify_password(data['password'], utilizador_json['password_hash']):
        if utilizador_json['password_hash'] == data['password']:
            return gerar_response(200, "login", utilizador_json)
        return gerar_response(400, "login", {}, "Wrong Credentials")
    else:
        return gerar_response(400, "login", {}, "User Not Found")


@app.route("/registo", methods=["POST"])
def cria_utilizador():
    body = request.get_json()
    if(Utilizadores.query.filter_by(email=body["email"]).first()):
        return gerar_response(400, "utilizadores", {}, "Já existe um utilizador registado com este email")
    try:
        utilizador = Utilizadores(email=body["email"],password_hash=body["password"])
        db.session.add(utilizador)
        db.session.commit()
        return gerar_response(200, "utilizadores", utilizador.to_json(), "Criado com sucesso")
    except Exception as e:
        print('Erro', e) #debug
        return gerar_response(400, "utilizadores", {}, "Ocorreu um erro ao fazer o seu registo, tente novamente") #frontend testa se retornaa Uuilizadores vazio provavelmente

@app.route("/registo", methods=["POST"])
def adicionar_veiculo():
    body = request.get_json()
    if(Veiculos.query.filter_by(matricula=body["matricula"]).first()):
        return gerar_response(400, "veiculos", {}, "Este veiculo já se encontra registo")

@app.route('/',methods=['POST','GET'])
def index():
        return render_template('index.html')

@app.route('/mapa',methods=['POST','GET'])
def localization():
    start_coords = (41.1579448,-8.6291053)
    mapa = folium.Map(location=start_coords, zoom_start=9)
    folium.Marker(
        location=[getLatitude(),getLongitude()],
        popup="Universidade Fernando Pessoa",
        icon=folium.Icon(color="red", icon="info-sign"),
        ).add_to(mapa)
    return mapa._repr_html_()


        
if __name__=="__main__":
    app.run(debug=True)