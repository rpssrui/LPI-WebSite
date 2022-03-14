from sqlite3 import connect
from xml.sax import make_parser
from flask import Flask, redirect, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import folium
from mqtt_connect import values

import json

app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db=SQLAlchemy(app)



#funcoes aux
def getLongitude():
    longitude=-8.60680757276
    print
    return longitude

def getLatitude():
    latitude=41.1706859839
    return latitude



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