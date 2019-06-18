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
import {Calendar} from './types/calendar/Calendar';
import {ElementParameters} from './types/parameters/ElementParameters';


const bpmnNamespaceURI = "http://www.omg.org/spec/BPMN/20100524/MODEL";
const bpsimNamespaceURI = "http://www.bpsim.org/schemas/1.0";

var container = $('#js-drop-zone');
var dataTreeGlobal;
var dataTreeObjGlobal;
var currentScenarioGlobal;
var calendarsCreatedIDCounterGlobal = 0; //serve per tenere id univoci per i calendar creati
var xmlGlobal;
var bpsimPrefixGlobal;
var bpmnPrefixGlobal;
var saved=false


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
                    
                    console.log("riattivare salvataggio")//TODO 
                    //saveDataTreeStructure(scenarioSelected);

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
    let bpmnElementProcessXML = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "process");
    let bpmnElementCollaborationXML = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "collaboration");
    // console.log("Elementi del bpmn"); //TODO REMOVE
    // console.log(bpmnElementXML[0]); //TODO REMOVE


    let nodesActivities = [];
    let nodesGateways = [];
    let nodesEvents = [];
    let nodesConnectingObjects = [];

    for(let i = 0; i<bpmnElementProcessXML.length; i++){

        // * array di tutti gli elementi presenti in "process"
        let nodesProcess = Array.prototype.slice.call(bpmnElementProcessXML[i].getElementsByTagName("*"), 0);
        
        // console.log("Array di elementi del bpmn"); //TODO REMOVE
        // console.log(nodes); //TODO REMOVE

        // * avvaloramento variabile che contiene solo i task
        for (let j = 0; j < nodesProcess.length; j++) {
            if (nodesProcess[j].localName.toLowerCase().includes("task")) {

                nodesActivities.push(nodesProcess[j]);
            }
            // console.log(nodes[j].localName);
        }
        

        // * avvaloramento variabile che contiene solo i gateway
        for (let j = 0; j < nodesProcess.length; j++) {
            if (nodesProcess[j].localName.toLowerCase().includes("gateway")){

                nodesGateways.push(nodesProcess[j]);
            }
            // console.log(nodes[j].localName);
        }
        

        // * avvaloramento variabile che contiene solo gli eventi
        for (let j = 0; j < nodesProcess.length; j++) {
            if (nodesProcess[j].localName.toLowerCase().includes("event")
            && ! nodesProcess[j].localName.toLowerCase().includes("definition")){

                nodesEvents.push(nodesProcess[j]);
            }
            // console.log(nodes[j].localName);
        }
        

        // * avvaloramento variabile che contiene solo le freccie
        for (let j = 0; j < nodesProcess.length; j++) {
            if (nodesProcess[j].localName.toLowerCase().includes("sequenceflow")){

                nodesConnectingObjects.push(nodesProcess[j]);
            }
            // console.log(nodes[j].localName);
        }
        
    }
    for(let i = 0; i<bpmnElementCollaborationXML.length; i++){
        let nodesCollaboration = Array.prototype.slice.call(bpmnElementCollaborationXML[i].getElementsByTagName("*"), 0);
        for (let j = 0; j < nodesCollaboration.length; j++) {
            if (nodesCollaboration[j].localName.toLowerCase().includes("messageflow")){

                nodesConnectingObjects.push(nodesCollaboration[j]);
            }
            // console.log(nodes[j].localName);
        }
    }


    // console.log("Array di soli task"); //TODO REMOVE
    // console.log(nodesActivities); //TODO REMOVE

    // console.log("Array di soli gateway"); //TODO REMOVE
    // console.log(nodesGateways); //TODO REMOVE

    // console.log("Array di soli eventi"); //TODO REMOVE
    // console.log(nodesEvents); //TODO REMOVE

    // console.log("Array di sole frecce"); //TODO REMOVE
    // console.log(nodesConnectingObjects); //TODO REMOVE

    


    // * elemento HTML contenente la sezione degli element parameter
    let elementParameterHTML = $('#element-parameter-section-haveInner');
    let buttonElementParameterHTML = $('#elem-par-btn');
    buttonElementParameterHTML.data('clicked', false);
    $('#scen-par-btn').data('clicked', false);
    $('#calendar-btn-haveInne').data('clicked', false);
    
    

    let divElementParameter = jQuery('<div/>', {
        class: 'form-group',
        label: 'element-parameter-form'
    });


    let buttonActivities = jQuery('<button/>', {
        class: 'collapsible button-collapsible-style',
        type: 'button',
        text: 'Activities',
        id: 'button-activities'
    });
    buttonActivities.data('clicked', false);
    let divActivities = jQuery('<div/>', {
        class: 'content',
        label: 'element-parameter-activities-form',
        id: 'div-activities'
    });

    let buttonGateways = jQuery('<button/>', {
        class: 'collapsible button-collapsible-style',
        type: 'button',
        text: 'Gateways',
        id: 'button-gateways'
    });
    buttonGateways.data('clicked', false);
    let divGateways = jQuery('<div/>', {
        class: 'content',
        label: 'element-parameter-gateways-form',
        id: 'div-gateways'
    });
    
    let buttonEvents = jQuery('<button/>', {
        class: 'collapsible button-collapsible-style',
        type: 'button',
        text: 'Events',
        id: 'button-events'
    });
    buttonEvents.data('clicked', false);
    let divEvents = jQuery('<div/>', {
        class: 'content',
        label: 'element-parameter-events-form',
        id: 'div-events'
    });

    let buttonConnectingObjects = jQuery('<button/>', {
        class: 'collapsible button-collapsible-style',
        type: 'button',
        text: 'Connecting Objects',
        id: 'button-connectingObjects'
    });
    buttonConnectingObjects.data('clicked', false);
    let divConnectingObjects = jQuery('<div/>', {
        class: 'content',
        label: 'element-parameter-connectingObjects-form',
        id: 'div-connectingObjects'
    });


    

    // for che creano gli elementi grafici per ogni task, in base a quanti task sono presenti nel BPMN
    // TODO creare gli elementi corretti per i activities
    for(let counter = 0; counter<nodesActivities.length; counter++){

        let labelElementRef;
        let elRef = nodesActivities[counter].id;
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
                text: 'Element Ref: '+nodesActivities[counter].id,
                style: 'margin-top:15%'
            });
        }
        divActivities.append(labelElementRef);
        


        let labelId = jQuery('<label/>', {
            for: 'activity-id-input$$'+elRef+'$$',
            text: 'ID'
        });
        
        let inputId = jQuery('<input/>', {
            type: 'text',
            class: 'form-control form-control-input',
            id: 'activity-id-input$$'+elRef+'$$',
            placeholder: 'Activity ID'
        });

        // * settaggio funzione salvataggio singola variabile all'interno della struttura globale
        // inputId.on('change', function () {
        //     console.log(2);
        // });
        // TODO vedere se usare change o input
        inputId.on('input', function () {
            saveOrCreateSingleFieldInElementParameters(this);
            // let value = this.value;
            // //prendo la ref che so essere circondata da doppio $
            // let elRef = this.id.split("$$")[1];
            // //della prima parte mi prendo il secondo elemento che indica il campo da modificare
            // let fieldName = this.id.split("$$")[0].split("-")[1];

            // let elementParameters = dataTreeObjGlobal.scenario[currentScenarioGlobal-1].elementParameters;
            // let found = false;
            // for(let i = 0; i < elementParameters.length; i++){
            //     if(elementParameters[i].elementRef == elRef){
            //         found = true;
            //         elementParameters[i][fieldName] = value;

            //     }
            // }
            // if(!found){
            //     let elementParametersToAdd = [];
            //     let elemPar = new ElementParameters();
            //     elemPar[fieldName] = value;
            //     elemPar.elementRef = elRef;
            //     elementParametersToAdd.push(elemPar);
            //     dataTreeObjGlobal.scenario[currentScenarioGlobal-1].elementParameters = elementParametersToAdd;
            // }
        });


        divActivities.append(labelId);
        divActivities.append(inputId);

    }

    // TODO creare gli elementi corretti per i gateway
    for(let counter = 0; counter<nodesGateways.length; counter++){
        let labelElementRef;
        let elRef = nodesGateways[counter].id;
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
                text: 'Element Ref: '+nodesGateways[counter].id,
                style: 'margin-top:15%'
            });
        }
        divGateways.append(labelElementRef);
        


        let labelId = jQuery('<label/>', {
            id: 'gateway-id-input$$'+elRef+'$$',
            text: 'ID'
        });
        
        let inputId = jQuery('<input/>', {
            type: 'text',
            class: 'gateway-control form-control-input',
            id: 'gateway-id-input$$'+elRef+'$$',
            placeholder: 'Gateway ID'
        });
        divGateways.append(labelId);
        divGateways.append(inputId);


    }

    // TODO creare gli elementi corretti per gli events
    for(let counter = 0; counter<nodesEvents.length; counter++){

    let labelElementRef;
    let elRef = nodesEvents[counter].id;
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
            text: 'Element Ref: '+nodesEvents[counter].id,
            style: 'margin-top:15%'
        });
    }
    divEvents.append(labelElementRef);
    
    let labelId = jQuery('<label/>', {
        for: 'events-id-input$$'+elRef+'$$',
        text: 'ID'
    });
    
    let inputId = jQuery('<input/>', {
        type: 'text',
        class: 'form-control form-control-input',
        id: 'events-id-input$$'+elRef+'$$',
        placeholder: 'Event ID'
    });
    divEvents.append(labelId);
    divEvents.append(inputId);

    }


    // TODO creare gli elementi corretti per gli arrow
    for(let counter = 0; counter<nodesConnectingObjects.length; counter++){

        let labelElementRef;
        let elRef = nodesConnectingObjects[counter].id;
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
                text: 'Element Ref: '+nodesConnectingObjects[counter].id,
                style: 'margin-top:15%'
            });
        }
        divConnectingObjects.append(labelElementRef);
        
        let labelId = jQuery('<label/>', {
            for: 'connectingObject-id-input$$'+elRef+'$$',
            text: 'ID'
        });
        
        let inputId = jQuery('<input/>', {
            type: 'text',
            class: 'form-control form-control-input',
            id: 'connectingObject-id-input$$'+elRef+'$$',
            placeholder: 'Connecting Object ID'
        });
        divConnectingObjects.append(labelId);
        divConnectingObjects.append(inputId);
    
    }





    divElementParameter.append(buttonActivities);
    divElementParameter.append(divActivities);
    divElementParameter.append(buttonGateways);
    divElementParameter.append(divGateways);
    divElementParameter.append(buttonEvents);
    divElementParameter.append(divEvents);
    divElementParameter.append(buttonConnectingObjects);
    divElementParameter.append(divConnectingObjects);

    // let buttonActivitiesHTML = $('#button-activities');

    // buttonActivitiesHTML.toggle("active");


    elementParameterHTML.append(divElementParameter);

    // elementParameterHTML.append(buttonActivities);
    // elementParameterHTML.append(divActivities);


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

            // var content = this.nextElementSibling;
            // var haveInner = content.id.includes("haveInner");
            // var scrollHeightInner = 0;
            // if(haveInner){
            //     var contentChildren = content.childNodes[0].childNodes;
            //     for(let i = 0; i<contentChildren.length; i++){
            //         if( i%2 != 0){
            //             scrollHeightInner = scrollHeightInner + contentChildren[i].scrollHeight;
            //         }
            //     }
            // }
            // if (content.style.maxHeight){
            //     content.style.maxHeight = null;
            // } else {
            //     content.style.maxHeight = content.scrollHeight + scrollHeightInner + "px";
            // } 
            
            refreshDimension(this);
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

    // $('#scenario-picker').val(3);

    let scenarioSelected = $('#scenario-picker').val();
    currentScenarioGlobal = scenarioSelected;
    refreshFormFields(scenarios, scenarioSelected);
    


    $('#scenario-picker')
        .on('change', function () {

            if($("#elem-par-btn").data('clicked') == true ){
                //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                $("#elem-par-btn").click();
            }
            if($("#button-activities").data('clicked') == true ){
                //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                $("#button-activities").click();
            }
            if($("#button-gateways").data('clicked') == true ){
                //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                $("#button-gateways").click();
            }
            if($("#button-events").data('clicked') == true ){
                //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                $("#button-events").click();
            }
            if($("#button-connectingObjects").data('clicked') == true ){
                //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                $("#button-connectingObjects").click();
            }
            if($("#scen-par-btn").data('clicked') == true ){
                //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                $("#scen-par-btn").click();
            }
            if($("#calendar-btn").data('clicked') == true ){
                //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                $("#calendar-btn").click();
            }

            let scenarioSelected = $('#scenario-picker').val();
            
            
            console.log("riattivare salvataggio")//TODO 
            // saveDataTreeStructure(currentScenarioGlobal);
            
            currentScenarioGlobal = scenarioSelected;

            let scenariosTemp = dataTreeObjGlobal.scenario;
            refreshFormFields(scenariosTemp, scenarioSelected);

        });
}

