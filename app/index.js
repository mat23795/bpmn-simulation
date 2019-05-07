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
var dataTreeGlobal;
var dataTreeObjGlobal;
var xmlGlobal;
var bpsimPrefixGlobal;
var bpmnPrefixGlobal;


var viewer = new BpmnJS({
    container: $('#js-canvas'),
    height: "695px" // poco minore di 700 per lasciare uno spazio prima del bordo finale
});


function openDiagram() {

    viewer.importXML(xmlGlobal, function (err) {


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

        viewer.get('canvas').zoom('fit-viewport'); //TODO Vedere se mantenere zoom
        // TODO vedere scrollbar
        $('.djs-container').css('overflow', 'auto');
        // $('.djs-container').css('height', '700px');


        // xmlGlobal=xml;
        // * rimozione commenti dal xml perché creano problemi con il parsing
        const regExpRemoveComments = /(\<!--.*?\-->)/g;
        xmlGlobal = xmlGlobal.replace(regExpRemoveComments,"");

        //TODO creare qui la funzine che produce una sola volta l'obj e lo passiamo alle altre funzioni
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlGlobal, "text/xml");

        // * elemento XML "extensionElements" che contiene tutti gli elementi della simulazione
        let extensionElementXML = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "extensionElements");

        // * elemento XML delle definizioni
        let definitionsTagXML = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "definitions");

        // * prefisso bpmn (es. semantic, bpmn)
        bpmnPrefixGlobal = definitionsTagXML[0].prefix;
        
        bpsimPrefixGlobal = "bpsim"; // * default

        if (extensionElementXML.length == 0) {
            

            // TODO gestire questione bpsim non esistente

            //TODO scrivere xml in base a dati della struttura presi da form fields
            //TODO 1) field2emptytree 2) tree2xml
        }else{
            // * Fase 1 xml2tree
            bpsimPrefixGlobal = extensionElementXML[0].childNodes[1].prefix;
    
            // * Leggere bpsim e inserirlo nella struttura dati
            dataTreeGlobal = xml2tree(extensionElementXML[0]);
            dataTreeObjGlobal = dataTreeGlobal[1];

            // * creare dal XML il form field
            createFormFields();

            // lo visualizzo

            // lo modifico

            // lo salvo

            extensionElementXML[0].appendChild(dataTreeObjGlobal.toXMLelement(bpsimPrefixGlobal));
            console.log("XML fase ricopiamento");//TODO remove
            console.log(xmlDoc);//TODO remove

            // console.log(extensionElementXML);
            
            // * aggiunta evento al bottone che calcola il bpsim per far generare l'xml 'aggiornato'
            $('#generate-bpsim')
                .on("click", function() {

                    let scenarioSelected = $('#scenario-picker').val();
                    saveDataTreeStructure(scenarioSelected);

                    extensionElementXML[0].appendChild(dataTreeObjGlobal.toXMLelement(bpsimPrefixGlobal));
                    console.log("XML fase modifica");//TODO remove
                    console.log(xmlDoc);//TODO remove

                });
    
        }


        

        // * funzione per parsare l'XML
        // xmlParsing();

    });
}

