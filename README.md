# LPI-WebSite

01/13/2022: Instalação flask, inicio do desenvolvimento da API
02/13/2022: Instalação de pacotes, folium, SQLAlchemy e continuação do desenvolvimento da API
03/13/2022: Criado um script que através do mqtt client retira a informação recebida na aplicação do TTN

03/14/2022: Criação de rotas de registo e login

03/15/2022: Criação de rotas para adicionar, editar e remover veículos e utilizadores

03/16/2022: Instalação do React, inicio do desenvolvimento do frontend

03/18/2022: Automatização na gravação das coordenadas na base de dados, usando o handler de mensagens do mqtt client

03/19/2022: Funções de query à base de dados para consulta das ultimas coordenadas

03/20/2022: Conexão entre api e frontend, react recebe json com coordenadas(latitude e longitude) e já coloca um marker no mapa com as ultima entrada da tabela

03/21/2022: Frontend faz fetch à data(coordenadas) periodicamente, atualiza o marker no mapa conforme a ultima entrada da base dados
03/21/2022: Detetado um bug no handler do mqttclient, a função parece estar a ser chamada 2 vezes ao ser recebida apenas 1 mensagem levando a que sejam criada 1 entrada duplicada na base de dados

03/23/2022: Corrigido o bug no handler do mqttclient.

03/24/2022: Melhoria do mapa para apresentar a informação de cada veículo quando este for acedido.
03/24/2022: Alterações de desing, novos ícones entre outros.
03/24/2022: Alterações ao retorno de diversas rotas da API para incluirem novos dados como: timestamps, dados dos veículos, entre outros.