function saveOrCreateSingleFieldInElementParameters(field){
    let value = field.value;
    //prendo la ref che so essere circondata da doppio $
    let elRef = field.id.split("$$")[1];
    //della prima parte mi prendo il secondo elemento che indica il campo da modificare
    let fieldName = field.id.split("$$")[0].split("-")[1];

    let elementParameters = dataTreeObjGlobal.scenario[currentScenarioGlobal-1].elementParameters;
    let found = false;
    for(let i = 0; i < elementParameters.length; i++){
        if(elementParameters[i].elementRef == elRef){
            found = true;
            elementParameters[i][fieldName] = value;

        }
    }
    if(!found){
        let elementParametersToAdd = [];
        let elemPar = new ElementParameters();
        elemPar[fieldName] = value;
        elemPar.elementRef = elRef;
        elementParametersToAdd.push(elemPar);
        dataTreeObjGlobal.scenario[currentScenarioGlobal-1].elementParameters = elementParametersToAdd;
    }
}

function refreshDimension(btn, isCalendar=false){
    // btn.classList.toggle("active");
    var content = btn.nextElementSibling;
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
    if(isCalendar){
        content.style.maxHeight = content.scrollHeight + scrollHeightInner + "px";
    }else{
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + scrollHeightInner + "px";
        }
    }
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

        scenarioSelected -= 1;
        
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
    
    if(scenarioSelected != "" ){
        scenarioSelected -= 1;
        populateElementParametersForm(scenarios[scenarioSelected].elementParameters);

        populateCalendarForm(scenarios[scenarioSelected].calendar);
      
    }else{
        //TODO gestire caso in cui si debba creare bspim da zero
    }
}

