import firstdiagramXML from '../resources/firstDiagram.bpmn';
import carRepairProcessXML from '../resources/CarRepairProcess.bpmn';
import {DateTime, DurationParameter} from "./types/parameter_type/ConstantParameter";
import {BPSimData} from "./types/scenario/BPSimData";
import {Scenario} from "./types/scenario/Scenario";
import {factory} from "./types/factory";
import {ResultType} from "./types/parameter_type/ResultType";
import {Parameter} from "./types/parameter_type/Parameter";

const bpmnNamespaceURI = "http://www.omg.org/spec/BPMN/20100524/MODEL";
const bpsimNamespaceURI = "http://www.bpsim.org/schemas/1.0";

var container = $('#js-drop-zone');


var viewer = new BpmnJS({
    container: $('#js-canvas'),
    height: 500
});


function openDiagram(xml) {

    viewer.importXML(xml, function (err) {

        //TODO gestire errore caricamento
        // if (err) {
        //     container
        //         .removeClass('with-diagram')
        //         .addClass('with-error');
        //
        //     container.find('.error pre').text(err.message);
        //
        //     console.error(err);
        // } else {
        //     container
        //         .removeClass('with-error')
        //         .addClass('with-diagram');
        // }

        viewer.get('canvas').zoom('fit-viewport');
        // TODO vedere scrollbar 
        // $('.djs-container').css('overflow', 'auto');
        
        // * creare dal XML il form field
        createFormFields(xml);

        // * funzione per parsare l'XML
        xmlParsing(xml);

    });
}

// * Funzione per creare il form in base all' XML
function createFormFields(xml) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, "text/xml");

    // const bpmnPrefix = definitionsTag[0].prefix;


    // * elemento XML "process" che contiene tutti gli elementi del diagramma
    let bpmnElementXML = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "process");
    // console.log("Elementi del bpmn"); //TODO REMOVE
    // console.log(bpmnElementXML[0]); //TODO REMOVE

    // * array di tutti gli elementi presenti in "process"
    var nodes = Array.prototype.slice.call(bpmnElementXML[0].getElementsByTagName("*"), 0);
    // console.log("Array di elementi del bpmn"); //TODO REMOVE
    // console.log(nodes); //TODO REMOVE

    // * variabile che contiene solo i task
    var nodesTask = [];
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].localName == "task") {

            nodesTask.push(nodes[i]);
        }
        // console.log(nodes[i].localName);
    }
    // console.log("Array di soli task"); //TODO REMOVE
    // console.log(nodesTask); //TODO REMOVE

    // * elemnto HTML contenente la sezione dei task
    let taskForm = $('#task-form');

    // * settaggio del task-form 'visibile'. Di default è settato a none
    taskForm.css('display', 'block');

    // * modo1 creazione label
    let label1 = jQuery('<label/>', {
        for: 'vendor1',
        text: 'Vendor1'
    });
    // * modo1 creazione input field
    let input1 = jQuery('<input/>', {
        type: 'text',
        class: 'form-control form-control-input',
        id: 'vendor1',
        value: 'Caputo & Lazazzera'
    });

    taskForm.append(label1);
    taskForm.append(input1);

    //TODO rimuovere modi seguenti
    // * modo2 creazione label
    // let label2 = $("<label for=\"vendor2\">Vendor2</label>");
    // * modo2 creazione input field
    // let input2 = $("<input type=\"text\" class=\"form-control form-control-input\" id=\"vendor2\" value=\"Caputo & Lazazzera\">");
    // taskForm.append(label2);
    // taskForm.append(input2);
}

// * Funzione per parsare l'XML ed eseguire le azioni sugli elementi della simulazione
function xmlParsing(xml){
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, "text/xml");


    // * elemento XML "extensionElements" che contiene tutti gli elementi della simulazione
    let extentionElementXML = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "extensionElements");

    // * elemento XML delle definizioni
    let definitionsTagXML = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "definitions");

    // * prefisso bpmn (es. semantic, bpmn)
    const bpmnPrefix = definitionsTagXML[0].prefix;
    let bpsimPrefix = "bpsim"; //default


    if (extentionElementXML.length == 0) {
        //TODO scrivere xml in base a dati della struttura presi da form fields
        //TODO 1) field2emptytree 2) tree2xml
    }else{
        // * Fase 1 xml2tree
        bpsimPrefix = extentionElementXML[0].prefix;

        // * Leggere bpsim e inserirlo nella struttura dati
        let dataTree = xml2tree(extentionElementXML[0])
        console.log("Struttura ad albero"); //TODO REMOVE
        console.log(dataTree); //TODO REMOVE

        // * Fase 2 field2tree

        // * Fase 3 tree2xml
    }

}

