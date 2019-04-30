import firstdiagramXML from '../resources/firstDiagram.bpmn';
import bpmn_example1 from '../resources/1_CarRepairProcessV1.bpmn';
import bpmn_example2 from '../resources/2_CarRepairProcessV2.bpmn';
import bpmn_example3 from '../resources/3_LoanProcessV1.bpmn';
import bpmn_example4 from '../resources/4_LoanProcessV2.bpmn';
import bpmn_example5 from '../resources/5_TechnicalSupportProcessV1.bpmn';
import bpmn_example6 from '../resources/6_TechnicalSupportProcessV1_1.bpmn';
import bpmn_example7 from '../resources/7_TechnicalSupportProcessV2.bpmn';

import {DateTime, DurationParameter} from "./types/parameter_type/ConstantParameter";
import {BPSimData} from "./types/scenario/BPSimData";
import {Scenario} from "./types/scenario/Scenario";
import {factory} from "./types/factory";
import {ResultType} from "./types/parameter_type/ResultType";
import {Parameter} from "./types/parameter_type/Parameter";
import {PropertyType} from "./types/parameters/PropertyType";

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

        // * rimozione commenti dal xml perché creano problemi con il parsing
        const regExpRemoveComments = /(\<!--.*?\-->)/g;
        xml = xml.replace(regExpRemoveComments,"");

        //TODO creare qui la funzine che produce una sola volta l'obj e lo passiamo alle altre funzioni

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





    // parte completamento form con dati esistenti
    // let parser = new DOMParser();
    // let xmlDoc = parser.parseFromString(xml, "text/xml");

    // * elemento XML "extensionElements" che contiene tutti gli elementi della simulazione
    let extensionElementXML = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "extensionElements");
    let dataTree; // * variabile che contiene la struttura dati

    dataTree = xml2tree(extensionElementXML[0]);
    let dataTreeObj = dataTree[1];

    let scenarios = dataTreeObj.scenario;

    let numScenarios = scenarios.length;

    for(let i = 0; i < numScenarios; i++) {
        $('#scenario-picker').append($('<option>', {
            value: i+1,
            text: i+1
        }));
    }

    // $('#scenario-picker').append($('<option>', {
    //     value: 2,
    //     text: 2
    // }));

    refreshFormFieds(scenarios);


    $('#scenario-picker')
        .on('change', function () {
            refreshFormFieds(scenarios);
        });


}


// * Funzione di supporto per settare i valori nel form se presenti, altrimenti viene messo undefined 
function setField(inputElement, valueToSet){
    if(valueToSet != undefined){
        inputElement.val(valueToSet);
    }else{
        inputElement.val(undefined);
    }
}

// * Funzione che aggiorna i campi in base allo scenario selezionato
function refreshFormFieds(scenarios){
    let scenarioSelected = $('#scenario-picker').val();
    if(scenarioSelected != "" ){

        scenarioSelected=scenarioSelected-1;
        
        let idScenarioInput = $('#scenario-id-input');
        let idScenarioVal = scenarios[scenarioSelected].id;
        setField(idScenarioInput, idScenarioVal);

        let nameScenarioInput = $('#scenario-name-input');
        let nameScenarioVal = scenarios[scenarioSelected].name
        setField(nameScenarioInput, nameScenarioVal);

        let descriptionScenarioInput = $('#scenario-description-input');
        let descriptionScenarioVal = scenarios[scenarioSelected].description;
        setField(descriptionScenarioInput, descriptionScenarioVal);
        
        let createdScenarioInput = $('#scenario-created-input');
        let createdScenarioVal = scenarios[scenarioSelected].created;
        setField(createdScenarioInput, createdScenarioVal);

        let modifiedScenarioInput = $('#scenario-modified-input');
        let modifiedScenarioVal = scenarios[scenarioSelected].modified;
        setField(modifiedScenarioInput, modifiedScenarioVal);

        let authorScenarioInput = $('#scenario-author-input');
        let authorScenarioVal = scenarios[scenarioSelected].author;
        setField(authorScenarioInput, authorScenarioVal);

        let vendorScenarioInput = $('#scenario-vendor-input');
        let vendorScenarioVal = scenarios[scenarioSelected].vendor;
        setField(vendorScenarioInput, vendorScenarioVal);

        let versionScenarioInput = $('#scenario-version-input');
        let versionScenarioVal = scenarios[scenarioSelected].version;
        setField(versionScenarioInput, versionScenarioVal);
        
    
    }else{
        //TODO valutare se settare defaults e considerare aggiunta scenario
    }



}