function populateElementParametersForm(elementParameters){
    // elementParameters[0].id = "giovanni"; //! TODO remove

    for(let i=0;i<elementParameters.length;i++){
        let elemRef = elementParameters[i].elementRef;
        let idTaskInput = $( "input[id*='$$"+elemRef+"$$']" );
        let idTaskVal = elementParameters[i].id;
        // console.log(idTaskInput);
        // console.log(idTaskInput + " PROVA " + idTaskVal);
        setField(idTaskInput, idTaskVal);
    }
}

function populateCalendarForm(calendars){
    
    let htmlCalendarSection = $('#calendar-section');

    htmlCalendarSection.empty();
    calendarsCreatedIDCounterGlobal = 0; // settato a zero ogni volta che si cambia scenario

    let buttonCreateCalendar = jQuery('<button/>', {
        class: 'btn btn-primary btn-lg  button-calculate',
        type: 'button',
        text: 'Create New Calendar',
        id: 'create-calendar-btn',
        style: 'margin-right:auto; margin-left:auto; width:100%'
    });

    htmlCalendarSection.append(buttonCreateCalendar);

    for(let i=0; i<calendars.length; i++){
        //per ogni calendar esistente si crea l'oggetto html 
        let calId = calendars[i].id;
        let calName = calendars[i].name;
        let calContent= calendars[i].calendar;

        let labelCalID = jQuery('<label/>', {
            text: 'Calendar ID',
            style: 'margin-top:10%'
        });
        
        let inputCalID = jQuery('<input/>', {
            type: 'text',
            class: 'form-control form-control-input',
            id: 'calendar-id-'+i,
            val: calId
        });
        htmlCalendarSection.append(labelCalID);
        htmlCalendarSection.append(inputCalID);


        let labelCalName = jQuery('<label/>', {
            // for: 'events'+(counter+1)+'-id-input',
            text: 'Calendar Name'
        });
        
        let inputCalName = jQuery('<input/>', {
            type: 'text',
            class: 'form-control form-control-input',
            id: 'calendar-name-'+i,
            val: calName
        });
        htmlCalendarSection.append(labelCalName);
        htmlCalendarSection.append(inputCalName);


        let labelCalContent = jQuery('<label/>', {
            // for: 'events'+(counter+1)+'-id-input',
            text: 'Calendar Content'
        });
        
        let inputCalContent = jQuery('<input/>', {
            type: 'text',
            class: 'form-control form-control-input',
            id: 'calendar-content-'+i,
            val: calContent
        });
        htmlCalendarSection.append(labelCalContent);
        htmlCalendarSection.append(inputCalContent);

    }

    buttonCreateCalendar.on("click", function() {

        let calendarSection = $('#calendar-section');
        let labelCalID = jQuery('<label/>', {
                text: 'Calendar ID',
                style: 'margin-top:10%'
        });
        let inputCalID = jQuery('<input/>', {
            type: 'text',
            class: 'form-control form-control-input',
            id: 'calendar-created-id-'+calendarsCreatedIDCounterGlobal,
            placeholder: "Calendar ID"
        });
        calendarSection.append(labelCalID);
        calendarSection.append(inputCalID);

        let labelCalName = jQuery('<label/>', {
            text: 'Calendar Name'
        });
        let inputCalName = jQuery('<input/>', {
            type: 'text',
            class: 'form-control form-control-input',
               id: 'calendar-created-name-'+calendarsCreatedIDCounterGlobal,
            placeholder: "Calendar name"
        });
        calendarSection.append(labelCalName);
        calendarSection.append(inputCalName);

        let labelCalContent = jQuery('<label/>', {
            text: 'Calendar Content'
        });
        
        let inputCalContent = jQuery('<input/>', {
            type: 'text',
            class: 'form-control form-control-input',
            id: 'calendar-created-content-'+calendarsCreatedIDCounterGlobal,
            placeholder: "Calendar content"
        });
        calendarSection.append(labelCalContent);
        calendarSection.append(inputCalContent);

        //* double click per fare un refresh e aggiornare le dimensioni del div
        // $('#calendar-btn').click();
        // $('#calendar-btn').click();
        // refreshDimension(this);
        // console.log($('#calendar-btn'));
        //true perché il bottone è calendar e non va collassato ed espando
       
        refreshDimension($('#calendar-btn')[0], true);

        //focus sull'id del nuovo calendar creato
        focusDelayed(inputCalID);

        calendarsCreatedIDCounterGlobal += 1;
    });    
    
}

