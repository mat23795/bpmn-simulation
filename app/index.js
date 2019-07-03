import firstdiagramXML from '../resources/firstDiagram.bpmn';
import bpmn_example1 from '../resources/1_CarRepairProcessV1.bpmn';
import bpmn_example2 from '../resources/2_CarRepairProcessV2.bpmn';
import bpmn_example3 from '../resources/3_LoanProcessV1.bpmn';
import bpmn_example4 from '../resources/4_LoanProcessV2.bpmn';
import bpmn_example5 from '../resources/5_TechnicalSupportProcessV1.bpmn';
import bpmn_example6 from '../resources/6_TechnicalSupportProcessV1_1.bpmn';
import bpmn_example7 from '../resources/7_TechnicalSupportProcessV2.bpmn';

import { DateTime, DurationParameter } from "./types/parameter_type/ConstantParameter";
import { BPSimData } from "./types/scenario/BPSimData";
import { Scenario } from "./types/scenario/Scenario";
import { factory } from "./types/factory";
import { ResultType } from "./types/parameter_type/ResultType";
import { Parameter } from "./types/parameter_type/Parameter";
import { PropertyType } from "./types/parameters/PropertyType";
import { Calendar } from './types/calendar/Calendar';
import { ElementParameters } from './types/parameters/ElementParameters';
import { TimeUnit } from "./types/scenario/TimeUnit";



const bpmnNamespaceURI = "http://www.omg.org/spec/BPMN/20100524/MODEL";
const bpsimNamespaceURI = "http://www.bpsim.org/schemas/1.0";

var container = $('#js-drop-zone');
var dataTreeGlobal;
var dataTreeObjGlobal;
var currentScenarioGlobal;
var calendarsCreatedIDCounterGlobal = 0; //serve per tenere id univoci per i calendar creati
var calendarsCreatedGlobal = [];
var idListGlobal = [];
var xmlGlobal;
var bpsimPrefixGlobal;
var scaleGlobal = 1.0
var pageXGlobal = 0;
var pageYGlobal = 0;
var parameterValueDivCounterGlobal = 0;
var elementParameterCounterGlobal = 0;

var bpmnPrefixGlobal;
var saved = false;


var viewer = new BpmnJS({
    container: $('#js-canvas'),
    height: "700px",
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
        $('.djs-container').css('transform-origin', '0% 0% 0px');
        $('.djs-container').css('transform', 'scale(1)'); //TODO REMOVE
        $('#js-canvas').css('overflow', 'hidden');

        let imgAhref = $(".bjs-powered-by");
        imgAhref.css('position', 'fixed');
        imgAhref.css('right', 'auto');
        imgAhref.css('left', '15px');



        $('#js-canvas').on("wheel", function () {
            let e = window.event;
            let num = e.wheelDelta / 1000;
            scaleGlobal += num;
            $('.djs-container').css('transform', 'scale(' + scaleGlobal + ') translate('+(pageXGlobal)+'px,'+(pageYGlobal)+'px)');

        });

        
        let pageX = 0;
        let pageY = 0;
        $('#js-canvas').mousedown(function (event){
            pageX = event.pageX;
            pageY = event.pageY;
            // console.log("px = "+ pageX + " --- py = "+ pageY);
        });

        $('#js-canvas').mouseup(function (event){
            pageXGlobal += event.pageX-pageX
            pageYGlobal += event.pageY-pageY
            // console.log("diffx = "+(pageXGlobal) + " -------- diffy = " + pageYGlobal);
            $('.djs-container').css('transform', 'scale(' + scaleGlobal + ') translate('+(pageXGlobal)+'px,'+(pageYGlobal)+'px)');
        });
        // $('.djs-container').css('height', '700px');

        // xmlGlobal=xml;
        // * rimozione commenti dal xml perché creano problemi con il parsing
        const regExpRemoveComments = /(\<!--.*?\-->)/g;
        xmlGlobal = xmlGlobal.replace(regExpRemoveComments, "");

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
            //TODO forse poter usare bottone crea nuovo scenario?
            let bpsimData = new BPSimData();
            let scenario = new Scenario();
            scenario.id = "new Scenario";
            bpsimData.addScenario(scenario);
            dataTreeObjGlobal = bpsimData;
            createFormFields();
        } else {
            // * Fase 1 xml2tree
            bpsimPrefixGlobal = extensionElementXML[0].childNodes[1].prefix;

            // * Leggere bpsim e inserirlo nella struttura dati
            dataTreeGlobal = xml2tree(extensionElementXML[0]);
            dataTreeObjGlobal = dataTreeGlobal[1];

            // * popoliamo la lista di id globali perché ogni id deve essere univoco
            populateIdList();

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
            $('#generate-bpsim').on("click", function () {

                // // ! DELETE THIS START 
                // setTimeout(function(){
                //     $('#scenario-picker').val(1).trigger('change');;
                // },10);
                // setTimeout(function(){
                //     $('#scenario-picker').val(2).trigger('change');;
                // },10);
                // setTimeout(function(){
                //     $('#scenario-picker').val(3).trigger('change');;
                // },10);
                // // ! DELETE THIS STOP


                let scenarioSelected = $('#scenario-picker').val();

                console.log("riattivare salvataggio")//TODO 

                //salvo i calendari 
                dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].calendar = calendarsCreatedGlobal;
                calendarsCreatedGlobal = [];
                calendarsCreatedIDCounterGlobal = 0;

                //saveDataTreeStructure(scenarioSelected);

                extensionElementXML[0].appendChild(dataTreeObjGlobal.toXMLelement(bpsimPrefixGlobal));
                console.log("XML fase modifica");//TODO remove
                console.log(xmlDoc);//TODO remove
                console.log(extensionElementXML[0].lastChild); //printa il nuovo bpsimdata

            });

            // * aggiunta evento al bottone che elimina lo scenario corrente
            $('#delete-scenario').on("click", function () {
                closeCollapsibleButton();
                
                let scenarioDeleted = dataTreeObjGlobal.scenario.splice(currentScenarioGlobal - 1, 1);

                //rimozione degli id da idglobal perché lo scenario viene eliminato
                idListGlobal.splice(idListGlobal.indexOf(scenarioDeleted[0].id), 1);

                scenarioDeleted[0].calendar.forEach(function(cal){
                    idListGlobal.splice(idListGlobal.indexOf(cal.id),1);
                });

                scenarioDeleted[0].elementParameters.forEach(function(el){
                    if(el.id != undefined){
                        idListGlobal.splice(idListGlobal.indexOf(el.id),1);
                    }
                });

                console.log("lista");
                console.log(idListGlobal); //TODO REMOVE
                
                if (dataTreeObjGlobal.scenario.length > 0) {
                    createFormFields(false); //false = evitare doppio toggle active per bottoni creati in precedenza
                } else {
                    idListGlobal = [];
                    $('#scenario-displayed').hide();
                    $('#scenario-picker').empty();
                }

            });

            // * aggiunta evento al bottone che crea un nuovo scenario
            $('#create-scenario').on("click", function () {
                closeCollapsibleButton();
                $('#scenario-displayed').show();
                let newScenario = new Scenario();

                let name = "";
                while( name == "" || idListGlobal.includes(name)){
                    if(name == ""){
                        name = prompt("Insert Scenario ID (It can not be empty):");
                    }else if( idListGlobal.includes(name) ){
                        name = prompt("ID: "+name+" is not availaible. Insert a new ID:");
                    }
                } 
                if(name != null){
                    newScenario.id = name;
                    let tempArrayScenario = [];
                    tempArrayScenario.push(newScenario);
                    dataTreeObjGlobal.scenario = tempArrayScenario;
                    idListGlobal.push(name);
                    saveLocalCalendars();
                    // console.log(dataTreeObjGlobal.scenario);
                    createFormFields(false); //false = evitare doppio toggle active per bottoni creati in precedenza
                    currentScenarioGlobal = dataTreeObjGlobal.scenario.length;
                    $('#scenario-picker').val(currentScenarioGlobal).trigger('change');

                    console.log(idListGlobal); //TODO REMOVE
                }
            });
            
           
        }

        // * funzione per parsare l'XML
        // xmlParsing();

    });
}

function populateIdList() {
    dataTreeObjGlobal.scenario.forEach(function (scenario) {
        idListGlobal.push(scenario.id);
        scenario.elementParameters.forEach(function (elem) {
            if (elem.id != undefined) {
                idListGlobal.push(elem.id);
            }
        });
        scenario.calendar.forEach(function (calendar) {
            idListGlobal.push(calendar.id);
        });
    });
    // console.log("id globali")
    // console.log(idListGlobal);
}