// * Funzione per creare il form in base all' XML
function createFormFields() {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xmlGlobal, "text/xml");

    // const bpmnPrefix = definitionsTag[0].prefix;


    // * elemento XML "process" che contiene tutti gli elementi del diagramma
    let bpmnElementXML = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "process");
    // console.log("Elementi del bpmn"); //TODO REMOVE
    // console.log(bpmnElementXML[0]); //TODO REMOVE


    let nodesTask = [];
    let nodesGateway = [];
    let nodesEvent = [];
    let nodesArrow = [];

    for(let i = 0; i<bpmnElementXML.length; i++){

        // * array di tutti gli elementi presenti in "process"
        let nodes = Array.prototype.slice.call(bpmnElementXML[i].getElementsByTagName("*"), 0);
        // console.log("Array di elementi del bpmn"); //TODO REMOVE
        // console.log(nodes); //TODO REMOVE

        // * avvaloramento variabile che contiene solo i task
        for (let j = 0; j < nodes.length; j++) {
            if (nodes[j].localName.toLowerCase().includes("task")) {

                nodesTask.push(nodes[j]);
            }
            // console.log(nodes[j].localName);
        }
        

        // * avvaloramento variabile che contiene solo i gateway
        for (let j = 0; j < nodes.length; j++) {
            if (nodes[j].localName.toLowerCase().includes("gateway")){

                nodesGateway.push(nodes[j]);
            }
            // console.log(nodes[j].localName);
        }
        

        // * avvaloramento variabile che contiene solo gli eventi
        for (let j = 0; j < nodes.length; j++) {
            if (nodes[j].localName.toLowerCase().includes("event")
            && ! nodes[j].localName.toLowerCase().includes("definition")){

                nodesEvent.push(nodes[j]);
            }
            // console.log(nodes[j].localName);
        }
        

        // * avvaloramento variabile che contiene solo le freccie
        for (let j = 0; j < nodes.length; j++) {
            if (nodes[j].localName.toLowerCase().includes("outgoing")||
                nodes[j].localName.toLowerCase().includes("incoming")){

                nodesArrow.push(nodes[j]);
            }
            // console.log(nodes[j].localName);
        }
        
    }

    console.log("Array di soli task"); //TODO REMOVE
    console.log(nodesTask); //TODO REMOVE

    console.log("Array di soli gateway"); //TODO REMOVE
    console.log(nodesGateway); //TODO REMOVE

    console.log("Array di soli eventi"); //TODO REMOVE
    console.log(nodesEvent); //TODO REMOVE

    console.log("Array di soli eventi"); //TODO REMOVE
    console.log(nodesArrow); //TODO REMOVE





    // * elemento HTML contenente la sezione degli element parameter
    let elementParameterHTML = $('#element-parameter-section-haveInner');
    let buttonElementParameterHTML = $('#elem-par-btn');
    buttonElementParameterHTML.data('clicked', false);
    
    

    let divElementParameter = jQuery('<div/>', {
        class: 'form-group',
        label: 'element-parameter-form'
    });


    let buttonTask = jQuery('<button/>', {
        class: 'collapsible button-collapsible-style',
        type: 'button',
        text: 'Task',
        id: 'button-task'
    });
    buttonTask.data('clicked', false);
    let divTask = jQuery('<div/>', {
        class: 'content',
        label: 'element-parameter-task-form',
        id: 'div-task'
    });

    let buttonGateway = jQuery('<button/>', {
        class: 'collapsible button-collapsible-style',
        type: 'button',
        text: 'Gateway',
        id: 'button-gateway'
    });
    buttonGateway.data('clicked', false);
    let divGateway = jQuery('<div/>', {
        class: 'content',
        label: 'element-parameter-gateway-form',
        id: 'div-gateway'
    });
    
    let buttonEvent = jQuery('<button/>', {
        class: 'collapsible button-collapsible-style',
        type: 'button',
        text: 'Event',
        id: 'button-event'
    });
    buttonEvent.data('clicked', false);
    let divEvent = jQuery('<div/>', {
        class: 'content',
        label: 'element-parameter-event-form',
        id: 'div-event'
    });


    

    // for che creano gli elementi grafici per ogni task, in base a quanti task sono presenti nel BPMN
    for(let counter = 0; counter<nodesTask.length; counter++){

        let labelElementRef;
        let elRef = nodesTask[counter].id;
        if(counter==0){
            labelElementRef = jQuery('<label/>', {
                class: 'label-new-element',
                // id: elRef,
                text: 'Element Ref: '+elRef,
            });

        }else{
            labelElementRef = jQuery('<label/>', {
                class: 'label-new-element',
                // id: elRef,
                text: 'Element Ref: '+nodesTask[counter].id,
                style: 'margin-top:15%'
            });
        }
        divTask.append(labelElementRef);
        


        let labelId = jQuery('<label/>', {
            for: 'task'+(counter+1)+'-id-input',
            text: 'ID'
        });
        
        let inputId = jQuery('<input/>', {
            type: 'text',
            class: 'form-control form-control-input',
            id: 'task'+(counter+1)+'-id-input-'+elRef,
            placeholder: 'Task Id'
        });
        divTask.append(labelId);
        divTask.append(inputId);


        //TODO eliminare
        // let labelVendor = jQuery('<label/>', {
        //     for: 'task'+(counter+1)+'-vendor-input',
        //     text: 'Vendor Extension'
        // });
        
        // let inputVendor = jQuery('<input/>', {
        //     type: 'text',
        //     class: 'form-control form-control-input',
        //     id: 'task'+(counter+1)+'-vendor-input',
        //     placeholder: 'Vendor DA FARE'
        // });
        // divTask.append(labelVendor);
        // divTask.append(inputVendor);



        
    }

    // TODO creare gli elementi corretti per i gateway
    for(let counter = 0; counter<nodesGateway.length; counter++){

        let labelElementRef;
        let elRef = nodesGateway[counter].id;
        if(counter==0){
            labelElementRef = jQuery('<label/>', {
                class: 'label-new-element',
                // id: elRef,
                text: 'Element Ref: '+elRef,
            });

        }else{
            labelElementRef = jQuery('<label/>', {
                class: 'label-new-element',
                // id: elRef,
                text: 'Element Ref: '+nodesGateway[counter].id,
                style: 'margin-top:15%'
            });
        }
        divGateway.append(labelElementRef);
        


        let labelId = jQuery('<label/>', {
            for: 'gateway'+(counter+1)+'-id-input',
            text: 'ID'
        });
        
        let inputId = jQuery('<input/>', {
            type: 'text',
            class: 'gateway-control form-control-input',
            id: 'gateway'+(counter+1)+'-id-input-'+elRef,
            placeholder: 'Gateway Id'
        });
        divGateway.append(labelId);
        divGateway.append(inputId);


    }

    // TODO creare gli elementi corretti per gli eventi
    for(let counter = 0; counter<nodesEvent.length; counter++){

    let labelElementRef;
    let elRef = nodesEvent[counter].id;
    if(counter==0){
        labelElementRef = jQuery('<label/>', {
            class: 'label-new-element',
            // id: elRef,
            text: 'Element Ref: '+elRef,
        });

    }else{
        labelElementRef = jQuery('<label/>', {
            class: 'label-new-element',
            // id: elRef,
            text: 'Element Ref: '+nodesEvent[counter].id,
            style: 'margin-top:15%'
        });
    }
    divEvent.append(labelElementRef);
    
    let labelId = jQuery('<label/>', {
        for: 'event'+(counter+1)+'-id-input',
        text: 'ID'
    });
    
    let inputId = jQuery('<input/>', {
        type: 'text',
        class: 'form-control form-control-input',
        id: 'event'+(counter+1)+'-id-input-'+elRef,
        placeholder: 'Event Id'
    });
    divEvent.append(labelId);
    divEvent.append(inputId);

    }

    divElementParameter.append(buttonTask);
    divElementParameter.append(divTask);
    divElementParameter.append(buttonGateway);
    divElementParameter.append(divGateway);
    divElementParameter.append(buttonEvent);
    divElementParameter.append(divEvent);

    // let buttonTaskHTML = $('#button-task');

    // buttonTaskHTML.toggle("active");


    elementParameterHTML.append(divElementParameter);

    // elementParameterHTML.append(buttonTask);
    // elementParameterHTML.append(divTask);


    // costruzione buttons in scenario
    var coll = document.getElementsByClassName("collapsible");
    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            // console.log("prima");
            // console.log(this.clicked);
            $(this).data('clicked', !$(this).data('clicked'));
            // console.log("dopo");
            // console.log(this.clicked);
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            var haveInner = content.id.includes("haveInner");
            var scrollHeightInner = 0;
            if(haveInner){
                var contentChildren = content.childNodes[0].childNodes;
                for(let i = 0; i<contentChildren.length; i++){
                    if( i%2 != 0){
                        scrollHeightInner = scrollHeightInner + contentChildren[i].scrollHeight;
                    }
                }
            }
            if (content.style.maxHeight){
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + scrollHeightInner + "px";
            } 
        });
    }

    
    
    // * parte completamento form con dati esistenti
    // let parser = new DOMParser();
    // let xmlDoc = parser.parseFromString(xml, "text/xml");

    // * elemento XML "extensionElements" che contiene tutti gli elementi della simulazione
    // let extensionElementXML = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "extensionElements");
    // let dataTree; // * variabile che contiene la struttura dati

    // dataTree = xml2tree(extensionElementXML[0]);
    // let dataTreeObj = dataTree[1];

    let scenarios = dataTreeObjGlobal.scenario;
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

    let scenarioSelected = $('#scenario-picker').val();
    refreshFormFieds(scenarios, scenarioSelected);
    


    $('#scenario-picker')
        .on('change', function () {
            let scenarioSelected = $('#scenario-picker').val();
            
            saveDataTreeStructure(scenarioSelected);
            let scenariosTemp = dataTreeObjGlobal.scenario;
            refreshFormFieds(scenariosTemp, scenarioSelected);
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

// * Funzione di supporto per popolare gli attributi di Scenario
function populateScenarioAttributesForm(scenarios, scenarioSelected){
    
    //TODO gestire caso in cui si debba creare bspim da zero
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

        let resultScenarioInput = $('#scenario-result-input');
        let resultScenarioVal = scenarios[scenarioSelected].result;
        setField(resultScenarioInput, resultScenarioVal);

        let inheritsScenarioInput = $('#scenario-inherits-input');
        let inheritsScenarioVal = scenarios[scenarioSelected].inherits;
        setField(inheritsScenarioInput, inheritsScenarioVal);     
    
    }else{
        //TODO valutare se settare defaults e considerare aggiunta scenario
    }
}

// * Funzione di supporto per popolare gli attributi di Scenario
function populateScenarioElementsForm(scenarios, scenarioSelected){
    
    //TODO gestire caso in cui si debba creare bspim da zero
    if(scenarioSelected != "" ){
        scenarioSelected=scenarioSelected-1;

        let elementParametersSelected = scenarios[scenarioSelected].elementParameters;

        elementParametersSelected[0].id = "giovanni"; //! TODO remove

        for(let i=0;i<elementParametersSelected.length;i++){
            let elemRef = elementParametersSelected[i].elementRef;
            let idTaskInput = $( "input[id*='"+elemRef+"']" );
            let idTaskVal = elementParametersSelected[i].id;
            setField(idTaskInput, idTaskVal);
        }

        
    }
}

// * Funzione che aggiorna i campi in base allo scenario selezionato
function refreshFormFieds(scenarios, scenarioSelected){
  
    populateScenarioAttributesForm(scenarios, scenarioSelected); //popoliamo il form con gli attributi bpsim di scenario
    populateScenarioElementsForm(scenarios, scenarioSelected); //popoliamo il form con gli elementi bpsim di scenario

}

// * Funziona che salva la struttura dati
function saveDataTreeStructure(scenarioSelected){
    let idScenarioInput = $('#scenario-id-input');
    let idScenarioVal = idScenarioInput.val();
    dataTreeObjGlobal.scenario[scenarioSelected].id = idScenarioVal;

    // let idScenarioInput = $('#scenario-id-input');
    // let idScenarioVal = idScenarioInput.val();  

    // dataTreeObjGlobal.scenario[scenarioSelected].id = idScenarioVal;
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
            xmlGlobal=xml;
            callback();
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

    
    // xmlGlobal=firstdiagramXML;
    // xmlGlobal=bpmn_example1;
    // xmlGlobal=bpmn_example2;
    // xmlGlobal=bpmn_example3;
    // xmlGlobal=bpmn_example4;
    // xmlGlobal=bpmn_example5;
    // xmlGlobal=bpmn_example6;
    xmlGlobal=bpmn_example7;
    openDiagram();
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
            //Front Office
            let elemRefClicked = e.element.id;
            
            if(e.element.type.toLowerCase().includes("task")){
                // * gestione dell'apertura dei bottoni
                if($("#elem-par-btn").data('clicked') == false ){
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#elem-par-btn").click();
                }
                
                if($("#button-task").data('clicked') == false ){
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#button-task").click();
                }
            } else if(e.element.type.toLowerCase().includes("gateway")){
                // * gestione dell'apertura dei bottoni
                if($("#elem-par-btn").data('clicked') == false ){
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#elem-par-btn").click();
                }
                if($("#button-gateway").data('clicked') == false ){
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#button-gateway").click();
                }
            } else if(e.element.type.toLowerCase().includes("event")){
                // * gestione dell'apertura dei bottoni
                if($("#elem-par-btn").data('clicked') == false ){
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#elem-par-btn").click();
                }
                if($("#button-event").data('clicked') == false ){
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#button-event").click();
                }
            }

            // * do il focus all'input tag che ha come id l'element ref che ho cliccato


            $( "input[id*='"+elemRefClicked+"']" ).focus();
           
        


            // non selezioniamo con un rettangolo blu le label dei task, ma gli altri elementi si
            if (e.element.id.includes("label")) {
                $('.djs-element.selected .djs-outline').css("stroke-width", "0px");
                console.log(event + 'on' + e.element.id);
            } else {
                $('.djs-element.selected .djs-outline').css("stroke-width", "8px");
            }
            console.log(event + 'on' + e.element.id);
        }
    });

})
;
