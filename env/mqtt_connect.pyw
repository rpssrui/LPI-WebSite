import paho.mqtt.client as mqtt
import json

def on_connect(client, userdata, flags, rc):
    print('Connected with result code '+str(rc))
    client.subscribe('v3/+/devices/+/up')
    
def on_message(client, userdata, msg):
    mensagem = json.loads(msg.payload)
    values = mensagem['uplink_message']
    print(values['decoded_payload'])
    
def returnValues(client, userdata, msg):
    mensagem = json.loads(msg.payload)
    values = mensagem['uplink_message']
    return values['decoded_payload']
    

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.tls_set()
client.username_pw_set('teste-lpi@ttn',password='NNSXS.CC4YFOCSK6RASFCASXQBNEXKOHCOAWS7OPCRBEY.ROK7L35RKDO5FCUYK5COL5OWBN4Z5MTMG46JQEY6LCSHZTEUCCGA')
client.connect('eu1.cloud.thethings.network', 8883, 60)  
client.loop_forever()
values=returnValues()