// * Funzione per creare il form in base all' XML
function createFormFields(firstTime = true) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xmlGlobal, "text/xml");

    // const bpmnPrefix = definitionsTag[0].prefix;


    // * elemento XML "process" che contiene tutti gli elementi del diagramma
    let bpmnElementProcessXML = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "process");

    let bpmnElementCollaborationXML = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "collaboration");

    let bpmnElementResourceXML = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "resource");
    // console.log("Elementi del bpmn"); //TODO REMOVE
    // console.log(bpmnElementXML[0]); //TODO REMOVE


    let nodesActivities = [];
    let nodesGateways = [];
    let nodesEvents = [];
    let nodesConnectingObjects = [];
    let nodesResources = [];

    for (let i = 0; i < bpmnElementProcessXML.length; i++) {

        // * array di tutti gli elementi presenti in "process"
        let nodesProcess = Array.prototype.slice.call(bpmnElementProcessXML[i].getElementsByTagName("*"), 0);

        // console.log("Array di elementi del bpmn"); //TODO REMOVE
        // console.log(nodes); //TODO REMOVE

        // * avvaloramento variabile che contiene solo i task
        for (let j = 0; j < nodesProcess.length; j++) {
            if (nodesProcess[j].localName.toLowerCase().includes("task")||
            nodesProcess[j].localName.toLowerCase().includes("subprocess") ||
            nodesProcess[j].localName.toLowerCase().includes("transaction")||
            nodesProcess[j].localName.toLowerCase().includes("callactivity") ||
            nodesProcess[j].localName.toLowerCase().includes("eventsubprocess")) {
                nodesActivities.push(nodesProcess[j]);
            }
            // console.log(nodes[j].localName);
        }


        // * avvaloramento variabile che contiene solo i gateway
        for (let j = 0; j < nodesProcess.length; j++) {
            if (nodesProcess[j].localName.toLowerCase().includes("gateway")) {

                nodesGateways.push(nodesProcess[j]);
            }
            // console.log(nodes[j].localName);
        }


        // * avvaloramento variabile che contiene solo gli eventi
        for (let j = 0; j < nodesProcess.length; j++) {
            if (nodesProcess[j].localName.toLowerCase().includes("event")
                && !nodesProcess[j].localName.toLowerCase().includes("definition")) {

                nodesEvents.push(nodesProcess[j]);
            }
            // console.log(nodes[j].localName);
        }


        // * avvaloramento variabile che contiene solo le freccie
        for (let j = 0; j < nodesProcess.length; j++) {
            if (nodesProcess[j].localName.toLowerCase().includes("sequenceflow")) {

                nodesConnectingObjects.push(nodesProcess[j]);
            }
            // console.log(nodesConnectingObjects[j].localName);
        }


    }

    for (let i = 0; i < bpmnElementCollaborationXML.length; i++) {
        let nodesCollaboration = Array.prototype.slice.call(bpmnElementCollaborationXML[i].getElementsByTagName("*"), 0);
        for (let j = 0; j < nodesCollaboration.length; j++) {
            if (nodesCollaboration[j].localName.toLowerCase().includes("messageflow")) {

                nodesConnectingObjects.push(nodesCollaboration[j]);
            }
            // console.log(nodesConnectingObjects[j].localName);
        }
    }    


    for (let i = 0; i < bpmnElementResourceXML.length; i++) {
        nodesResources.push(bpmnElementResourceXML[i]);
    }


    // console.log("Array di sole activities"); //TODO REMOVE
    // console.log(nodesActivities); //TODO REMOVE

    // console.log("Array di soli gateway"); //TODO REMOVE
    // console.log(nodesGateways); //TODO REMOVE

    // console.log("Array di soli eventi"); //TODO REMOVE
    // console.log(nodesEvents); //TODO REMOVE

    // console.log("Array di soli connecting obj"); //TODO REMOVE
    // console.log(nodesConnectingObjects); //TODO REMOVE

    console.log("Array di sole resources"); //TODO REMOVE
    console.log(nodesResources); //TODO REMOVE



    setParameter($('#scenarioParameters-start-div'));
    setParameter($('#scenarioParameters-duration-div'));
    setParameter($('#scenarioParameters-warmup-div'));

    let btnAddProperty = jQuery('<button/>', {
        class: 'btn btn-primary btn-lg button-calculate btn-icon',
        type: 'button',
        id: 'btn-create-property'

    });

    let iElForPlus = jQuery('<i/>', {
        class: 'fa fa-plus',
        id: 'btn-create-property'
    });

    btnAddProperty.append(iElForPlus);
    let propertiesCounter = 0;
    btnAddProperty.on('click',function(){
        propertiesCounter += 1;
        parameterValueDivCounterGlobal += 1;
        //aggiunta div property
        let propertyDiv = jQuery('<div/>', {
            id: 'scenarioParameters-property'+propertiesCounter+'-div-'+parameterValueDivCounterGlobal,
            style: "border-radius: 10px; border: solid 1px black; padding: 2%"
        });

        setParameter(propertyDiv);

        let labelPropertyName = jQuery('<label/>', {
            for: 'scenarioParameters-property-propertyParameters-name-'+parameterValueDivCounterGlobal,
            text: 'Name',
            width: '100%'
        });
    
        let inputPropertyName = jQuery('<input/>', {
            type: 'text',
            class: 'form-control form-control-input',
            id: 'scenarioParameters-property-propertyParameters-name-'+parameterValueDivCounterGlobal,
            placeholder: 'Property Name'
        });
    
        propertyDiv.append(labelPropertyName);
        propertyDiv.append(inputPropertyName);
    
        let propertyTypeLabel = jQuery('<label/>', {
            style: 'width: 100%',
            text: 'Property Type'
        });
    
        let propertyTypePicker = jQuery('<select/>', {
            class: 'scenario-picker',
            id: 'propertyType-scenarioParameters-picker-'+parameterValueDivCounterGlobal,
            width: '100%'
        });
        
        for (let propertyType in PropertyType) {
            propertyTypePicker.append($('<option>', {
                value: propertyType,
                text: propertyType
            }));
        }
    
        propertyDiv.append(propertyTypeLabel);
        propertyDiv.append(propertyTypePicker);


        let btnTrash = jQuery('<button/>', {
            class: 'btn btn-primary btn-lg button-calculate btn-icon',
            type: 'button',
            id: 'btn-deleteProperty'+propertiesCounter+'-'+parameterValueDivCounterGlobal
    
        });
    
        let iElforTrash = jQuery('<i/>', {
            class: 'fa fa-trash',
            id: 'btn-deleteProperty'+propertiesCounter+'-'+parameterValueDivCounterGlobal
        });
    
        btnTrash.append(iElforTrash);
    
        let idLocalRemoveProperty = parameterValueDivCounterGlobal;
        let localPropertiesCounter = propertiesCounter;

    
        btnTrash.on('click', function(){
            $('div[id*=scenarioParameters-property'+localPropertiesCounter+'-div-'+idLocalRemoveProperty+']').remove();
        });
    
        propertyDiv.append(btnTrash);

        $('#scenarioParameters-property-propertyParameters-div').append(propertyDiv);

    
    });
    $('#scenarioParameters-property-propertyParameters-div').append(btnAddProperty);
    
    

    
    setParameter($('#scenarioParameters-queue-propertyParameters-div'));
    // rimozione result type non disponibili per queueLength di propertyParameters
    let queueSelect = $('select[id*="queue-resultRequest"]');
    queueSelect[0].removeChild(queueSelect[0].options[3]);
    queueSelect[0].removeChild(queueSelect[0].options[3]);


    
    // * elemento HTML contenente la sezione degli element parameter
    let elementParameterHTML = $('#element-parameter-section');
    elementParameterHTML.empty();

    let buttonElementParameterHTML = $('#elem-par-btn');
    buttonElementParameterHTML.data('clicked', false);
    $('#scen-par-btn').data('clicked', false);
    $('#calendar-btn').data('clicked', false);


    let divElementParameter = jQuery('<div/>', {
        class: 'form-group',
        label: 'element-parameter-form'
    });


    let buttonActivities = jQuery('<button/>', {
        class: 'collapsible button-collapsible-style',
        type: 'button',
        text: 'Activities',
        id: 'button-activity'
    });
    buttonActivities.data('clicked', false);
    let divActivities = jQuery('<div/>', {
        class: 'content',
        label: 'element-parameter-activities-form',
        id: 'div-activity'
    });

    let buttonGateways = jQuery('<button/>', {
        class: 'collapsible button-collapsible-style',
        type: 'button',
        text: 'Gateways',
        id: 'button-gateway'
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
        id: 'button-event'
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

    let buttonResources = jQuery('<button/>', {
        class: 'collapsible button-collapsible-style',
        type: 'button',
        text: 'Resources',
        id: 'button-resources'
    });
    buttonResources.data('clicked', false);
    let divResources = jQuery('<div/>', {
        class: 'content',
        label: 'element-parameter-resources-form',
        id: 'div-resources'
    });




    // for che creano gli elementi grafici per ogni task, in base a quanti task sono presenti nel BPMN
    // TODO creare gli elementi corretti per i activities
    for (let counter = 0; counter < nodesActivities.length; counter++) {
        let labelElementRef;
        let elRef = nodesActivities[counter].id;
        if (counter == 0) {
            labelElementRef = jQuery('<label/>', {
                class: 'label-new-element',
                // id: elRef,
                text: 'Element Ref: ' + elRef,
            });

        } else {
            labelElementRef = jQuery('<label/>', {
                class: 'label-new-element',
                // id: elRef,
                text: 'Element Ref: ' + nodesActivities[counter].id,
                style: 'margin-top:15%'
            });
        }
        divActivities.append(labelElementRef);

        // let idCurrentScenario = dataTreeGlobal.scenario[currentScenarioGlobal-1].id;

        let labelId = jQuery('<label/>', {
            for: 'activity-id-input$$' + elRef + '$$',
            tBhoValueext: 'ID'
        });

        let inputId = jQuery('<input/>', {
            type: 'text',
            class: 'form-control form-control-input',
            id: 'activity-id-input$$' + elRef + '$$',
            placeholder: 'Activity ID'
        });

        // * settaggio funzione salvataggio singola variabile all'interno della struttura globale
        // inputId.on('change', function () {
        //     console.log(2);
        // });
        // TODO vedere se usare change o input
        inputId.on('change', function () {
            saveOrCreateSingleFieldInElementParameters(this);
        });


        divActivities.append(labelId);
        divActivities.append(inputId);

        let divActivitiesParameter = jQuery('<div/>', {
            style: "border-radius: 10px; border: solid 1px black; padding: 2%",
            id: 'activity-parameter-div-$$'+elRef+'$$'
        });
        divActivities.append(divActivitiesParameter);

        // setParameter(divActivitiesParameter);
        let elementName = nodesActivities[counter].localName;
        // console.log(elRef + " " + elementName);
        setElementParameter(divActivitiesParameter, "activities", elRef, elementName);

    }

    // TODO creare gli elementi corretti per i gateway
    for (let counter = 0; counter < nodesGateways.length; counter++) {
        let labelElementRef;
        let elRef = nodesGateways[counter].id;
        if (counter == 0) {
            labelElementRef = jQuery('<label/>', {
                class: 'label-new-element',
                // id: elRef,
                text: 'Element Ref: ' + elRef,
            });

        } else {
            labelElementRef = jQuery('<label/>', {
                class: 'label-new-element',
                // id: elRef,
                text: 'Element Ref: ' + nodesGateways[counter].id,
                style: 'margin-top:15%'
            });
        }
        divGateways.append(labelElementRef);



        let labelId = jQuery('<label/>', {
            for: 'gateway-id-input$$' + elRef + '$$',
            text: 'ID'
        });

        let inputId = jQuery('<input/>', {
            type: 'text',
            class: 'gateway-control form-control-input',
            id: 'gateway-id-input$$' + elRef + '$$',
            placeholder: 'Gateway ID'
        });

        inputId.on('change', function () {
            saveOrCreateSingleFieldInElementParameters(this);
        });

        divGateways.append(labelId);
        divGateways.append(inputId);

        
        let connectingObj = nodesGateways[counter].children;

        let labelConnectingObj = jQuery('<label/>', {
            // for: 'gateway-id-input$$' + elRef + '$$',
            text: 'Connecting objects',
            style: 'width: 100%'
        });
        divGateways.append(labelConnectingObj);
        // console.log(connectingObj);
        for(let i=0; i<connectingObj.length; i++){
            if(connectingObj[i].localName != "incoming"){
                let labelFlowLink = jQuery('<label/>', {
                    // for: 'gateway-id-input$$' + elRef + '$$',
                    style: 'color: blue',
                    text: connectingObj[i].textContent//,
                    // href: '#'+element.id
                });

                labelFlowLink.hover(
                    function(){
                        this.setAttribute('style', 'text-decoration: underline; color: blue; cursor: pointer');
                    }
                    ,
                    function(){
                        this.setAttribute('style', 'text-decoration: none; color: blue; cursor: default');
                    }            
                );

                labelFlowLink.on("click", function(){
                    if ($("#button-connectingObjects").data('clicked') == false) {
                        //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                        $("#button-connectingObjects").click();
                    }
                    focusDelayed($("input[id*='$$" + connectingObj[i].textContent + "$$']"));
                });

                divGateways.append(labelFlowLink);

               
            }
        }
        // console.log(nodesGateways[counter].children); //TODO REMOVE
        let divGatewaysParameter = jQuery('<div/>', {
            style: "border-radius: 10px; border: solid 1px black; padding: 2%",
            id: 'gateway-parameter-div-$$'+elRef+'$$'
        });
        divGateways.append(divGatewaysParameter);

        // setParameter(divActivitiesParameter);
        let elementName = nodesGateways[counter].localName;
        // console.log(elRef + " " + elementName);
        if(elementName == "eventBasedGateway"){
            setElementParameter(divGatewaysParameter, "gateways", elRef, elementName);
        }else{
            divGatewaysParameter.remove();
        }


    }

    // TODO creare gli elementi corretti per gli events
    for (let counter = 0; counter < nodesEvents.length; counter++) {

        let labelElementRef;
        let elRef = nodesEvents[counter].id;
        if (counter == 0) {
            labelElementRef = jQuery('<label/>', {
                class: 'label-new-element',
                // id: elRef,
                text: 'Element Ref: ' + elRef,
            });

        } else {
            labelElementRef = jQuery('<label/>', {
                class: 'label-new-element',
                // id: elRef,
                text: 'Element Ref: ' + nodesEvents[counter].id,
                style: 'margin-top:15%'
            });
        }
        divEvents.append(labelElementRef);

        let labelId = jQuery('<label/>', {
            for: 'event-id-input$$' + elRef + '$$',
            text: 'ID'
        });

        let inputId = jQuery('<input/>', {
            type: 'text',
            class: 'form-control form-control-input',
            id: 'event-id-input$$' + elRef + '$$',
            placeholder: 'Event ID'
        });

        inputId.on('change', function () {
            saveOrCreateSingleFieldInElementParameters(this);
        });

        divEvents.append(labelId);
        divEvents.append(inputId);

        let divEventsParameter = jQuery('<div/>', {
            style: "border-radius: 10px; border: solid 1px black; padding: 2%",
            id: 'event-parameter-div-$$'+elRef+'$$'
        });
        divEvents.append(divEventsParameter);

        // setParameter(divActivitiesParameter);
        let elementName = nodesEvents[counter].localName;
        // console.log(elRef + " " + elementName);
        setElementParameter(divEventsParameter, "events", elRef, elementName);

    }


    // TODO creare gli elementi corretti per gli arrow
    for (let counter = 0; counter < nodesConnectingObjects.length; counter++) {
        let labelElementRef;
        let elRef = nodesConnectingObjects[counter].id;
        if (counter == 0) {
            labelElementRef = jQuery('<label/>', {
                class: 'label-new-element',
                // id: elRef,
                text: 'Element Ref: ' + elRef,
            });

        } else {
            labelElementRef = jQuery('<label/>', {
                class: 'label-new-element',
                // id: elRef,
                text: 'Element Ref: ' + nodesConnectingObjects[counter].id,
                style: 'margin-top:15%'
            });
        }
        divConnectingObjects.append(labelElementRef);

        let labelId = jQuery('<label/>', {
            for: 'connectingObject-id-input$$' + elRef + '$$',
            text: 'ID'
        });

        let inputId = jQuery('<input/>', {
            type: 'text',
            class: 'form-control form-control-input',
            id: 'connectingObject-id-input$$' + elRef + '$$',
            placeholder: 'Connecting Object ID'
        });

        inputId.on('change', function () {
            saveOrCreateSingleFieldInElementParameters(this);
        });

        divConnectingObjects.append(labelId);
        divConnectingObjects.append(inputId);



        let labelConnectingObj = jQuery('<label/>', {
            // for: 'gateway-id-input$$' + elRef + '$$',
            text: 'Parent',
            style: 'width: 100%'
        });
        divConnectingObjects.append(labelConnectingObj);

        // console.log(nodesConnectingObjects);
        let elRefLink = "";
        if(nodesConnectingObjects[counter].localName == "sequenceFlow"){
            elRefLink = nodesConnectingObjects[counter].attributes[0].textContent;
        }else{
            elRefLink = nodesConnectingObjects[counter].attributes[2].textContent;
        }
        let labelFlowLink = jQuery('<label/>', {
            // for: 'gateway-id-input$$' + elRef + '$$',
            style: 'color: blue',
            text: elRefLink//,
            // href: '#'+element.id
        });

        labelFlowLink.hover(
            function(){
                this.setAttribute('style', 'text-decoration: underline; color: blue; cursor: pointer');
            }
            ,
            function(){
                this.setAttribute('style', 'text-decoration: none; color: blue; cursor: default');
            }            
        );

        labelFlowLink.on("click", function(){
            let divName = $("input[id*='$$" + elRefLink + "$$']")[0].id.split('-')[0];
            if ($("#button-"+divName).data('clicked') == false) {
                //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                $("#button-"+divName).click();
            }
            focusDelayed($("input[id*='$$" + elRefLink + "$$']"));
        });

        divConnectingObjects.append(labelFlowLink);

        let divConnectingObjectsParameter = jQuery('<div/>', {
            style: "border-radius: 10px; border: solid 1px black; padding: 2%",
            id: 'connectingObject-parameter-div-$$'+elRef+'$$'
        });
        divConnectingObjects.append(divConnectingObjectsParameter);

        // setParameter(divActivitiesParameter);
        let elementName = nodesConnectingObjects[counter].localName;
        // console.log(elRef + " " + elementName);
        setElementParameter(divConnectingObjectsParameter, "connectingObjects", elRef, elementName);
    }

    divElementParameter.append(buttonActivities);
    divElementParameter.append(divActivities);
    divElementParameter.append(buttonGateways);
    divElementParameter.append(divGateways);
    divElementParameter.append(buttonEvents);
    divElementParameter.append(divEvents);
    divElementParameter.append(buttonConnectingObjects);
    divElementParameter.append(divConnectingObjects);
    divElementParameter.append(buttonResources);
    divElementParameter.append(divResources);

    // let buttonActivitiesHTML = $('#button-activities');

    // buttonActivitiesHTML.toggle("active");


    elementParameterHTML.append(divElementParameter);

    // elementParameterHTML.append(buttonActivities);
    // elementParameterHTML.append(divActivities);


    // costruzione buttons in scenario
    var coll = document.getElementsByClassName("collapsible");
    for (let i = 0; i < coll.length; i++) {
        if (coll[i].id != "elem-par-btn" && coll[i].id != "scen-par-btn" && coll[i].id != "calendar-btn" || firstTime) {
            coll[i].addEventListener("click", function () {
                $(this).data('clicked', !$(this).data('clicked'));
                this.classList.toggle("active");
                refreshDimension(this);
            });
        }
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
    $('#scenario-picker').empty();

    for (let i = 0; i < numScenarios; i++) {
        $('#scenario-picker').append($('<option>', {
            value: i + 1,
            text: scenarios[i].id
        }));
    }

    if (firstTime) {
        //salvataggio delle modifiche per ogni attributo di scenario
        $("input[id*='scenario-']").on('change', function () {
            saveScenarioAtrribute(this);
        });

        //salvataggio delle modifiche per ogni attributo semplice (no baseTimeUnit) di scenarioParameters
        $("input[id*='scenarioParametersAttribute-']").on('change', function () {
            saveScenarioParameterAtrribute(this);
        });

        //salvataggio delle modifiche sul picker di baseTimeUnit di scenarioParameters
        $('#scenarioParameters-baseTimeUnit-picker').on('change', function(){
            let baseTimeValue = $('#scenarioParameters-baseTimeUnit-picker').val();
            dataTreeObjGlobal.scenario[currentScenarioGlobal-1].scenarioParameters.baseTimeUnit = TimeUnit[baseTimeValue];
        });
    }
    //TODO utilizzare quando bisogna aggiungere uno scenario
    // $('#scenario-picker').append($('<option>', {
    //     value: 2,
    //     text: 2
    // }));

    //serve a fare prove con un determinato scenario
    // $('#scenario-picker').val(3);
    // console.log(TimeUnit[2]);
    if (firstTime) {
        for (let timeUnit in TimeUnit) {
            $('#scenarioParameters-baseTimeUnit-picker').append($('<option>', {
                value: timeUnit,
                text: timeUnit
            }));
        }
    }

    $('#scenarioParameters-baseTimeUnit-picker').val('minutes');

    let scenarioSelected = $('#scenario-picker').val();
    currentScenarioGlobal = scenarioSelected;

    refreshFormFields(scenarios, scenarioSelected);


    if (firstTime) {
        $('#scenario-picker').on('change', function () {

            // * serie di if che servono a chiudere i menù a tendina quando si cambia scenario
            closeCollapsibleButton();

            let scenarioSelected = $('#scenario-picker').val();


            console.log("riattivare salvataggio")//TODO 

            // saveDataTreeStructure(currentScenarioGlobal);

            saveLocalCalendars();

            currentScenarioGlobal = scenarioSelected;

            let scenariosTemp = dataTreeObjGlobal.scenario;
            // createFormFields()
            refreshFormFields(scenariosTemp, scenarioSelected);

        });
    }
}

function setElementParameter(parameter, section, elRef, elementName){

    let labelInitial = jQuery('<label/>', {
        text: 'Add Parameter'
    });
    parameter.append(labelInitial);

    let btnAdd = jQuery('<button/>', {
        class: 'btn btn-primary btn-lg button-calculate btn-icon',
        type: 'button',
        id: 'btn-create-elementParameter-$$'+elRef+'$$'
    });

    let iElForPlus = jQuery('<i/>', {
        class: 'fa fa-plus',
        id: 'btn-create-elementParameter-$$'+elRef+'$$'
    });

    btnAdd.append(iElForPlus);

    btnAdd.on('click', function(){
        elementParameterCounterGlobal+=1;

        let div = jQuery('<div/>', {
            id: 'div-parameter'+elementParameterCounterGlobal+'-$$'+elRef+'$$',
            style: "border-radius: 10px; border: solid 1px black; padding: 2%"
        });
    
        let elementParameterTypePicker = jQuery('<select/>', {
            class: "scenario-picker",
            id: 'select-parameter'+elementParameterCounterGlobal+'-$$'+elRef+'$$'
        });

        elementParameterTypePicker.append($('<option>', {
            value: "",
            text: ""
        }));
        
        
        // elementParameterTypePicker.append($('<option>', {
        //     value: "ciao",
        //     text: "ciao"
        // }));
        //inserire picker
        let superclassOptions = [];
        let singleOptionMatrix = [];

        if(section == "activities"){
            superclassOptions = ["Time Parameters", "Control Parameters", "Cost Parameters", "Property Parameters",
                "Priority Parameters"];
            singleOptionMatrix = [
                ["Transfer Time", "Queue Time", "Wait Time", "Setup Time", "Processing Time", "Validation Time", 
                "Rework Time"],
                ["Inter Trigger Timer", "Trigger Count"], //TODO eventSubProcess ha anche probability e condition
                ["Fixed Cost", "Unit Cost"],
                ["Property", "Queue Length"],
                ["Interruptible", "Priority"]
            ];
            
        }else if(section == "events"){
            if(elementName == "startEvent"){
                superclassOptions = ["Control Parameters", "Property Parameters"];
                singleOptionMatrix = [
                    ["Inter Trigger Timer", "Trigger Count", "Probability", "Condition"], //TODO prob e cond da verificare
                    ["Property"]
                ]
            }else if(elementName == "endEvent"){
                superclassOptions = ["Property Parameters"];
                singleOptionMatrix = [
                    ["Property"]
                ]
            }else{
                if(elementName == "intermediateCatchEvent"){
                    superclassOptions = ["Control Parameters", "Property Parameters"];
                    singleOptionMatrix = [
                        ["Inter Trigger Timer"],
                        ["Property"]
                    ]
                }else if(elementName == "boundaryEvent"){
                    superclassOptions = ["Control Parameters", "Property Parameters"];
                    singleOptionMatrix = [
                        ["Probability", "Condition"],
                        ["Property"]
                    ]
                }else{
                    superclassOptions = ["Property Parameters"];
                    singleOptionMatrix = [
                        ["Property"]
                    ]
                }
            }
        }else if(section == "gateways"){
            superclassOptions = ["Control Parameters"];
            singleOptionMatrix = [["Inter Trigger Timer", "Trigger Count"]];

        }else{
            if(elementName == "sequenceFlow"){
                superclassOptions = ["Control Parameters", "Property Parameters"];
                singleOptionMatrix = [
                    ["Probability", "Condition"], //solo per sequence flow
                    ["Property"] //sia per sequence flow che per message flow
                ]
            }else{
                superclassOptions = ["Property Parameters"];
                singleOptionMatrix = [
                    ["Property"] //sia per sequence flow che per message flow
                ]
            }
            
        }


        for (let i = 0; i<superclassOptions.length; i++) {
            let subGroup= $('<optgroup>', {
                label: superclassOptions[i]
            });
            for(let j=0; j<singleOptionMatrix[i].length; j++){
                let singleNames = singleOptionMatrix[i][j].split(" ");
                let nameSplittedWithoutSpace="";
                for(let k=0;k<singleNames.length; k++){
                    nameSplittedWithoutSpace += singleNames[k];
                }
                subGroup.append($('<option>', {
                    value: nameSplittedWithoutSpace,
                    text: singleOptionMatrix[i][j]
                }));
            }
            elementParameterTypePicker.append(subGroup);
        }



        div.append(elementParameterTypePicker);

        let btnTrash = jQuery('<button/>', {
            class: 'btn btn-primary btn-lg button-calculate btn-icon',
            type: 'button',
            id: 'btn-deleteParameter'+elementParameterCounterGlobal+'-$$'+elRef+'$$'
    
        });
    
        let iElforTrash = jQuery('<i/>', {
            class: 'fa fa-trash',
            id: 'btn-deleteParameter'+elementParameterCounterGlobal+'-$$'+elRef+'$$'
        });
    
        btnTrash.append(iElforTrash);
    
        let localParametersCounter = elementParameterCounterGlobal;

        btnTrash.on('click', function(){
            document.getElementById('div-parameter'+localParametersCounter+'-$$'+elRef+'$$').remove();
        });
    
        
        div.append(btnTrash);


        let divType = jQuery('<div/>', {
            id: 'divType-parameter'+elementParameterCounterGlobal+'-$$'+elRef+'$$'
            // style: "border-radius: 10px; border: solid 1px black; padding: 2%"
        });

        div.append(divType);
        //  TODO fare set parameter sull'on change del picker

        elementParameterTypePicker.on('change', function(){
            divType.empty();
            var selected_option = $(this).find(":selected"); // get selected option for the changed select only
            var selected_value = selected_option.val();
            var optgroup = selected_option.parent().attr('label');

            if(this.value != ""){
                setParameter(divType);

                let resultRequestPicker = $("[id*=parameter"+localParametersCounter+"-resultRequest]")[0];
                let resultRequestLabel = $("[id*=parameter"+localParametersCounter+"-label-resultRequest]")[0]
                switch(optgroup){
                    case "Time Parameters":{
                        //nothing to do
                        //TODO Vedere se rimuovere perché non si deve fare nulla
                        break;
                    }
                    case "Control Parameters":{
                        console.log(selected_value);
                        if(selected_value == "InterTriggerTimer"){
                            //all but not count
                            resultRequestPicker.removeChild(resultRequestPicker.options[3]);
                        }else if (selected_value == "TriggerCount"){
                            //only count
                            resultRequestPicker.removeChild(resultRequestPicker.options[4]);
                            resultRequestPicker.removeChild(resultRequestPicker.options[0]);
                            resultRequestPicker.removeChild(resultRequestPicker.options[0]);
                            resultRequestPicker.removeChild(resultRequestPicker.options[0]);

                        }else{
                            resultRequestLabel.remove();
                            resultRequestPicker.remove();
                        }
                        break;
                    }
                    case "Resource Parameters":{
                        if(selected_value != "Selection"){
                            resultRequestLabel.remove();
                            resultRequestPicker.remove();
                        }else{
                            //only min max
                            resultRequestPicker.removeChild(resultRequestPicker.options[2]);
                            resultRequestPicker.removeChild(resultRequestPicker.options[2]);
                            resultRequestPicker.removeChild(resultRequestPicker.options[2]);
                        }
                        break;
                    }
                    case "Cost Parameters":{
                        //only sum
                        resultRequestPicker.removeChild(resultRequestPicker.options[0]);
                        resultRequestPicker.removeChild(resultRequestPicker.options[0]);
                        resultRequestPicker.removeChild(resultRequestPicker.options[0]);
                        resultRequestPicker.removeChild(resultRequestPicker.options[0]);
                        break;
                    }
                    case "Property Parameters":{
                        if(selected_value == "Property"){
                            divType.empty();
                            
                            //TODO creare div per lista di property
                            let btnAddProperty = jQuery('<button/>', {
                                class: 'btn btn-primary btn-lg button-calculate btn-icon',
                                type: 'button',
                                id: 'btn-create-property'
                        
                            });
                        
                            let iElForPlus = jQuery('<i/>', {
                                class: 'fa fa-plus',
                                id: 'btn-create-property'
                            });
                        
                            btnAddProperty.append(iElForPlus);
                            let propertiesCounter = 0;
                            btnAddProperty.on('click',function(){
                                propertiesCounter += 1;
                                parameterValueDivCounterGlobal += 1;
                                //aggiunta div property
                                let propertyDiv = jQuery('<div/>', {
                                    id: 'elementParameters-property'+propertiesCounter+'-div-'+parameterValueDivCounterGlobal,
                                    style: "border-radius: 10px; border: solid 1px black; padding: 2%"
                                });
                        
                                setParameter(propertyDiv);
                        
                                let labelPropertyName = jQuery('<label/>', {
                                    for: 'elementParameters-property-propertyParameters-name-'+parameterValueDivCounterGlobal,
                                    text: 'Name',
                                    width: '100%'
                                });
                            
                                let inputPropertyName = jQuery('<input/>', {
                                    type: 'text',
                                    class: 'form-control form-control-input',
                                    id: 'elementParameters-property-propertyParameters-name-'+parameterValueDivCounterGlobal,
                                    placeholder: 'Property Name'
                                });
                            
                                propertyDiv.append(labelPropertyName);
                                propertyDiv.append(inputPropertyName);
                            
                                let propertyTypeLabel = jQuery('<label/>', {
                                    style: 'width: 100%',
                                    text: 'Property Type'
                                });
                            
                                let propertyTypePicker = jQuery('<select/>', {
                                    class: 'scenario-picker',
                                    id: 'propertyType-elementParameters-picker-'+parameterValueDivCounterGlobal,
                                    width: '100%'
                                });
                                
                                for (let propertyType in PropertyType) {
                                    propertyTypePicker.append($('<option>', {
                                        value: propertyType,
                                        text: propertyType
                                    }));
                                }
                            
                                propertyDiv.append(propertyTypeLabel);
                                propertyDiv.append(propertyTypePicker);
                        
                        
                                let btnTrash = jQuery('<button/>', {
                                    class: 'btn btn-primary btn-lg button-calculate btn-icon',
                                    type: 'button',
                                    id: 'btn-deleteProperty'+propertiesCounter+'-'+parameterValueDivCounterGlobal
                            
                                });
                            
                                let iElforTrash = jQuery('<i/>', {
                                    class: 'fa fa-trash',
                                    id: 'btn-deleteProperty'+propertiesCounter+'-'+parameterValueDivCounterGlobal
                                });
                            
                                btnTrash.append(iElforTrash);
                            
                                let idLocalRemoveProperty = parameterValueDivCounterGlobal;
                                let localPropertiesCounter = propertiesCounter;
                        
                            
                                btnTrash.on('click', function(){
                                    $('div[id*=elementParameters-property'+localPropertiesCounter+'-div-'+idLocalRemoveProperty+']').remove();
                                });
                            
                                propertyDiv.append(btnTrash);
                        
                                divType.append(propertyDiv);
                        
                            
                            });
                            divType.append(btnAddProperty);
                            
                            
                        

                        }else{
                            //all but not count and sum
                            resultRequestPicker.removeChild(resultRequestPicker.options[3]);
                            resultRequestPicker.removeChild(resultRequestPicker.options[3]);
                        }
                        break;
                    }
                    case "Priority Parameters":{
                        resultRequestLabel.remove();
                        resultRequestPicker.remove();

                        break;
                    }
                }
            }

        });

    
        //TODO gestire nell'on change l'eliminazione delle option di resultRequest

        
        parameter.append(div);

    });

    parameter.append(btnAdd);
    

}

function setParameter(parameter){

    // console.log(parameter);
    
    let parameterName =  parameter[0].id.split("-")[1];
    parameter.empty();

    let nameLabel = jQuery('<label/>', {
        style: "font-size: large; width:100%",
        text: parameterName.charAt(0).toUpperCase() + parameterName.slice(1)
    });

    parameter.append(nameLabel);

    let valueLabel = jQuery('<label/>', {
        text: "Value",
    });   

    let btnAdd = jQuery('<button/>', {
        class: 'btn btn-primary btn-lg button-calculate btn-icon',
        type: 'button',
        id: 'btn-create-'+parameterName+'-value'

    });

    let iElForPlus = jQuery('<i/>', {
        class: 'fa fa-plus',
        id: 'btn-create-'+parameterName+'-value'
    });

    btnAdd.append(iElForPlus);

    btnAdd.on("click", function(){
        let superclassOptions = ["Constant Parameters", "Distribution Parameters", "Enum Parameters", "Expression Parameters"];
        let singleOptionMatrix = [ 
        ["Boolean Parameter", "DateTime Parameter", "Duration Parameter", "Floating Parameter", "Numeric Parameter", 
        "String Parameter"], 
        ["Beta Distribution", "Binomial Distribution", "Erlang Distribution", "Gamma Distribution", 
        "Log Normal Distribution", "Negative Exponential Distribution", "Normal Distribution", 
        "Poisson Distribution", "Triangular Distribution", "Truncated Normal Distribution", "Uniform Distribution", 
        "User Distribution", "Weibull Distribution"],
        ["Enum Parameter"], 
        ["Expression Parameter"] ];

        parameterValueDivCounterGlobal+=1;
        
        let valuesSection = $('#'+parameterName+'-values-section');
        
        //aggiunta divs
        let valueDiv = jQuery('<div/>', {
            id: parameterName+"-value-div-"+parameterValueDivCounterGlobal,
            style: "border-radius: 10px; border: solid 1px black; padding: 2%"
        });

        let parameterValuePicker = jQuery('<select/>', {
            class: "scenario-picker",
            id: parameterName+"-value-picker-"+parameterValueDivCounterGlobal 
        });

        parameterValuePicker.append($('<option>', {
            value: "",
            text: ""
        }));

        //creazione picker con tutti i possibili valori di ParameterValue
        for (let i = 0; i<superclassOptions.length; i++) {
            let subGroup= $('<optgroup>', {
                label: superclassOptions[i]
            });
            for(let j=0; j<singleOptionMatrix[i].length; j++){
                let singleNames = singleOptionMatrix[i][j].split(" ");
                let nameSplittedWithoutSpace="";
                for(let k=0;k<singleNames.length; k++){
                    nameSplittedWithoutSpace += singleNames[k];
                }
                subGroup.append($('<option>', {
                    value: nameSplittedWithoutSpace,
                    text: singleOptionMatrix[i][j]
                }));
            }
            parameterValuePicker.append(subGroup);
        }

        parameterValuePicker.on('change', function () {
            // console.log(this.id);
            let idElementsLocal = this.id.split("-")[3];
            let contentDiv = $('#'+parameterName+'-value-content-div-'+idElementsLocal);

            contentDiv.empty();
            
            if(this.value != ""){
                let valueValidForLabel = jQuery('<label/>', {
                    for: parameterName+'-value-validFor-input-'+idElementsLocal,
                    text: 'Valid For'
                });

                let valueValidForInput = jQuery('<input/>', {
                    type: 'text',
                    class: 'form-control form-control-input',
                    id: parameterName+'-value-validFor-input-'+idElementsLocal,
                    placeholder: 'Valid for'
                });
                contentDiv.append(valueValidForLabel);
                contentDiv.append(valueValidForInput);

                let valueInstanceLabel = jQuery('<label/>', {
                    for: parameterName+'-value-instance-input-'+idElementsLocal,
                    text: 'Instance'
                });

                let valueInstanceInput = jQuery('<input/>', {
                    type: 'text',
                    class: 'form-control form-control-input',
                    id: parameterName+'-value-instance-input-'+idElementsLocal,
                    placeholder: 'Instance value'
                });
                contentDiv.append(valueInstanceLabel);
                contentDiv.append(valueInstanceInput);

                let valueResultLabel = jQuery('<label/>', {
                    style: 'width: 100%',
                    for: parameterName+'-value-result-input-'+idElementsLocal,
                    text: 'Result'
                });

                let valueResultPicker = jQuery('<select/>', {
                    class: 'scenario-picker',
                    id: parameterName+'-value-result-picker-'+idElementsLocal
                });
                
                for (let resultType in ResultType) {
                    valueResultPicker.append($('<option>', {
                        value: resultType,
                        text: resultType
                    }));
                }

                contentDiv.append(valueResultLabel);
                contentDiv.append(valueResultPicker);

                let valueResultTimeStampLabel = jQuery('<label/>', {
                    style: 'width: 100%',
                    for: parameterName+'-value-resultTimeStamp-input-'+idElementsLocal,
                    text: 'Result Time Stamp'
                });

                let valueResultTimeStampInput = jQuery('<input/>', {
                    type: 'datetime-local',
                    class: 'form-control form-control-input',
                    id: parameterName+'-value-resultTimeStamp-input-'+idElementsLocal,
                    placeholder: 'Result Time Stamp value'
                });
                contentDiv.append(valueResultTimeStampLabel);
                contentDiv.append(valueResultTimeStampInput);
            }
            switch(this.value) {
                case "ExpressionParameter":{
                    let expressionLabel = jQuery('<label/>', {
                        for: parameterName+'+value-expressionParameterValue-input-'+idElementsLocal,
                        text: 'Value'
                    });
        
                    let expressionInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName+'-value-expressionParameterValue-input-'+idElementsLocal,
                        placeholder: 'The XPATH expression'
                    });
                    contentDiv.append(expressionLabel);
                    contentDiv.append(expressionInput);
                    break;
                }
                case "EnumParameter":{
                    
                    let enumValuesLabel = jQuery('<label/>', {
                        for: parameterName+'+value-enumParameterValue-input-'+idElementsLocal,
                        text: 'Values'
                    });
        
                    let btnAddEnumValues = jQuery('<button/>', {
                        class: 'btn btn-primary btn-lg button-calculate btn-icon',
                        type: 'button',
                        id: 'btn-create-'+parameterName+'-value-enumParameter-values-'+idElementsLocal
                
                    });
                
                    let iElForPlusEnumValues = jQuery('<i/>', {
                        class: 'fa fa-plus',
                        id: 'btn-create-'+parameterName+'-value-enumParameter-values-'+idElementsLocal
                    });
                
                    btnAddEnumValues.append(iElForPlusEnumValues);
                    btnAddEnumValues.on("click", function(){

                        parameterValueDivCounterGlobal+=1;

                        let idElementsEnumLocal = this.id.split("-")[6];
                        let contentEnumValues= $('#'+parameterName+"-value-enum-values-content-div-"+idElementsEnumLocal);

                        let constantParameterValues = ["Boolean Parameter", "DateTime Parameter", "Duration Parameter",
                         "Floating Parameter", "Numeric Parameter", "String Parameter"];

                        
                        let enumValuePicker = jQuery('<select/>', {
                            class: "scenario-picker",
                            id: parameterName+"-value-enum-values-picker-"+idElementsEnumLocal
                        });


                        enumValuePicker.append($('<option>', {
                            value: "",
                            text: ""
                        }));

                        enumValuePicker.append($('<optgroup>', {
                            label: "Constant Parameter"
                        }));


                        for (let i = 0; i<constantParameterValues.length; i++) {
                            let singleNames = constantParameterValues[i].split(" ");
                            let nameSplittedWithoutSpace="";
                            for(let j=0;j<singleNames.length; j++){
                                nameSplittedWithoutSpace += singleNames[j];
                            }
                            enumValuePicker.append($('<option>', {
                                value: nameSplittedWithoutSpace,
                                text: constantParameterValues[i]
                            }));
                        }

                        let enumDiv = jQuery('<div/>', {
                            style: "border-radius: 10px; border: solid 1px black; padding: 2%",
                            id: 'enumParameter-'+parameterName+'-value-div-'+idElementsEnumLocal+'-'+parameterValueDivCounterGlobal
                        });

                        enumDiv.append(enumValuePicker);

                        contentEnumValues.append(enumDiv);

                        let btnTrash = jQuery('<button/>', {
                            class: 'btn btn-primary btn-lg button-calculate btn-icon',
                            type: 'button',
                            id: 'btn-deleteValue-'+parameterName+'-value-'+idElementsEnumLocal+'-'+parameterValueDivCounterGlobal
                
                        });
                
                        let iElforTrash = jQuery('<i/>', {
                            class: 'fa fa-trash',
                            id: 'btn-deleteValue-'+parameterName+'-value-'+idElementsEnumLocal+'-'+parameterValueDivCounterGlobal
                        });
                
                        btnTrash.append(iElforTrash);
                
                        let idLocal = parameterValueDivCounterGlobal;
                
                        btnTrash.on('click', function(){
                            $('div[id*='+parameterName+'-value-div-'+idElementsEnumLocal+'-'+idLocal+']').remove();
                        });

                        enumDiv.append(btnTrash);

                        let enumContentDiv = jQuery('<div/>', {
                            id: 'enumParameter-'+parameterName+'-content-div-'+idElementsEnumLocal+'-'+parameterValueDivCounterGlobal
                        });

                        enumDiv.append(enumContentDiv);

                        //gestione onchange del picker di enum
                        enumValuePicker.on('change', function(){
                            enumContentDiv.empty();
                            
                            switch(this.value){
                                case "BooleanParameter":{
                                    let valueBooleanLabel = jQuery('<label/>', {
                                        for: 'enumParameter-'+parameterName+'-value-booleanParameterValue-input-'+idElementsEnumLocal+'-'+idLocal,
                                        text: 'Value'
                                    });
                
                                    let divBoolean = jQuery('<div/>', {
                                        class: "onoffswitch"
                                    });
                
                                    // <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="scenarioParametersAttribute-traceOutput-input" checked></input>
                                    let booleanCheckBox = jQuery('<input/>', {
                                        type: "checkbox",
                                        name: "onoffswitch",
                                        class: "onoffswitch-checkbox",
                                        id: 'enumParameter-'+parameterName+'-value-booleanParameterValue-input-'+idElementsEnumLocal+'-'+idLocal
                                    });
                                    divBoolean.append(booleanCheckBox);
                
                                    let spanInner = jQuery('<span/>', {
                                        class: "onoffswitch-inner"
                                    });
                                    
                                    let spanSwitch = jQuery('<span/>', {
                                        class: "onoffswitch-switch"
                                    });
                
                                    let labelOnOffSwitch = jQuery('<label/>', {
                                        class: "onoffswitch-label",
                                        for: 'enumParameter-'+parameterName+'-value-booleanParameterValue-input-'+idElementsEnumLocal+'-'+idLocal
                                    });

                                    labelOnOffSwitch.append(spanInner);
                                    labelOnOffSwitch.append(spanSwitch);
                
                                    divBoolean.append(labelOnOffSwitch);
                                    
                                    enumContentDiv.append(valueBooleanLabel);
                                    enumContentDiv.append(divBoolean);
                                    
                                    break;
                                }
                                case "DateTimeParameter":{
                                    let dateTimeLabel = jQuery('<label/>', {
                                        for: 'enumParameter-'+parameterName+'-value-dateTimeParameterValue-input-'+idElementsEnumLocal+'-'+idLocal,
                                        text: 'Value'
                                    });
                        
                                    let dateTimeInput = jQuery('<input/>', {
                                        type: 'text',
                                        class: 'form-control form-control-input',
                                        id: 'enumParameter-'+parameterName+'-value-dateTimeParameterValue-input-'+idElementsEnumLocal+'-'+idLocal,
                                        placeholder: 'DateTime value'
                                    });
                                    enumContentDiv.append(dateTimeLabel);
                                    enumContentDiv.append(dateTimeInput);
                                    break;
                                }
                                case "DurationParameter":{
                                    let durationLabel = jQuery('<label/>', {
                                        for: 'enumParameter-'+parameterName+'-value-durationParameterValue-input-'+idElementsEnumLocal+'-'+idLocal,
                                        text: 'Value'
                                    });
                        
                                    let durationInput = jQuery('<input/>', {
                                        type: 'text',
                                        class: 'form-control form-control-input',
                                        id: 'enumParameter-'+parameterName+'-value-durationParameterValue-input-'+idElementsEnumLocal+'-'+idLocal,
                                        placeholder: 'Duration value'
                                    });
                                    enumContentDiv.append(durationLabel);
                                    enumContentDiv.append(durationInput);
                                    break;
                                }
                                case "FloatingParameter":{
                                    let floatingLabel = jQuery('<label/>', {
                                        for: 'enumParameter-'+parameterName+'-value-floatingParameterValue-input-'+idElementsEnumLocal+'-'+idLocal,
                                        text: 'Value'
                                    });
                        
                                    let floatingInput = jQuery('<input/>', {
                                        type: 'text',
                                        class: 'form-control form-control-input',
                                        id: 'enumParameter-'+parameterName+'-value-floatingParameterValue-input-'+idElementsEnumLocal+'-'+idLocal,
                                        placeholder: 'Floating value'
                                    });

                                    enumContentDiv.append(floatingLabel);
                                    enumContentDiv.append(floatingInput);

                                    let floatingTimeUnitLabel = jQuery('<label/>', {
                                        for: 'enumParameter-value-floatingParameterTimeUnit-picker-'+idElementsEnumLocal+'-'+idLocal,
                                        text: 'Time Unit',
                                        style: "width: 100%"
                                    });
                        
                                    let floatingTimeUnitPicker = jQuery('<select/>', {
                                        class: 'scenario-picker',
                                        id: 'enumParameter-value-floatingParameterTimeUnit-picker-'+idElementsEnumLocal+'-'+idLocal
                                    });
                                    
                                    for (let timeUnit in TimeUnit) {
                                        floatingTimeUnitPicker.append($('<option>', {
                                            value: timeUnit,
                                            text: timeUnit
                                        }));
                                    }
                
                                    enumContentDiv.append(floatingTimeUnitLabel);
                                    enumContentDiv.append(floatingTimeUnitPicker);

                                    break;
                                }
                                case "NumericParameter":{
                                    let numericLabel = jQuery('<label/>', {
                                        for: 'enumParameter-'+parameterName+'-value-numericParameterValue-input-'+idElementsEnumLocal+'-'+idLocal,
                                        text: 'Value'
                                    });
                        
                                    let numericInput = jQuery('<input/>', {
                                        type: 'text',
                                        class: 'form-control form-control-input',
                                        id: 'enumParameter-'+parameterName+'-value-numericParameterValue-input-'+idElementsEnumLocal+'-'+idLocal,
                                        placeholder: 'Int value'
                                    });

                                    enumContentDiv.append(numericLabel);
                                    enumContentDiv.append(numericInput);

                                    let numericTimeUnitLabel = jQuery('<label/>', {
                                        for: 'enumParameter-value-numericParameterTimeUnit-picker-'+idElementsEnumLocal+'-'+idLocal,
                                        text: 'Time Unit',
                                        style: "width: 100%"
                                    });
                        
                                    let numericTimeUnitPicker = jQuery('<select/>', {
                                        class: 'scenario-picker',
                                        id: 'enumParameter-value-numericParameterTimeUnit-picker-'+idElementsEnumLocal+'-'+idLocal
                                    });
                                    
                                    for (let timeUnit in TimeUnit) {
                                        numericTimeUnitPicker.append($('<option>', {
                                            value: timeUnit,
                                            text: timeUnit
                                        }));
                                    }
                
                                    enumContentDiv.append(numericTimeUnitLabel);
                                    enumContentDiv.append(numericTimeUnitPicker);

                                    break;
                                }
                                case "StringParameter":{
                                    let stringLabel = jQuery('<label/>', {
                                        for: 'enumParameter-'+parameterName+'-value-stringParameterValue-input-'+idElementsEnumLocal+'-'+idLocal,
                                        text: 'Value'
                                    });
                        
                                    let stringInput = jQuery('<input/>', {
                                        type: 'text',
                                        class: 'form-control form-control-input',
                                        id: 'enumParameter-'+parameterName+'-value-stringParameterValue-input-'+idElementsEnumLocal+'-'+idLocal,
                                        placeholder: 'String value'
                                    });
                                    enumContentDiv.append(stringLabel);
                                    enumContentDiv.append(stringInput);
                                    break;
                                }
                            }
                        });
                    });

                    let divContentEnumValues = jQuery('<div/>', {
                        id: parameterName+"-value-enum-values-content-div-"+idElementsLocal
                    });

                    contentDiv.append(enumValuesLabel);
                    contentDiv.append(btnAddEnumValues);
                    contentDiv.append(divContentEnumValues);

                    break;
                }
                /**
                 * Sezione Distribution
                 */

                case "BetaDistribution":
                case "GammaDistribution":
                case "WeibullDistribution": {
                    let distributionName = this.value;
                    distributionName = distributionName.charAt(0).toLowerCase() + distributionName.slice(1);
                    let valueTimeUnitLabel = jQuery('<label/>', {
                        id: parameterName+'-value-'+distributionName+'-input-'+idElementsLocal,
                        text: 'Time Unit',
                        style: "width: 100%"
                    });
        
                    let valueTimeUnitPicker = jQuery('<select/>', {
                        class: 'scenario-picker',
                        id: parameterName+'-value-'+distributionName+'-input-'+idElementsLocal,
                    });
                    
                    for (let timeUnit in TimeUnit) {
                        valueTimeUnitPicker.append($('<option>', {
                            value: timeUnit,
                            text: timeUnit
                        }));
                    }
                    contentDiv.append(valueTimeUnitLabel);
                    contentDiv.append(valueTimeUnitPicker);

                    let shapeLabel = jQuery('<label/>', {
                        width: "-webkit-fill-available",
                        for: parameterName+'-shape-'+distributionName+'-input-'+idElementsLocal,
                        text: 'Shape'
                    });
        
                    let shapeInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName+'-shape-'+distributionName+'-input-'+idElementsLocal,
                        placeholder: 'Shape value'
                    });
                    contentDiv.append(shapeLabel);
                    contentDiv.append(shapeInput);

                    let scaleLabel = jQuery('<label/>', {
                        for: parameterName+'-scale-'+distributionName+'-input-'+idElementsLocal,
                        text: 'Scale'
                    });
        
                    let scaleInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName+'-scale-'+distributionName+'-input-'+idElementsLocal,
                        placeholder: 'Scale value'
                    });
                    contentDiv.append(scaleLabel);
                    contentDiv.append(scaleInput);
                    break;
                }

                case "NormalDistribution":
                case "LogNormalDistribution":
                case "TriangularDistribution":
                case "UniformDistribution":
                case "TruncatedNormalDistribution":
                case "NegativeExponentialDistribution":
                case "ErlangDistribution": 
                case "PoissonDistribution":
                {
                    let distributionName = this.value;
                    distributionName = distributionName.charAt(0).toLowerCase() + distributionName.slice(1);
                    let valueTimeUnitLabel = jQuery('<label/>', {
                        id: parameterName+'-value-'+distributionName+'-input-'+idElementsLocal,
                        text: 'Time Unit',
                        style: "width: 100%"
                    });
        
                    let valueTimeUnitPicker = jQuery('<select/>', {
                        class: 'scenario-picker',
                        id: parameterName+'-value-'+distributionName+'-input-'+idElementsLocal,
                    });
                    
                    for (let timeUnit in TimeUnit) {
                        valueTimeUnitPicker.append($('<option>', {
                            value: timeUnit,
                            text: timeUnit
                        }));
                    }
                    contentDiv.append(valueTimeUnitLabel);
                    contentDiv.append(valueTimeUnitPicker);

                    if(this.value == "NormalDistribution"||
                    this.value == "LogNormalDistribution" ||
                    this.value == "PoissonDistribution" ||
                    this.value == "ErlangDistribution" ||
                    this.value == "TruncatedNormalDistribution" ||
                    this.value == "NegativeExponentialDistribution"){
                        let meanLabel = jQuery('<label/>', {
                            width: "-webkit-fill-available",
                            for: parameterName+'-mean-'+distributionName+'-input-'+idElementsLocal,
                            text: 'Mean'
                        });
            
                        let meanInput = jQuery('<input/>', {
                            type: 'text',
                            class: 'form-control form-control-input',
                            id: parameterName+'-mean-'+distributionName+'-input-'+idElementsLocal,
                            placeholder: 'Mean value'
                        });
                        contentDiv.append(meanLabel);
                        contentDiv.append(meanInput);
                    }

                    if(this.value == "NormalDistribution"||
                    this.value == "LogNormalDistribution" ||
                    this.value == "TruncatedNormalDistribution"){
                        let standardDeviationLabel = jQuery('<label/>', {
                            for: parameterName+'-standardDeviation-'+distributionName+'-input-'+idElementsLocal,
                            text: 'Standard Deviation'
                        });
            
                        let standardDeviationInput = jQuery('<input/>', {
                            type: 'text',
                            class: 'form-control form-control-input',
                            id: parameterName+'-standardDeviation-'+distributionName+'-input-'+idElementsLocal,
                            placeholder: 'Standard Deviation value'
                        });
                        contentDiv.append(standardDeviationLabel);
                        contentDiv.append(standardDeviationInput);
                    }

                    if(this.value == "UniformDistribution"||
                    this.value == "TriangularDistribution" ||
                    this.value == "TruncatedNormalDistribution"){
                        let minLabel = jQuery('<label/>', {
                            width: "-webkit-fill-available",
                            for: parameterName+'-min-'+distributionName+'-input-'+idElementsLocal,
                            text: 'Min'
                        });
            
                        let minInput = jQuery('<input/>', {
                            type: 'text',
                            class: 'form-control form-control-input',
                            id: parameterName+'-min-'+distributionName+'-input-'+idElementsLocal,
                            placeholder: 'Min value'
                        });
                        contentDiv.append(minLabel);
                        contentDiv.append(minInput);
                    }

                    if(this.value == "UniformDistribution"||
                    this.value == "TriangularDistribution" ||
                    this.value == "TruncatedNormalDistribution"){
                        let maxLabel = jQuery('<label/>', {
                            for: parameterName+'-max-'+distributionName+'-input-'+idElementsLocal,
                            text: 'Max'
                        });
            
                        let maxInput = jQuery('<input/>', {
                            type: 'text',
                            class: 'form-control form-control-input',
                            id: parameterName+'-max-'+distributionName+'-input-'+idElementsLocal,
                            placeholder: 'Max value'
                        });
                        contentDiv.append(maxLabel);
                        contentDiv.append(maxInput);
                    }

                    if(this.value == "TriangularDistribution"){
                        let modeLabel = jQuery('<label/>', {
                            for: parameterName+'-mode-'+distributionName+'-input-'+idElementsLocal,
                            text: 'Mode'
                        });
            
                        let modeInput = jQuery('<input/>', {
                            type: 'text',
                            class: 'form-control form-control-input',
                            id: parameterName+'-mode-'+distributionName+'-input-'+idElementsLocal,
                            placeholder: 'Mode value'
                        });
                        contentDiv.append(modeLabel);
                        contentDiv.append(modeInput);
                    }

                    if(this.value == "ErlangDistribution"){
                        let kLabel = jQuery('<label/>', {
                            for: parameterName+'-k-'+distributionName+'-input-'+idElementsLocal,
                            text: 'K'
                        });
            
                        let kInput = jQuery('<input/>', {
                            type: 'text',
                            class: 'form-control form-control-input',
                            id: parameterName+'-k-'+distributionName+'-input-'+idElementsLocal,
                            placeholder: 'K value'
                        });
                        contentDiv.append(kLabel);
                        contentDiv.append(kInput);
                    }
                    break;                
                }

                case "BinomialDistribution": {
                    let distributionName = this.value;
                    distributionName = distributionName.charAt(0).toLowerCase() + distributionName.slice(1);
                    let valueTimeUnitLabel = jQuery('<label/>', {
                        id: parameterName+'-value-'+distributionName+'-input-'+idElementsLocal,
                        text: 'Time Unit',
                        style: "width: 100%"
                    });
        
                    let valueTimeUnitPicker = jQuery('<select/>', {
                        class: 'scenario-picker',
                        id: parameterName+'-value-'+distributionName+'-input-'+idElementsLocal,
                    });
                    
                    for (let timeUnit in TimeUnit) {
                        valueTimeUnitPicker.append($('<option>', {
                            value: timeUnit,
                            text: timeUnit
                        }));
                    }
                    contentDiv.append(valueTimeUnitLabel);
                    contentDiv.append(valueTimeUnitPicker);

                    let probabilityLabel = jQuery('<label/>', {
                        width: "-webkit-fill-available",
                        for: parameterName+'-probability-'+distributionName+'-input-'+idElementsLocal,
                        text: 'Probability'
                    });
        
                    let probabilityInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName+'-probability-'+distributionName+'-input-'+idElementsLocal,
                        placeholder: 'Probability value'
                    });
                    contentDiv.append(probabilityLabel);
                    contentDiv.append(probabilityInput);

                    let trialsLabel = jQuery('<label/>', {
                        for: parameterName+'-trials-'+distributionName+'-input-'+idElementsLocal,
                        text: 'Trials'
                    });
        
                    let trialsInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName+'-trials-'+distributionName+'-input-'+idElementsLocal,
                        placeholder: 'Trials value'
                    });
                    contentDiv.append(trialsLabel);
                    contentDiv.append(trialsInput);
                    break;
                }

                case "UserDistribution": {
                    let distributionName = this.value;
                    distributionName = distributionName.charAt(0).toLowerCase() + distributionName.slice(1);
                    let valueTimeUnitLabel = jQuery('<label/>', {
                        id: parameterName+'-value-'+distributionName+'-input-'+idElementsLocal,
                        text: 'Time Unit',
                        style: "width: 100%"
                    });
        
                    let valueTimeUnitPicker = jQuery('<select/>', {
                        class: 'scenario-picker',
                        id: parameterName+'-value-'+distributionName+'-input-'+idElementsLocal,
                    });
                    
                    for (let timeUnit in TimeUnit) {
                        valueTimeUnitPicker.append($('<option>', {
                            value: timeUnit,
                            text: timeUnit
                        }));
                    }
                    contentDiv.append(valueTimeUnitLabel);
                    contentDiv.append(valueTimeUnitPicker);

                    let discreteBooleanLabel = jQuery('<label/>', {
                        width: "-webkit-fill-available",
                        for: parameterName+'-discrete-userDistribution-input-'+idElementsLocal,
                        text: 'Discrete'
                    });

                    let divBoolean = jQuery('<div/>', {
                        class: "onoffswitch"
                    });

                    // <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="scenarioParametersAttribute-traceOutput-input" checked></input>
                    let booleanCheckBox = jQuery('<input/>', {
                        type: "checkbox",
                        name: "onoffswitch",
                        class: "onoffswitch-checkbox",
                        id: parameterName+'-discrete-userDistribution-input-'+idElementsLocal
                        // checked
                    });
                    divBoolean.append(booleanCheckBox);

                    let spanInner = jQuery('<span/>', {
                        class: "onoffswitch-inner"
                    });
                    
                    let spanSwitch = jQuery('<span/>', {
                        class: "onoffswitch-switch"
                    });

                    let labelOnOffSwitch = jQuery('<label/>', {
                        class: "onoffswitch-label",
                        for: parameterName+'-discrete-userDistribution-input-'+idElementsLocal
                    });
                    labelOnOffSwitch.append(spanInner);
                    labelOnOffSwitch.append(spanSwitch);

                    divBoolean.append(labelOnOffSwitch);
                    
                    // let valueValueInput = jQuery('<input/>', {
                    //     type: 'checkbox',
                    //     class: 'form-control form-control-input',
                    //     id: parameterName+'-value-BooleanParameterValue-input-'+idElementsLocal,
                    //     placeholder: 'Value value'
                    // });
                    contentDiv.append(discreteBooleanLabel);
                    contentDiv.append(divBoolean);

                    //TODO Fare points che è un'array di constant parameters
                    
                    break;
                }

                /**
                 * Sezione constant parameter
                 */
                case "BooleanParameter":{
                    let valueBooleanLabel = jQuery('<label/>', {
                        for: parameterName+'-value-booleanParameterValue-input-'+idElementsLocal,
                        text: 'Value'
                    });

                    let divBoolean = jQuery('<div/>', {
                        class: "onoffswitch"
                    });

                    // <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="scenarioParametersAttribute-traceOutput-input" checked></input>
                    let booleanCheckBox = jQuery('<input/>', {
                        type: "checkbox",
                        name: "onoffswitch",
                        class: "onoffswitch-checkbox",
                        id: parameterName+'-value-booleanParameterValue-input-'+idElementsLocal
                        // checked
                    });
                    divBoolean.append(booleanCheckBox);

                    let spanInner = jQuery('<span/>', {
                        class: "onoffswitch-inner"
                    });
                    
                    let spanSwitch = jQuery('<span/>', {
                        class: "onoffswitch-switch"
                    });

                    let labelOnOffSwitch = jQuery('<label/>', {
                        class: "onoffswitch-label",
                        for: parameterName+'-value-booleanParameterValue-input-'+idElementsLocal
                    });
                    labelOnOffSwitch.append(spanInner);
                    labelOnOffSwitch.append(spanSwitch);

                    divBoolean.append(labelOnOffSwitch);
                    
                    // let valueValueInput = jQuery('<input/>', {
                    //     type: 'checkbox',
                    //     class: 'form-control form-control-input',
                    //     id: parameterName+'-value-BooleanParameterValue-input-'+idElementsLocal,
                    //     placeholder: 'Value value'
                    // });
                    contentDiv.append(valueBooleanLabel);
                    contentDiv.append(divBoolean);
                    break;
                }
                case "StringParameter":{
                    let stringLabel = jQuery('<label/>', {
                        for: parameterName+'-value-stringParameterValue-input-'+idElementsLocal,
                        text: 'Value'
                    });
        
                    let stringInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName+'-value-stringParameterValue-input-'+idElementsLocal,
                        placeholder: 'String value'
                    });
                    contentDiv.append(stringLabel);
                    contentDiv.append(stringInput);
                    break;

                }
                case "DurationParameter":{
                    let durationLabel = jQuery('<label/>', {
                        for: parameterName+'-value-durationParameterValue-input-'+idElementsLocal,
                        text: 'Value'
                    });
        
                    let durationInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName+'-value-durationParameterValue-input-'+idElementsLocal,
                        placeholder: 'Duration value'
                    });
                    contentDiv.append(durationLabel);
                    contentDiv.append(durationInput);
                    break;

                }
                case "DateTimeParameter":{
                    let dateTimeLabel = jQuery('<label/>', {
                        for: parameterName+'-value-dateTimeParameterValue-input-'+idElementsLocal,
                        text: 'Value'
                    });
        
                    let dateTimeInput = jQuery('<input/>', {
                        type: 'datetime-local',
                        class: 'form-control form-control-input',
                        id: parameterName+'-value-dateTimeParameterValue-input-'+idElementsLocal,
                        // placeholder: ' value'
                    });
                    contentDiv.append(dateTimeLabel);
                    contentDiv.append(dateTimeInput);
                    break;
                }
                case "FloatingParameter":{
                    let floatingLabel = jQuery('<label/>', {
                        for: parameterName+'-value-floatingParameterValue-input-'+idElementsLocal,
                        text: 'Value'
                    });
        
                    let floatingInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName+'-value-floatingParameterValue-input-'+idElementsLocal,
                        placeholder: 'Float value'
                    });
                    contentDiv.append(floatingLabel);
                    contentDiv.append(floatingInput);

                    let floatingTimeUnitLabel = jQuery('<label/>', {
                        for: 'value-floatingParameterTimeUnit-picker-'+idElementsLocal,
                        text: 'Time Unit',
                        style: "width: 100%"
                    });
        
                    let floatingTimeUnitPicker = jQuery('<select/>', {
                        class: 'scenario-picker',
                        id: 'value-floatingParameterTimeUnit-picker-'+idElementsLocal
                    });
                    
                    for (let timeUnit in TimeUnit) {
                        floatingTimeUnitPicker.append($('<option>', {
                            value: timeUnit,
                            text: timeUnit
                        }));
                    }

                    contentDiv.append(floatingTimeUnitLabel);
                    contentDiv.append(floatingTimeUnitPicker);
                    break;
                }
                case "NumericParameter":{
                    let numericLabel = jQuery('<label/>', {
                        for: parameterName+'-value-numericParameterValue-input-'+idElementsLocal,
                        text: 'Value'
                    });
        
                    let numericInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName+'-value-numericParameterValue-input-'+idElementsLocal,
                        placeholder: 'Int value'
                    });
                    contentDiv.append(numericLabel);
                    contentDiv.append(numericInput);

                    let numericTimeUnitLabel = jQuery('<label/>', {
                        for: 'value-numericParameterTimeUnit-picker-'+idElementsLocal,
                        text: 'Time Unit',
                        style: "width: 100%"
                    });
        
                    let numericTimeUnitPicker = jQuery('<select/>', {
                        class: 'scenario-picker',
                        id: 'value-numericParameterTimeUnit-picker-'+idElementsLocal
                    });
                    
                    for (let timeUnit in TimeUnit) {
                        numericTimeUnitPicker.append($('<option>', {
                            value: timeUnit,
                            text: timeUnit
                        }));
                    }

                    contentDiv.append(numericTimeUnitLabel);
                    contentDiv.append(numericTimeUnitPicker);
                    break;
                }
            }      
        });

        let valueContentDiv = jQuery('<div/>', {
            id: parameterName+"-value-content-div-"+parameterValueDivCounterGlobal
        });

        let btnTrash = jQuery('<button/>', {
            class: 'btn btn-primary btn-lg button-calculate btn-icon',
            type: 'button',
            id: 'btn-deleteParameter-'+parameterName+'-value-'+parameterValueDivCounterGlobal

        });

        let iElforTrash = jQuery('<i/>', {
            class: 'fa fa-trash',
            id: 'btn-deleteParameter-'+parameterName+'-value-'+parameterValueDivCounterGlobal
        });

        btnTrash.append(iElforTrash);

        let idLocal = parameterValueDivCounterGlobal;

        btnTrash.on('click', function(){
            $('div[id*='+parameterName+'-value-div-'+idLocal+']').remove();
        });

        valueDiv.append(parameterValuePicker);
        valueDiv.append(btnTrash);
        valueDiv.append(valueContentDiv);

        valuesSection.append(valueDiv);
    });

    parameter.append(valueLabel); 
    parameter.append(btnAdd);

    let valuesSection = jQuery('<div/>',{
        id: parameterName+'-values-section'
    });

    parameter.append(valuesSection);

    if(!parameterName.match(/property/g)){
        let resultRequestLabel = jQuery('<label/>', {
            style: 'width: 100%',
            text: 'Result Request',
            id: parameterName+'-label-resultRequest-picker-'+parameterValueDivCounterGlobal
        });

        let resultRequestPicker = jQuery('<select/>', {
            class: 'scenario-picker',
            id: parameterName+'-resultRequest-picker-'+parameterValueDivCounterGlobal
        });
        
        for (let resultType in ResultType) {
            resultRequestPicker.append($('<option>', {
                value: resultType,
                text: resultType
            }));
        }

        parameter.append(resultRequestLabel);
        parameter.append(resultRequestPicker);
    }
}