// * Funzione per parsare l'XML ed eseguire le azioni sugli elementi della simulazione
function xmlParsing(xml){
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, "text/xml");

    // * elemento XML "extensionElements" che contiene tutti gli elementi della simulazione
    let extensionElementXML = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "extensionElements");

    // * elemento XML delle definizioni
    let definitionsTagXML = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "definitions");

    // * prefisso bpmn (es. semantic, bpmn)
    const bpmnPrefix = definitionsTagXML[0].prefix;
    let bpsimPrefix = "bpsim"; // * default

    let dataTree; // * variabile che contiene la struttura dati

    if (extensionElementXML.length == 0) {
        //TODO scrivere xml in base a dati della struttura presi da form fields
        //TODO 1) field2emptytree 2) tree2xml
    }else{
        // * Fase 1 xml2tree
        bpsimPrefix = extensionElementXML[0].childNodes[1].prefix;

        // * Leggere bpsim e inserirlo nella struttura dati
        dataTree = xml2tree(extensionElementXML[0])
        // console.log("Struttura ad albero"); //TODO REMOVE
        // console.log(dataTree); //TODO REMOVE

        // * Fase 2 field2tree


        // * rimozione vecchio BPSimData
        // extensionElementXML[0].removeChild(xmlDoc.getElementsByTagNameNS(bpsimNamespaceURI, "BPSimData")[0]);

    }

    // * Fase 3 tree2xml (comune per entrambi i casi sia che ci sia simulazione che senza)
    let dataTreeObj = dataTree[1];

    console.log(extensionElementXML);
    extensionElementXML[0].appendChild(dataTreeObj.toXMLelement(bpsimPrefix));

    console.log(xmlDoc);

    // console.log(extensionElementXML);



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
    if (node.localName === "ResultRequest") { //prendere testo nel tag per result request
        nodeObject = factory[node.localName][node.textContent];
    } else {
        nodeObject = new factory[node.localName]();
        // console.log(isParameter(node.localName)+"   "+node.localName); //TODO remove
        for (let j = 0; j < node.attributes.length; j++) {
            // if seguente serve a creare un array di calendar poiché validFor pretende un array di calendar
            if(node.attributes[j].localName === "validFor"){
                let tempArray = [];
                tempArray.push(node.attributes[j].value);
                nodeObject[node.attributes[j].localName] = tempArray;
            }else{
                nodeObject[node.attributes[j].localName] = node.attributes[j].value;
            }
        }

        //TODO REMOVE
        // if(node.localName === "Scenario"){
        //     console.log(node.attributes);
        //     console.log(node);
        //     console.log(nodeObject);
        // }

        // if per salvare il contenuto di testo del tag xml calendar
        if(node.localName === "Calendar"){
            nodeObject["calendar"] = node.textContent;
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
       
        // creare un Parameter con value avvalorato correttamente
        if(isParameter(nodoFiglio[0].localName)){
            let parameterFieldsToDelete = [];
            for(let i = 0; i < Object.keys(nodoFiglio[1]).length; i++){
                // salvo tutti quei parametri che si sono creati in più ovvero quelli che non iniziano per '_'
                if(Object.keys(nodoFiglio[1])[i].charAt(0) != "_"){
                    let temp = nodoFiglio[1][Object.keys(nodoFiglio[1])[i]];
                    parameterFieldsToDelete.push(temp);
                }
            }
            let tempResultRequest = nodoFiglio[1].resultRequest;
            nodoFiglio[1] = new factory[nodoFiglio[0].localName]();
            nodoFiglio[1].resultRequest = tempResultRequest;
            nodoFiglio[1].value = parameterFieldsToDelete;
            if(isArrayAttribute(nodoFiglio[0].localName)){
                let tempArray = [];
                tempArray.push(nodoFiglio[1]);
                nodoObject[nameAttr] = tempArray;
            } else{  
                nodoObject[nameAttr] = nodoFiglio[1];
            }
        }else{
            if(isArrayAttribute(nodoFiglio[0].localName)){
                let tempArray = [];
                tempArray.push(nodoFiglio[1]);
                nodoObject[nameAttr] = tempArray;
            } else{
                nodoObject[nameAttr] = nodoFiglio[1];
            }
        }
        numFigli--;
    }

    let nodo_nodoObj = [];
    nodo_nodoObj.push(nodo);
    nodo_nodoObj.push(nodoObject);
    return nodo_nodoObj;
}

// * Funzione di appoggio per scoprire se un campo è di tipo Parameter
function isParameter(field){
    let fields = ["TriggerCount", "InterTriggerTimer", "Probability", "Condition", "Start", "Warmup", "ElapsedTime",
        "TransferTime", "QueueTime", "WaitTime", "ProcessingTime", "ValidationTime", "ReworkTime", "LagTime",
        "Availability", "Quantity", "Selection", "Role", "Interruptible", "Priority", "QueueLength", "FixedCost",
        "UnitCost", "Duration", "Property"];

    return fields.includes(field);
}

// * Funzione di appoggio che permette di capire se un attributo è di tipo array
function isArrayAttribute(attribute){
    let attributes = ["Scenario", "ElementParameters", "VendorExtensions", "PropertyParameters", "ParameterValue",
    "Calendar", "UserDistributionDataPoint", "ConstantParameter", "Property", "Role", "ResultRequest"];

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
    });


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
    // openDiagram(bpmn_example1);
    // openDiagram(bpmn_example2);
    // openDiagram(bpmn_example3);
    // openDiagram(bpmn_example4);
    // openDiagram(bpmn_example5);
    // openDiagram(bpmn_example6);
    openDiagram(bpmn_example7);

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