// * Funzione che parsa il file .bpmn e popola una struttura dati con le info della simulazione
function xml2tree(bpsimDataXML) {
    // * array di tutti gli elementi presenti in "extensionElements", ovvero BPSimData
    var nodes = Array.prototype.slice.call(bpsimDataXML.getElementsByTagName("*"), 0);
   
    return buildDataTree(nodes[0], createObj(nodes[0]));
}

// * Funzione che dato un nodo ti restituisce l'oggetto relativo al nodo
function createObj(node) {
    let nodeObject;
    if (node.localName === "ResultRequest") {
        nodeObject = factory[node.localName][node.textContent];
    } else {
        nodeObject = new factory[node.localName]();
        for (let j = 0; j < node.attributes.length; j++) {
            nodeObject[node.attributes[j].localName] = node.attributes[j].value;
        }
    }
    return nodeObject
}

// * Funzione ricorsiva che popola una struttura dati ad albero in base ai valori degli elementi della simulazione
function buildDataTree(nodo, nodoObject) {

    let numFigli = nodo.childElementCount;
    let nodoFiglio;

    let childNodes=nodo.childNodes;
    let temp=[];
    for(let i = 0; i<childNodes.length;i++){
        // * togliamo dai figli quelli che hanno campo "#text" poiche sarebbero gli invii dell'XML
        if(childNodes[i].nodeName != '#text'){
            temp.push(childNodes[i]);
        }
    }
    childNodes = temp;

    while (numFigli > 0) {
        let childToPass = childNodes.shift(); // * shift = pop ma fatta in testa
        nodoFiglio = buildDataTree(childToPass, createObj(childToPass));
        let nameAttr = nodoFiglio[0].localName.charAt(0).toLowerCase() + nodoFiglio[0].localName.slice(1);

        if(isArrayAttribute(nodoFiglio[0].localName)){
            // * attributo array di un nodo viene popolato in maniera differente rispetto ad attributo atomico
            let tempArray = [];
            tempArray.push(nodoFiglio[1]);
            nodoObject[nameAttr] = tempArray;
        } else {
            nodoObject[nameAttr] = nodoFiglio[1];
        }
        numFigli--;
    }

    let nodo_nodoObj = [];
    nodo_nodoObj.push(nodo);
    nodo_nodoObj.push(nodoObject);
    return nodo_nodoObj;
}

// * Funzione di appoggio che permette di capire se un attributo è di tipo array
function isArrayAttribute(attribute){
    let attributes = ["Scenario", "ElementParameters", "VendorExtensions", "PropertyParameters", "ParameterValue", 
    "Calendar", "UserDistributionDataPoint", "ConstantParameter"];
    
    return attributes.includes(attribute);
}

//! TODO RIMUOVERE QUESTA FUNZIONE
// function xmlParsing(xml) {
//     let parser = new DOMParser();
//     let xmlDoc = parser.parseFromString(xml, "text/xml");

//     const bpmnNamespaceURI = "http://www.omg.org/spec/BPMN/20100524/MODEL";
//     const bpsimNamespaceURI = "http://www.bpsim.org/schemas/1.0";


//     let bpsimNS = xmlDoc.getElementsByTagNameNS(bpsimNamespaceURI, "BPSimData");
//     //VA FATTO FOREACH PER OGNI SCENARIO

//     //ci colleghiamo al tag definitions bpmn
//     let definitionsTag = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "definitions");

//     //prefisso bpmn (es. semantic, bpmn)
//     const bpmnPrefix = definitionsTag[0].prefix;
//     let bpsimPrefix = "bpsim"; //default


//     if (bpsimNS.length == 0) {
//         //Aggiungere namespace bpsim al namespace
//         definitionsTag[0].setAttribute("xlmns:" + bpsimPrefix, bpsimNamespaceURI);

//         //Aggiunta bpmn:relationship
//         let relationship = xmlDoc.createElement(bpmnPrefix + ":relationship");
//         relationship.setAttribute("type", "BPSimData");
//         definitionsTag[0].appendChild(relationship);