function saveLocalCalendars() {
    dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].calendar = calendarsCreatedGlobal;
    calendarsCreatedGlobal = [];
    calendarsCreatedIDCounterGlobal = 0;
}

// * Funzione che chiude tutti i bottoni se aperti al cambio di scenario
function closeCollapsibleButton() {
    //TODO inserire tuttoin una funzione
    if ($("#elem-par-btn").data('clicked') == true) {
        //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
        $("#elem-par-btn").click();
    }
    if ($("#button-activities").data('clicked') == true) {
        //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
        $("#button-activities").click();
    }
    if ($("#button-gateways").data('clicked') == true) {
        //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
        $("#button-gateways").click();
    }
    if ($("#button-events").data('clicked') == true) {
        //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
        $("#button-events").click();
    }
    if ($("#button-connectingObjects").data('clicked') == true) {
        //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
        $("#button-connectingObjects").click();
    }
    if ($("#scen-par-btn").data('clicked') == true) {
        //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
        $("#scen-par-btn").click();
    }
    if ($("#calendar-btn").data('clicked') == true) {
        //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
        $("#calendar-btn").click();
    }
}

// * Funzione di supporto per settare i valori nel form se presenti, altrimenti viene messo undefined 
function setField(inputElement, valueToSet) {
    if (valueToSet != undefined) {
        inputElement.val(valueToSet);
    } else {
        inputElement.val(undefined);
    }
}

