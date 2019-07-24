# BPMN Simulation
Progetto di Tesi Magistrale di Caputo Matteo e Lazazzera Pierluigi.

Lo scopo di questo progetto di tesi è quello di realizzare una web app che, dato un diagramma BPMN, permetta l'aggiunta, la modifica e la rimozione di elementi di simulazione dello standard BPSIM.


### Requisiti
È garantito il corretto funzionamento dell'applicazione per diagrammi BPMN che seguono correttamente la notazione imposta dallo standard BPMN, ai quali, con la web-app, è possibile aggiungere dei parametri di simulazione.

Possono anche essere utilizzati diagrammi BPMN che contengono già una notazione BPSIM: in tal caso se la notazione inserita è coerente con lo standard BPSIM, questi parametri di simulazione saranno mostrati nella web-app e sarà possibile modificarli, eliminarli o crearne di nuovi.


Notazione BPMN: https://www.omg.org/spec/BPMN/2.0.2/PDF

Notazione BPSIM: http://bpsim.org/schemas/2.0/


Per il corretto funzionamento della web-app occorre, inoltre, avere installato _npm_.

### Run 

Per lanciare la webapp occorre prima installare una serie di dipendenze
```
npm install
```

Per eseguire il progetto in locale (Google Chrome) utilizzare il seguente comando
```
npm run all
```

Per eseguire il progetto con _Electron_ utilizzare il seguente comando
```
npm start
```

Nella cartella [/resources](/../../tree/master/resoruces) sono presenti una serie di file con notazione BPSIM inclusa, usabili per capire il funzionamento della web app.