// * Funzione che aggiorna i campi in base allo scenario selezionato
function refreshFormFields(scenarios, scenarioSelected){
    populateScenarioAttributesForm(scenarios, scenarioSelected); //popoliamo il form con gli attributi bpsim di scenario
    populateScenarioElementsForm(scenarios, scenarioSelected); //popoliamo il form con gli elementi bpsim di scenario
}

// * Funziona che salva la struttura dati
function saveDataTreeStructure(scenarioSelected){
    scenarioSelected -= 1;
    let idScenarioInput = $('#scenario-id-input');
    let idScenarioVal = idScenarioInput.val();

    // TODO salvare tutto
    dataTreeObjGlobal.scenario[scenarioSelected].id = idScenarioVal;
    // console.log(dataTreeObjGlobal.scenario[scenarioSelected].calendars);
    // console.log(dataTreeObjGlobal.scenario[scenarioSelected].calendar);

    saveCalendar(scenarioSelected);
    
}

function saveCalendar(scenarioSelected){
    // console.log(scenarioSelected);
    let calendars = dataTreeObjGlobal.scenario[scenarioSelected].calendar
    
    //per ognuno dei calendari esistenti aggiorniamo il valore quando salviamo
    for(let i=0; i<calendars.length; i++){
        let idCalendarInput = $('#calendar-id-'+i);
        let idCalendarVal = idCalendarInput.val();
        calendars[i].id = idCalendarVal;

        let nameCalendarInput = $('#calendar-name-'+i);
        let nameCalendarVal = nameCalendarInput.val();
        calendars[i].name = nameCalendarVal;

        let contentCalendarInput = $('#calendar-content-'+i);
        let contentCalendarVal = contentCalendarInput.val();
        calendars[i].calendar = contentCalendarVal;
    }

    let newCalendars = [];
    for(let i=0; i< calendarsCreatedIDCounterGlobal; i++){
        // console.log(calendarsCreatedIDCounterGlobal);
        
        let calendarCreated = new Calendar();

        let idCalendarInput = $('#calendar-created-id-'+i);
        let idCalendarVal = idCalendarInput.val();
        calendarCreated.id = idCalendarVal;

        let nameCalendarInput = $('#calendar-created-name-'+i);
        let nameCalendarVal = nameCalendarInput.val();
        calendarCreated.name = nameCalendarVal;

        let contentCalendarInput = $('#calendar-created-content-'+i);
        let contentCalendarVal = contentCalendarInput.val();
        calendarCreated.calendar = contentCalendarVal;
        
        //almeno l'id deve essere avvalorato per salvare il calendario appena creato
        // console.log(idCalendarVal=="");
        if(idCalendarVal != ""){
            newCalendars.push(calendarCreated);
        }
    }

    calendarsCreatedIDCounterGlobal = 0;

    // console.newCalendars;

    dataTreeObjGlobal.scenario[scenarioSelected].calendar = newCalendars;
    
    
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

function focusDelayed(obj, num=100){
    setTimeout(function() {
        obj.focus();
    }, num);
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
        e.preventsDefault();

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
        e.preventsDefault();

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
var event = [
    'element.hover',
    'element.out',
    'element.click',
    'element.dblclick',
    'element.mousedown',
    'element.mouseup'
];

event.forEach(function (event) {

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
                
                if($("#button-activities").data('clicked') == false ){
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#button-activities").click();
                }
            } else if(e.element.type.toLowerCase().includes("gateway")){
                // * gestione dell'apertura dei bottoni
                if($("#elem-par-btn").data('clicked') == false ){
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#elem-par-btn").click();
                }
                if($("#button-gateways").data('clicked') == false ){
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#button-gateways").click();
                }
            } else if(e.element.type.toLowerCase().includes("event")){
                // * gestione dell'apertura dei bottoni
                if($("#elem-par-btn").data('clicked') == false ){
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#elem-par-btn").click();
                }
                if($("#button-events").data('clicked') == false ){
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#button-events").click();
                }


            }

            // * do il focus all'input tag che ha come id l'element ref che ho cliccato

            
            focusDelayed($("input[id*='$$"+elemRefClicked+"$$']"));
            // console.log($("input[id*='"+elemRefClicked+"']"));
           
    

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