// * Funzione che aggiorna i campi in base allo scenario selezionato
function refreshFormFields(scenarios, scenarioSelected) {
    populateScenarioAttributesForm(scenarios, scenarioSelected); //popoliamo il form con gli attributi bpsim di scenario
    populateScenarioElementsForm(scenarios, scenarioSelected); //popoliamo il form con gli elementi bpsim di scenario

}


// * Funzione di supporto per popolare gli attributi di Scenario
function populateScenarioAttributesForm(scenarios, scenarioSelected) {

    //TODO gestire caso in cui si debba creare bspim da zero
    if (scenarioSelected != "") {

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
        

    } else {
        //TODO valutare se settare defaults e considerare aggiunta scenario
    }
}

// * Funzione di supporto per popolare gli attributi di Scenario
function populateScenarioElementsForm(scenarios, scenarioSelected) {
    console.log("scenario numero " + scenarioSelected);
    if (scenarioSelected != "") {
        scenarioSelected -= 1;
        populateElementParametersForm(scenarios[scenarioSelected].elementParameters);
        populateScenarioParametersForm(scenarios[scenarioSelected].scenarioParameters);
        populateCalendarForm(scenarios[scenarioSelected].calendar);

    } else {
        //TODO gestire caso in cui si debba creare bspim da zero
    }
}