//         //Aggiunta bpmn:extensionElements
//         let extensionElements = xmlDoc.createElement(bpmnPrefix + ":extensionElements");
//         relationship.appendChild(extensionElements);

//         //Aggiunta bpsim:BPSimData
//         let bpsimData = xmlDoc.createElement(bpsimPrefix + ":BPSimData");
//         extensionElements.appendChild(bpsimData);

//         //Aggiunta bpsim:Scenario
//         let scenario = xmlDoc.createElement(bpsimPrefix + ":Scenario");
//         // scenario.setAttribute("id", $('#id').val());
//         // scenario.setAttribute("name", $('#name').val());
//         // scenario.setAttribute("description", $('#description').val());
//         //CREATED
//         //MODIFIED
//         // scenario.setAttribute("author", $('#author').val());
//         // scenario.setAttribute("vendor", $('#vendor').val());
//         // scenario.setAttribute("version", $('#version').val());

//         bpsimData.appendChild(scenario);

//         console.log(bpsimData);
//     } else {
//         //TODO inserire nuovi valori del xml letto
//         bpsimPrefix = bpsimNS[0].prefix;
//         console.log("ciao " + bpsimPrefix);
//     }
//     console.log(xmlDoc);

//     // AGGIUNGERE TAG IN SCRITTURA XML
//     // prova = xmlDoc.createElement("rel");
//     // bpsimNS = xmlDoc.getElementsByTagNameNS("http://www.omg.org/spec/BPMN/20100524/MODEL", "definitions");
//     // bpsimNS[0].appendChild(prova);
//     // console.log(bpsimNS[0]);


//     //prova per leggere un valore di un attributo e settare uno nuovo o lo stesso
//     // bpsimNS = xmlDoc.getElementsByTagNameNS("http://www.bpsim.org/schemas/1.0", "DurationParameter");
//     // console.log(bpsimNS);
//     // bpsimNS[0].setAttribute("value", "PROVA")
//     // console.log(bpsimNS[0].getAttribute("value"));
//     // console.log(bpsimNS[0]);
// }

// * Funzione che si mette in 'ascolto' della drop-zone
function registerFileDrop(container, callback) {

    function handleFileSelect(e) {
        e.stopPropagation();
        e.preventDefault();

        var files = e.dataTransfer.files;

        var file = files[0];

        var reader = new FileReader();

        reader.onload = function (e) {

            var xml = e.target.result;

            // console.log(e.target);

            // * mette visibile il div del diagramma e toglie quello della drop-zone
            $('#js-drop-zone').css('display', 'none');
            $('#js-canvas').css('display', 'block');
            
            // * richiama la funzione openDiagram
            callback(xml);
        };

        reader.readAsText(file);
    }

    function handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();

        e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    container.get(0).addEventListener('dragover', handleDragOver, false);
    container.get(0).addEventListener('drop', handleFileSelect, false);
}

$('#js-drop-zone')
    .on('dragover dragenter', function () {
        $('#js-drop-zone').css('background-color', 'AliceBlue');
    })
    .on('dragleave dragend drop', function () {
        $('#js-drop-zone').css('background-color', 'white');
    })

// * Check file api availability
if (!window.FileList || !window.FileReader) {
    window.alert(
        'Looks like you use an older browser that does not support drag and drop. ' +
        'Try using Chrome, Firefox or the Internet Explorer > 10.');
} else {

    //TODO remove these line
    $('#js-drop-zone').css('display', 'none');
    $('#js-canvas').css('display', 'block');
    // openDiagram(firstdiagramXML);
    openDiagram(carRepairProcessXML);
    // * END Remove


    registerFileDrop(container, openDiagram);
}


var eventBus = viewer.get('eventBus');

// * you may hook into any of the following events
var events = [
    'element.hover',
    'element.out',
    'element.click',
    'element.dblclick',
    'element.mousedown',
    'element.mouseup'
];

events.forEach(function (event) {

    eventBus.on(event, function (e) {
        // e.element = the model element
        // e.gfx = the graphical element

        // * funzione che al click nella zona del diagramma cambia il focus della zona delle properties
        // TODO cambiare la zona
        if (event == 'element.click') {
            // 
            var scrollPos = $("#exampleFormControlTextarea1").offset().top;
            $('#js-simulation').scrollTop(scrollPos);
        }


        if (!e.element.id.includes("label")) {
            // console.log(event + 'on' + e.element.id);
        } else {
            //TODO disabilitare css per le label
        }
    });

})
;
