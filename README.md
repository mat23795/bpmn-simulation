# BPMN Simulation
Progetto di Tesi Magistrale di Caputo Matteo e Lazazzera Pierluigi.

Lo scopo di questo progetto di tesi è quello di realizzare una web app che, dato un diagramma BPMN, permetta l'aggiunta, la modifica e la rimozione di elementi di simulazione dello standard BPSim.


### Requisiti
È garantito il corretto funzionamento dell'applicazione per diagrammi BPMN che seguono correttamente la notazione imposta dallo standard BPMN, ai quali, con la web-app, è possibile aggiungere dei parametri di simulazione.

Possono anche essere utilizzati diagrammi BPMN che contengono già una notazione BPSIM: in tal caso se la notazione inserita è coerente con lo standard BPSIM, questi parametri di simulazione saranno mostrati nella web-app e sarà possibile modificarli, eliminarli o crearne di nuovi.

Documentazione:

* BPMN: https://www.omg.org/spec/BPMN/2.0.2/PDF

* BPSim: http://bpsim.org/specifications/2.0/WFMC-BPSWG-2016-01.pdf


Per il corretto funzionamento della web-app occorre, inoltre, avere installato _npm_ e aver eseguito il seguente comando

```
npm install
```

### Run 

Per eseguire il progetto in locale con Google Chrome utilizzare il seguente comando
```
npm run all
```

Per eseguire il progetto con _Electron_ utilizzare il seguente comando
```
npm start
```

Nella cartella [/resources](/../../tree/master/resources) sono presenti una serie di file con notazione BPSim inclusa, usabili per capire il funzionamento della web app ed è anche presente un file senza notazione BPSim.

### Test

Per eseguire il test relativo alla struttura dati presente in questo progetto occorre eseguire il seguente comando 
```
npm test
```

Per eseguire il test relativo all'interfaccia presente in questo progetto occorre eseguire i seguenti comandi
```
sudo apt-get install xvfb libgtk2.0-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2
npm run cypress:open
```