function populateElementParametersForm(elementParameters) {
    
    // console.log($("input[id*='$$']"));
    let fields = $("input[id*='$$']");
    
    for(let i = 0; i< fields.length; i++){
        let elRefTot = fields[i].id.split("$$")[1];
        let contained=false;
        for (let i = 0; i < elementParameters.length; i++) {
            if(elRefTot == elementParameters[i].elRef){
                contained=true
                let idElementVal = elementParameters[i].id;
                setField($(fields[i]), idElementVal);
            }
            //TODO viene fatto solo per l'id, continuare
        }
        if(!contained){
            setField($(fields[i]), undefined);

        }
    }
    
}

function populateScenarioParametersForm(scenarioParameters) {
    //TODO start, duration, warmup non sappiamo cosa farne perché sono Parameters

    // let startScenParInput = $('#scenarioParameters-start-input');
    // let startScenParVal = scenarioParameters.start;
    // setField(startScenParInput, startScenParVal);

    // let durationScenParInput = $('#scenarioParameters-duration-input');
    // let durationScenParVal = scenarioParameters.duration;
    // setField(durationScenParInput, durationScenParVal);

    // let warmupScenParInput = $('#scenarioParameters-warmup-input');
    // let warmupScenParVal = scenarioParameters.warmup;
    // setField(warmupScenParInput, warmupScenParVal);

    let replicationScenParInput = $('#scenarioParametersAttribute-replication-input');
    let replicationScenParVal = scenarioParameters.replication;
    setField(replicationScenParInput, replicationScenParVal);

    let seedScenParInput = $('#scenarioParametersAttribute-seed-input');
    let seedScenParVal = scenarioParameters.seed;
    setField(seedScenParInput, seedScenParVal);

    let baseTimeUnitScenParInput = $('#scenarioParameters-baseTimeUnit-picker');
    let baseTimeUnitScenParVal = scenarioParameters.baseTimeUnit;
    for (let timeUnit in TimeUnit) {
        if (TimeUnit[timeUnit] == baseTimeUnitScenParVal) {
            setField(baseTimeUnitScenParInput, timeUnit);
        }
    }

    let baseCurrencyUnitScenParInput = $('#scenarioParametersAttribute-baseCurrencyUnit-input');
    let baseCurrencyUnitScenParVal = scenarioParameters.baseCurrencyUnit;
    setField(baseCurrencyUnitScenParInput, baseCurrencyUnitScenParVal);

    //TODO vedere se fare controlli qui
    let baseResultFrequencyScenParInput = $('#scenarioParameters-baseResultFrequency-input');
    let baseResultFrequencyScenParVal = scenarioParameters.baseResultFrequency;
    setField(baseResultFrequencyScenParInput, baseResultFrequencyScenParVal);

    let baseResultFrequencyCumulScenParInput = $('#scenarioParametersAttribute-baseResultFrequencyCumul-input');
    let baseResultFrequencyCumulScenParVal = scenarioParameters.baseResultFrequencyCumul;
    if (baseResultFrequencyCumulScenParVal == "true") {
        baseResultFrequencyCumulScenParInput.prop('checked', true);
    } else {
        baseResultFrequencyCumulScenParInput.prop('checked', false);
    }

    let traceOutputScenParInput = $('#scenarioParametersAttribute-traceOutput-input');
    let traceOutputScenParVal = scenarioParameters.traceOutput;
    if (traceOutputScenParVal == "true") {
        traceOutputScenParInput.prop('checked', true);
    } else {
        traceOutputScenParInput.prop('checked', false);
    }

    let traceFormatScenParInput = $('#scenarioParametersAttribute-traceFormat-input');
    let traceFormatScenParVal = scenarioParameters.traceFormat;
    setField(traceFormatScenParInput, traceFormatScenParVal);

    //TODO fare PropertyParameter
}

