# BPMN Simulation
Progetto di Tesi Magistrale di Caputo Matteo e Lazazzera Pierluigi

Lo scopo di questo progetto è quello di realizzare una web app che, dato un diagramma _BPMN_, permetta l'aggiunta, la modifica e la rimozione di elementi di simulazione dello standard _BPSIM_.


### Requisiti
È garantito il corretto funzionamento dell'applicazione per diagrammi _BPMN_ che seguono correttamente la notazione imposta dallo standard _BPMN_, ai quali, con la web-app, è possibile aggiungere dei parametri di simulazione.
Possono anche essere utilizzati diagrammi _BPMN_ che contengono già una notazione _BPSIM_: in tal caso se la notazione inserita è coerente con lo standard _BPSIM_, questi parametri di simulazione saranno mostrati nella web-app e sarà possibile modificarli, eliminarli o crearne di nuovi.

Notazione _BPSIM_: http://bpsim.org/schemas/2.0/

Per il corretto funzionamento della web-app occorre, inoltre, avere installato _npm_.

### Run 

Per lanciare la webapp occorre prima installare una serie di dipendenze
```
npm install
```

Per eseguire il progetto in locale (_Google Chrome_) utilizzare il seguente comando
```
npm run all
```

Per eseguire il progetto con _Electron_ utilizzare il seguente comando
```
npm start
```

Nella cartella [/resources] sono presenti una serie di file con notazione _BPSIM_ inclusa, usabili per capire il funzionamento della web app.