function populateCalendarForm(calendars) {

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


    // * for per creare gli elementi html dei calendar esistenti o quantomeno salvati
    for (let i = 0; i < calendars.length; i++) {
        //per ogni calendar esistente si crea l'oggetto html 
        let calId = calendars[i].id;
        let calName = calendars[i].name;
        let calCalendar = calendars[i].calendar;


        let divCalendarSection = jQuery('<div/>', {
            id: calId
            // style: 'display: inline-flex'
        });

        let labelCalID = jQuery('<label/>', {
            text: 'Calendar ID',
            style: 'margin-top:10%; margin-right: 20%; white-space: nowrap',
        });

        let inputCalID = jQuery('<input/>', {
            type: 'text',
            class: 'form-control form-control-input',
            id: 'calendar-' + calId + '-id-input',
            val: calId
        });

        inputCalID.on('change', function () {
            saveCalendarField(this, false);
        });


        let btnTrash = jQuery('<button/>', {
            class: 'btn btn-primary btn-lg button-calculate btn-icon',
            type: 'button',
            id: 'btn-delete-calendar' + calId

        });

        let iEl = jQuery('<i/>', {
            class: 'fa fa-trash',
            id: 'icon-btn-delete-calendar' + calId
        });

        btnTrash.append(iEl);

        btnTrash.on('click', function () {
            let positionToEliminate = 0;
            for (let i = 0; i < calendars.length; i++) {
                if (calendars[i].id == calId) {
                    positionToEliminate = i;
                }
            }
            dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].calendar.splice(positionToEliminate, 1);
            $(document.getElementById(calId)).remove();
            idListGlobal.splice(idListGlobal.indexOf(calId),1);
        });

        let div = jQuery('<div/>', {
            style: 'display: inline-flex'
        });

        div.append(labelCalID);
        div.append(btnTrash);

        divCalendarSection.append(div);


        // htmlCalendarSection.append(labelCalID);
        divCalendarSection.append(inputCalID);


        let labelCalName = jQuery('<label/>', {
            // for: 'events'+(counter+1)+'-id-input',
            text: 'Calendar Name'
        });

        let inputCalName = jQuery('<input/>', {
            type: 'text',
            class: 'form-control form-control-input',
            id: 'calendar-' + calId + '-name-input',
            val: calName
        });
        inputCalName.on('input', function () {
            saveCalendarField(this, false);
        });
        divCalendarSection.append(labelCalName);
        divCalendarSection.append(inputCalName);


        let labelCalCalendar = jQuery('<label/>', {
            // for: 'events'+(counter+1)+'-id-input',
            text: 'Calendar Content'
        });

        let inputCalCalendar = jQuery('<textarea/>', {
            type: 'text',
            class: 'form-control form-control-input',
            id: 'calendar-' + calId + '-calendar-input',
            val: calCalendar
        });
        inputCalCalendar.on('input', function () {
            saveCalendarField(this, false);
        });
        divCalendarSection.append(labelCalCalendar);
        divCalendarSection.append(inputCalCalendar);
        htmlCalendarSection.append(divCalendarSection);
    }



    buttonCreateCalendar.on("click", function () {
        let calendarTemp = new Calendar();

        let newCalId = "";
        while( newCalId == "" || idListGlobal.includes(newCalId)){
            if(newCalId == ""){
                newCalId = prompt("Insert Calendar ID (It can not be empty):");
            }else if( idListGlobal.includes(newCalId) ){
                newCalId = prompt("ID: "+newCalId+" is not availaible. Insert a new Calendar ID:");
            }
        } 
        if(newCalId != null){
            idListGlobal.push(newCalId);

            let divCalendarSection = jQuery('<div/>', {
                id: newCalId
                // style: 'display: inline-flex'
            });

            let calendarSection = $('#calendar-section');
            let labelCalID = jQuery('<label/>', {
                text: 'Calendar ID',
                style: 'margin-top:10%; margin-right: 20%; white-space: nowrap'
            });
            let inputCalID = jQuery('<input/>', {
                type: 'text',
                class: 'form-control form-control-input',
                id: 'calendar-'+newCalId+'-id-input',
                value: newCalId
            });
            inputCalID.on('change', function () {
                saveCalendarField(this, true);
            });

            let btnTrash = jQuery('<button/>', {
                class: 'btn btn-primary btn-lg button-calculate btn-icon',
                type: 'button',
                id: 'btn-delete-calendar-'+newCalId

            });

            let iEl = jQuery('<i/>', {
                class: 'fa fa-trash',
                id: 'icon-btn-delete-calendar-'+newCalId
            });

            btnTrash.append(iEl);

            let div = jQuery('<div/>', {
                style: 'display: inline-flex'
            });

            div.append(labelCalID);
            div.append(btnTrash);

            btnTrash.on('click', function () {
                let positionToEliminate = 0;
                for (let i = 0; i < calendarsCreatedGlobal.length; i++) {
                    if (calendarsCreatedGlobal[i].id == newCalId) {
                        positionToEliminate = i;
                    }
                }
                calendarsCreatedGlobal.splice(positionToEliminate, 1);
                $(document.getElementById(newCalId)).remove();
                calendarsCreatedIDCounterGlobal -= 1;
                idListGlobal.splice(idListGlobal.indexOf(newCalId),1);
            });

            divCalendarSection.append(div);

            // calendarSection.append(inputCalID);
            divCalendarSection.append(inputCalID);

            let labelCalName = jQuery('<label/>', {
                text: 'Calendar Name'
            });
            let inputCalName = jQuery('<input/>', {
                type: 'text',
                class: 'form-control form-control-input',
                id: 'calendar-'+ newCalId + '-name-input',
                placeholder: "Calendar name"
            });
            inputCalName.on('input', function () {
                saveCalendarField(this, true);
            });
            divCalendarSection.append(labelCalName);
            divCalendarSection.append(inputCalName);

            let labelCalCalendar = jQuery('<label/>', {
                text: 'Calendar Content'
            });

            let inputCalCalendar = jQuery('<textarea/>', {
                type: 'text',
                class: 'form-control form-control-input',
                id: 'calendar-'+ newCalId + '-calendar-input',
                placeholder: "Calendar content"
            });
            inputCalCalendar.on('input', function () {
                saveCalendarField(this, true);
            });
            divCalendarSection.append(labelCalCalendar);
            divCalendarSection.append(inputCalCalendar);
            calendarSection.append(divCalendarSection);

            // * si aggiorna la dimensione massima del della sezione calendar
            // refreshDimension($('#calendar-btn')[0], true);

            //focus sull'id del nuovo calendar creato
            focusDelayed(inputCalID);

            calendarTemp.id = inputCalID.val();
            calendarTemp.name = inputCalName.val();
            calendarTemp.calendar = inputCalCalendar.val();

            calendarsCreatedGlobal.push(calendarTemp);
            calendarsCreatedIDCounterGlobal += 1;
        }
    });

}

//* salva nella struttura dati il singolo attributo di scenario cambiato
function saveScenarioAtrribute(field) {
    let value = field.value;
    let fieldName = field.id.split("-")[1];

    //cambia l'id nel picker in automatico se l'utente sta modificando l'id dello scenario (solo se id nuovo != id esistenti)
    let validName = true;
    if (fieldName == "id") {
        // let options = document.getElementById("scenario-picker").options;
        for (let i = 0; i < idListGlobal.length; i++) {
            if (idListGlobal[i] == value) {
                setTimeout(function () {
                    window.alert("ERROR: There exists a scenario/calendar/element with the following ID: " + value)
                }, 10);
                validName = false;
                console.log(dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].id);
                $('#scenario-id-input').val(dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].id); //reset scenario id
            }
        }
    }

    let inheritsOk = false;
    if (fieldName == "inherits"){
        validName = false; //per far funzionare l'if di sotto
        for(let i=0; i<dataTreeObjGlobal.scenario.length; i++){
            // console.log("scenario "+dataTreeObjGlobal.scenario[i].id );
            // console.log("inherits " + dataTreeObjGlobal.scenario[i].inherits );
            if(dataTreeObjGlobal.scenario[i].id == value && dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].id != value){
                inheritsOk = true;
            }
        }
        if(!inheritsOk){
            if(dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].id == value){
                setTimeout(function () {
                    window.alert("ERROR: You can not inherit from the same scenario " + value);
                }, 10);
            }else{
                setTimeout(function () {
                    window.alert("ERROR: No scenario with the following ID: " + value);
                }, 10);
            }
            $('#scenario-inherits-input').val(dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].inherits);
        }
    }

    if (validName || inheritsOk) {
        let oldValue = dataTreeObjGlobal.scenario[currentScenarioGlobal - 1][fieldName];
        for (let i = 0; i < idListGlobal.length; i++) {
            if (idListGlobal[i] == oldValue) {
                idListGlobal[i] = value;
            }
        }
        dataTreeObjGlobal.scenario[currentScenarioGlobal - 1][fieldName] = value;
        if (fieldName == "id") {
            document.getElementById("scenario-picker").options[currentScenarioGlobal - 1].innerHTML = value;
        }
    }


}

function saveScenarioParameterAtrribute(field) {
    let value = field.value;
    let fieldName = field.id.split("-")[1];
    if (field.type == "checkbox") {
        //salvo il cambimento della checkbox
        if (dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].scenarioParameters[fieldName] == "true") {
            dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].scenarioParameters[fieldName] = "false";
        } else {
            dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].scenarioParameters[fieldName] = "true";
        }
    } else {
        let notNumber=false;
        if(fieldName == "replication" || fieldName == "seed"){
            if(!value.match(/^\d+$/)){//Number.isNaN(parseInt(value,10))){
                setTimeout(function () {
                    window.alert("ERROR: You must insert an int value in replications");
                }, 10);
                if(fieldName == "replication"){
                    $('#scenarioParametersAttribute-replication-input').val(dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].scenarioParameters.replication);
                }
                if(fieldName == "seed"){
                    $('#scenarioParametersAttribute-seed-input').val(dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].scenarioParameters.seed);
                }
                notNumber = true;
            }else{
                value = parseInt(value,10);
            }
        }
        if (value == "") {
            value = undefined;
        }
        if(! notNumber){
            dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].scenarioParameters[fieldName] = value;
        }
        
    }
    
}

// * salva nella struttura dati il singolo element parameter oppure crea l'oggetto
function saveOrCreateSingleFieldInElementParameters(field) {
    let value = field.value;
    //prendo la ref che so essere circondata da doppio $
    let elRef = field.id.split("$$")[1];
    //della prima parte mi prendo il secondo elemento che indica il campo da modificare
    let fieldName = field.id.split("$$")[0].split("-")[1];

    let elementParameters = dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].elementParameters;
    let found = false;
    let validName = true;

    // evito id uguali negli elem param
    for (let i = 0; i < idListGlobal.length; i++) {
        if (idListGlobal[i] == value) {
            setTimeout(function () {
                window.alert("ERROR: There exists a scenario/calendar/element with the following ID: " + value)
            }, 10);
            validName = false;
            // $(document.getElementById(field.id)).val(undefined); //TODO reset value in input (o undefined o vecchio valore)
        }
    }

    if (validName) {
        for (let i = 0; i < elementParameters.length; i++) {
            if (elementParameters[i].elementRef == elRef) {
                found = true;
                let oldValue = elementParameters[i][fieldName];
                elementParameters[i][fieldName] = value;
                if (oldValue == undefined) {
                    idListGlobal.push(value);
                } else {
                    for (let j = 0; j < idListGlobal.length; j++) {
                        if (idListGlobal[j] == oldValue) {
                            idListGlobal[j] = value;
                        }
                    }
                }
            }
        }
        if (!found) {
            let elementParametersToAdd = [];
            let elemPar = new ElementParameters();
            elemPar[fieldName] = value;
            elemPar.elementRef = elRef;
            elementParametersToAdd.push(elemPar);
            dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].elementParameters = elementParametersToAdd;
            idListGlobal.push(value);
        }

    } else {
        let found = false;
        for (let i = 0; i < elementParameters.length; i++) {
            if (elementParameters[i].elementRef == elRef) {
                found = true;
                let oldValue = elementParameters[i][fieldName];
                console.log(oldValue);
                $(document.getElementById(field.id)).val(oldValue); //TODO reset value in input (o undefined o vecchio valore)
            }
        }
        if (!found) {
            $(document.getElementById(field.id)).val(undefined); //TODO reset value in input (o undefined o vecchio valore)
        }
    }
    console.log(idListGlobal); //TODO REMOVE
}

//* salva nella struttura dati il singolo calendar già esistente cambiato
function saveCalendarField(field, isNew) {
    let value = field.value;
    let calendarID = field.id.split("-")[1];
    let fieldName = field.id.split("-")[2];

    let calendarsExisting = dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].calendar;
    let calendarsNew = calendarsCreatedGlobal;
    // console.log(calendarsExisting);
    // console.log(calendarsNew);

    let flagIdUsed = false;

    for (let i = 0; i < idListGlobal.length; i++) {
        if (idListGlobal[i] == value) {
            //TODO salviamo il name anche se ID uguale a uno esistente, vedere cosa fare
            for (let j = 0; j < calendarsExisting.length; j++) {
                if (calendarsExisting[j].id == calendarID) {
                    //silly timeout per far apparire l'errore in scrittura sull'input field
                    setTimeout(function () {
                        window.alert("ERROR: There exists a scenario/calendar/element with the following ID: " + value)
                    }, 1);
                    flagIdUsed = true;
                    $('#calendar-' + calendarID + '-id-input').val(calendarsExisting[j][fieldName]); //reset value in iput
                }
            }
        }
    }

    for (let i = 0; i < calendarsNew.length; i++) {
        if (calendarsNew[i].id == calendarID) {
            //TODO salviamo il name anche se ID uguale a uno esistente, vedere cosa fare
            for (let j = 0; j < calendarsNew.length; j++) {
                if (i != j) {
                    if (calendarsNew[j].id == value) {
                        //silly timeout per far apparire l'errore in scrittura sull'input field
                        setTimeout(function () {
                            window.alert("ERROR: There exists a scenario/calendar/element with the following ID: " + value)
                        }, 1);
                        flagIdUsed = true;
                        $('#calendar-' + calendarID + '-id-input').val(calendarsNew[i][fieldName]); //reset value in input
                        return;
                    }
                }
            }
        }
    }

    if (!flagIdUsed) {
        if (isNew) {
            for (let i = 0; i < calendarsNew.length; i++) {
                if (calendarsNew[i].id == calendarID) {
                    calendarsNew[i][fieldName] = value;
                }
            }
        } else {
            console.log("non è new")
            for (let i = 0; i < idListGlobal.length; i++) {
                if (idListGlobal[i] == calendarID) {
                    idListGlobal[i] = value
                }
            }
            for (let i = 0; i < calendarsExisting.length; i++) {
                if (calendarsExisting[i].id == calendarID) {
                    calendarsExisting[i][fieldName] = value;
                }
            }

        }
        if (fieldName == "id") {
            $('#calendar-' + calendarID + '-id-input').attr('id', 'calendar-' + value + '-id-input');
            $('#calendar-' + calendarID + '-name-input').attr('id', 'calendar-' + value + '-name-input');
            $('#calendar-' + calendarID + '-calendar-input').attr('id', 'calendar-' + value + '-calendar-input');
        }
    }

    console.log(idListGlobal);

}

// * funzione che cambia 
function refreshDimension(btn, isCalendar = false) {
    // btn.classList.toggle("active");
    var content = btn.nextElementSibling;
    // var haveInner = content.id.includes("haveInner");
    // var scrollHeightInner = 0;
    // if (haveInner) {
    //     var contentChildren = content.childNodes[0].childNodes;
    //     for (let i = 0; i < contentChildren.length; i++) {
    //         if (i % 2 != 0) {
    //             scrollHeightInner = scrollHeightInner + contentChildren[i].scrollHeight;
    //         }
    //     }
    // }

    //TODO provare con maxHeight unset
    // if (isCalendar) {
    //     content.style.maxHeight = content.scrollHeight + scrollHeightInner + "px";
    // } else {
        if (content.style.maxHeight) {
            // console.log("si")
            content.style.maxHeight = null;
        } else {
            // console.log("no");
            content.style.maxHeight = "unset"
            // content.style.maxHeight = content.scrollHeight + scrollHeightInner + "px";
        }
    // }
}



// * Funziona che salva la struttura dati
function saveDataTreeStructure(scenarioSelected) {
    scenarioSelected -= 1;
    let idScenarioInput = $('#scenario-id-input');
    let idScenarioVal = idScenarioInput.val();

    // TODO salvare tutto
    dataTreeObjGlobal.scenario[scenarioSelected].id = idScenarioVal;
    // console.log(dataTreeObjGlobal.scenario[scenarioSelected].calendars);
    // console.log(dataTreeObjGlobal.scenario[scenarioSelected].calendar);

    // saveCalendar(scenarioSelectedkhtml);

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
            if (node.attributes[j].localName === "validFor") {
                let tempArray = [];
                tempArray.push(node.attributes[j].value);
                nodeObject[node.attributes[j].localName] = tempArray;
            } else {
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
        if (node.localName === "Calendar") {
            nodeObject["calendar"] = node.textContent;
        }
    }

    return nodeObject
}

// * Funzione ricorsiva che popola una struttura dati ad albero in base ai valori degli elementi della simulazione
function buildDataTree(nodo, nodoObject) {

    let numFigli = nodo.childElementCount;
    let nodoFiglio;

    let childNodes = nodo.childNodes;
    let temp = [];
    for (let i = 0; i < childNodes.length; i++) {
        // * togliamo dai figli quelli che hanno campo "#text" poiche sarebbero gli invii dell'XML
        if (childNodes[i].nodeName != '#text') {
            temp.push(childNodes[i]);
        }
    }
    childNodes = temp;

    while (numFigli > 0) {
        let childToPass = childNodes.shift(); // * shift = pop ma fatta in testa
        nodoFiglio = buildDataTree(childToPass, createObj(childToPass));
        let nameAttr = nodoFiglio[0].localName.charAt(0).toLowerCase() + nodoFiglio[0].localName.slice(1);

        // creare un Parameter con value avvalorato correttamente
        if (isParameter(nodoFiglio[0].localName)) {
            let parameterFieldsToDelete = [];
            for (let i = 0; i < Object.keys(nodoFiglio[1]).length; i++) {
                // salvo tutti quei parametri che si sono creati in più ovvero quelli che non iniziano per '_'
                if (Object.keys(nodoFiglio[1])[i].charAt(0) != "_") {
                    let temp = nodoFiglio[1][Object.keys(nodoFiglio[1])[i]];
                    parameterFieldsToDelete.push(temp);
                }
            }
            let tempResultRequest = nodoFiglio[1].resultRequest;
            nodoFiglio[1] = new factory[nodoFiglio[0].localName]();
            nodoFiglio[1].resultRequest = tempResultRequest;
            nodoFiglio[1].value = parameterFieldsToDelete;
            if (isArrayAttribute(nodoFiglio[0].localName)) {
                let tempArray = [];
                tempArray.push(nodoFiglio[1]);
                nodoObject[nameAttr] = tempArray;
            } else {
                nodoObject[nameAttr] = nodoFiglio[1];
            }
        } else {
            if (isArrayAttribute(nodoFiglio[0].localName)) {
                let tempArray = [];
                tempArray.push(nodoFiglio[1]);
                nodoObject[nameAttr] = tempArray;
            } else {
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

function focusDelayed(obj, num = 100) {
    setTimeout(function () {
        obj.focus();
    }, num);
}

// * Funzione di appoggio per scoprire se un campo è di tipo Parameter
function isParameter(field) {
    let fields = ["TriggerCount", "InterTriggerTimer", "Probability", "Condition", "Start", "Warmup", "ElapsedTime",
        "TransferTime", "QueueTime", "WaitTime", "ProcessingTime", "ValidationTime", "ReworkTime", "LagTime",
        "Availability", "Quantity", "Selection", "Role", "Interruptible", "Priority", "QueueLength", "FixedCost",
        "UnitCost", "Duration", "Property"];

    return fields.includes(field);
}

// * Funzione di appoggio che permette di capire se un attributo è di tipo array
function isArrayAttribute(attribute) {
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
            xmlGlobal = xml;
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
    xmlGlobal = bpmn_example7;
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

            if (e.element.type.toLowerCase().includes("task") ||
                e.element.type.toLowerCase().includes("subprocess") ||
                e.element.type.toLowerCase().includes("transaction")||
                e.element.type.toLowerCase().includes("callactivity") ||
                e.element.type.toLowerCase().includes("eventsubprocess")) {
                // * gestione dell'apertura dei bottoni
                if ($("#elem-par-btn").data('clicked') == false) {
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#elem-par-btn").click();
                }

                if ($("#button-activity").data('clicked') == false) {
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#button-activity").click();
                }
            } else if (e.element.type.toLowerCase().includes("gateway")) {
                // * gestione dell'apertura dei bottoni
                if ($("#elem-par-btn").data('clicked') == false) {
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#elem-par-btn").click();
                }
                if ($("#button-gateway").data('clicked') == false) {
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#button-gateway").click();
                }
            } else if (e.element.type.toLowerCase().includes("event")) {
                // * gestione dell'apertura dei bottoni
                if ($("#elem-par-btn").data('clicked') == false) {
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#elem-par-btn").click();
                }
                if ($("#button-event").data('clicked') == false) {
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#button-event").click();
                }
            } else if (e.element.type.toLowerCase().includes("flow")) {
                if ($("#elem-par-btn").data('clicked') == false) {
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#elem-par-btn").click();
                }
                if ($("#button-connectingObjects").data('clicked') == false) {
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#button-connectingObjects").click();
                }
            }

            // * do il focus all'input tag che ha come id l'element ref che ho cliccato


            focusDelayed($("input[id*='$$" + elemRefClicked + "$$']"));
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

});