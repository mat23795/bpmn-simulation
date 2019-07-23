import firstdiagramXML from '../resources/firstDiagram.bpmn';
import bpmn_example1 from '../resources/1_CarRepairProcessV1.bpmn';
import bpmn_example2 from '../resources/2_CarRepairProcessV2.bpmn';
import bpmn_example3 from '../resources/3_LoanProcessV1.bpmn';
import bpmn_example4 from '../resources/4_LoanProcessV2.bpmn';
import bpmn_example5 from '../resources/5_TechnicalSupportProcessV1.bpmn';
import bpmn_example6 from '../resources/6_TechnicalSupportProcessV1_1.bpmn';
import bpmn_example7 from '../resources/7_TechnicalSupportProcessV2.bpmn';

import { DateTime, DurationParameter, DateTimeParameter } from "./types/parameter_type/ConstantParameter";
import { BPSimData } from "./types/scenario/BPSimData";
import { Scenario } from "./types/scenario/Scenario";
import { factory } from "./types/factory";
import { ResultType } from "./types/parameter_type/ResultType";
import { Property } from "./types/parameters/Property";
import { Parameter } from "./types/parameter_type/Parameter";
import { PropertyType } from "./types/parameters/PropertyType";
import { Calendar } from './types/calendar/Calendar';
import { ElementParameters } from './types/parameters/ElementParameters';
import { TimeUnit } from "./types/scenario/TimeUnit";
import { TimeParameters } from "./types/parameters/TimeParameters";
import { ControlParameters } from "./types/parameters/ControlParameters";
import { CostParameters } from "./types/parameters/CostParameters";
import { ResourceParameters } from "./types/parameters/ResourceParameters";
import { PropertyParameters } from "./types/parameters/PropertyParameters";
import { PriorityParameters } from "./types/parameters/PriorityParameters";

import * as vkbeautify from 'vkbeautify';
import { UserDistributionDataPoint } from './types/parameter_type/DistributionParameter';



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
var propertiesCounterGlobal = 0;
var numberOfPointsGlobal = 0;

let nodesActivities = [];
let nodesGateways = [];
let nodesEvents = [];
let nodesConnectingObjects = [];
let nodesResources = [];

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



        $('#generate-bpsim').attr("disabled", false);
        $('#scroll-top-button').attr("disabled", false);
        $('#create-scenario').attr("disabled", false);






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

            if (scaleGlobal > 5.5) {
                scaleGlobal = 5.5;
            } else if (scaleGlobal < 0.5) {
                scaleGlobal = 0.5
            }

            $('.djs-container').css('transform', 'scale(' + scaleGlobal + ') translate(' + (pageXGlobal) + 'px,' + (pageYGlobal) + 'px)');
            // console.log(scaleGlobal)

        });


        let pageX = 0;
        let pageY = 0;
        $('#js-canvas').mousedown(function (event) {
            pageX = event.pageX;
            pageY = event.pageY;
            // console.log("px = " + pageX + " --- py = " + pageY);
            // console.log($('.djs-container').position())
            $('#js-canvas').on('mousemove', function (event) {
                pageXGlobal += event.pageX - pageX
                pageYGlobal += event.pageY - pageY
                //     // console.log("diffx = "+(pageXGlobal) + " -------- diffy = " + pageYGlobal);
                $('.djs-container').css('transform', 'scale(' + scaleGlobal + ') translate(' + (pageXGlobal) + 'px,' + (pageYGlobal) + 'px)');
                pageX = event.pageX;
                pageY = event.pageY;

            });
        });

        $('#js-canvas').mouseup(function (event) {
            $('#js-canvas').off('mousemove');
        });




        // $('.djs-container').css('height', '700px');

        // xmlGlobal=xml;




        $('#scroll-top-button').on('click', function () {
            $('#js-simulation').scrollTop(0);
        });

        // * aggiunta evento al bottone che calcola il bpsim per far generare l'xml 'aggiornato'
        $('#generate-bpsim').on("click", function () {

            saveCurrentScenarioComplexElement(dataTreeObjGlobal.scenario[currentScenarioGlobal - 1]);

            // TODO inizio commento da togliere
            let scenarioSelected = $('#scenario-picker').val();

            console.log("fare anche qui la questione del salvataggio dei complex")//TODO 

            //salvo i calendari 
            saveLocalCalendars();
            // console.log()
            //TODO vedere salvataggio nuovi calendar 
            // lo facciamo in questo punto per farsi che i calendar nuovi diventino vecchi
            populateCalendarForm(dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].calendar);
            // dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].calendar = calendarsCreatedGlobal;
            // calendarsCreatedGlobal = [];
            // calendarsCreatedIDCounterGlobal = 0;

            //saveDataTreeStructure(scenarioSelected);

            while (extensionElementXML[0].firstChild) {
                extensionElementXML[0].removeChild(extensionElementXML[0].firstChild);
            }
            extensionElementXML[0].appendChild(dataTreeObjGlobal.toXMLelement(bpsimPrefixGlobal, bpsimNamespaceURI));

            console.log("XML fase modifica");//TODO remove
            console.log(xmlDoc);//TODO remove
            console.log(extensionElementXML[0].lastChild); //printa il nuovo bpsimdata
            console.log(dataTreeObjGlobal)

            //TODO commentare o scommentare se si vuole salvare o no il file
            download("bpmn-simulation.bpmn", vkbeautify.xml(new XMLSerializer().serializeToString(xmlDoc)));
        });

        // * aggiunta evento al bottone che elimina lo scenario corrente
        $('#delete-scenario').on("click", function () {
            closeCollapsibleButton();

            let scenarioDeleted = dataTreeObjGlobal.scenario.splice(currentScenarioGlobal - 1, 1);

            //rimozione degli id da idglobal perché lo scenario viene eliminato
            idListGlobal.splice(idListGlobal.indexOf(scenarioDeleted[0].id), 1);

            scenarioDeleted[0].calendar.forEach(function (cal) {
                idListGlobal.splice(idListGlobal.indexOf(cal.id), 1);
            });

            scenarioDeleted[0].elementParameters.forEach(function (el) {
                if (el.id != undefined) {
                    idListGlobal.splice(idListGlobal.indexOf(el.id), 1);
                }
            });

            // console.log("lista");
            // console.log(idListGlobal); //TODO REMOVE
            // console.log(dataTreeObjGlobal.scenario);

            resetParameterDivs();


            if (dataTreeObjGlobal.scenario.length > 0) {
                createFormFields(false); //false = evitare doppio toggle active per bottoni creati in precedenza
            } else {
                idListGlobal = [];
                $('#scenario-displayed').hide();
                $('#scenario-picker').empty();
                $('#delete-scenario').attr("disabled", true);
                $('#generate-bpsim').attr("disabled", true);
            }


            // $('#js-simulation').scrollTop(0);
        });

        // * aggiunta evento al bottone che crea un nuovo scenario
        $('#create-scenario').on("click", function () {

            // closeCollapsibleButton();

            // new
            // saveCurrentScenarioComplexElement(dataTreeObjGlobal.scenario[currentScenarioGlobal - 1]);
            // saveLocalCalendars();
            // fine new


            let newScenario = new Scenario();

            let name = "";
            while (name == "" || idListGlobal.includes(name)) {
                if (name == "") {
                    name = prompt("Insert Scenario ID (It can not be empty):");
                } else if (idListGlobal.includes(name)) {
                    name = prompt("ID: " + name + " is not availaible. Insert a new ID:");
                }
            }
            if (name != null) {
                $('#delete-scenario').attr("disabled", false);
                $('#generate-bpsim').attr("disabled", false);
                $('#scenario-displayed').show();

                newScenario.id = name;
                let tempArrayScenario = [];
                tempArrayScenario.push(newScenario);
                dataTreeObjGlobal.scenario = tempArrayScenario;
                idListGlobal.push(name);

                console.log("idListGlobal")
                console.log(idListGlobal)


                $('#scenario-picker').append($('<option>', {
                    value: dataTreeObjGlobal.scenario.length,
                    text: dataTreeObjGlobal.scenario[dataTreeObjGlobal.scenario.length - 1].id
                }));



                // console.log("prima change")
                // currentScenarioGlobal = dataTreeObjGlobal.scenario.length
                $('#scenario-picker').val(dataTreeObjGlobal.scenario.length).trigger('change');
                // console.log("dopo change")

                resetParameterDivs();

            }
        });


        // * rimozione commenti dal xml perché creano problemi con il parsing
        const regExpRemoveComments = /(\<!--.*?\-->)/g;

        // console.log(xmlGlobal);
        xmlGlobal = xmlGlobal.replace(regExpRemoveComments, "");
        // console.log(xmlGlobal);

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

            definitionsTagXML[0].setAttribute("xmlns:bpsim","http://www.bpsim.org/schemas/1.0");

            let bpsimData = new BPSimData();
            let scenario = new Scenario();
            scenario.id = "new Scenario";
            bpsimData.addScenario(scenario);
            dataTreeObjGlobal = bpsimData;

            let bpsimDataXMLelement = dataTreeObjGlobal.toXMLelement(bpsimPrefixGlobal, bpsimNamespaceURI)

            let extensionElementXMLtemp = xmlDoc.createElementNS(bpmnNamespaceURI, bpmnPrefixGlobal+":extensionElements");
            extensionElementXMLtemp.appendChild(bpsimDataXMLelement)

            let sourceXMLelement = xmlDoc.createElementNS(bpmnNamespaceURI, bpmnPrefixGlobal+":source");
            sourceXMLelement.textContent = definitionsTagXML[0].id;

            let targetXMLelement = xmlDoc.createElementNS(bpmnNamespaceURI, bpmnPrefixGlobal+":target");
            targetXMLelement.textContent = definitionsTagXML[0].id;


            let relationshipXMLelement = xmlDoc.createElementNS(bpmnNamespaceURI, bpmnPrefixGlobal+":relationship");
            relationshipXMLelement.setAttribute("type", "BPSimData");
            relationshipXMLelement.appendChild(extensionElementXMLtemp);
            relationshipXMLelement.appendChild(sourceXMLelement);
            relationshipXMLelement.appendChild(targetXMLelement);

            definitionsTagXML[0].appendChild(relationshipXMLelement)


            extensionElementXML = definitionsTagXML[0].children[definitionsTagXML[0].children.length - 1].children;


            dataTreeGlobal = xml2tree(extensionElementXML[0]);
            dataTreeObjGlobal = dataTreeGlobal[1];

            console.log("obj finale post parsing");
            console.log(xmlDoc)
            console.log(dataTreeObjGlobal);



            // let extensionElementXMLCreated = Object.create(HTMLCollection.prototype);
            // extensionElementXMLCreated.push(extensionElementXMLtemp);
            // console.log("quello creato ad hoc")
            // console.log(extensionElementXMLCreated)

            // dataTreeGlobal = xml2tree();
            // dataTreeObjGlobal = dataTreeGlobal[1];


            // console.log(xmlDoc)

            // createFormFields();
            // $('#scenario-displayed').hide();
            // $('#scenario-picker').empty();
            // $('#delete-scenario').attr("disabled", true);
            createFormFields();
            $('#delete-scenario').click();

        } else {
            $('#scenario-displayed').show();
            $('#delete-scenario').attr("disabled", false);

            // * Fase 1 xml2tree
            bpsimPrefixGlobal = extensionElementXML[0].childNodes[1].prefix;

            // * Leggere bpsim e inserirlo nella struttura dati
            dataTreeGlobal = xml2tree(extensionElementXML[0]);
            dataTreeObjGlobal = dataTreeGlobal[1];

            console.log("obj finale post parsing");
            console.log(dataTreeObjGlobal);

            // * popoliamo la lista di id globali perché ogni id deve essere univoco
            populateIdList();

            // * creare dal XML il form field
            createFormFields();

            // lo visualizzo

            // lo modifico

            // lo salvo

            console.log("XML fase ricopiamento");//TODO remove

            while (extensionElementXML[0].firstChild) {
                extensionElementXML[0].removeChild(extensionElementXML[0].firstChild);
            }
            // aggiunta elemento
            console.log("bpsimPrefixGlobal")
            console.log(bpsimPrefixGlobal)
            extensionElementXML[0].appendChild(dataTreeObjGlobal.toXMLelement(bpsimPrefixGlobal, bpsimNamespaceURI));

            console.log(xmlDoc);//TODO remove
        }
    });
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function resetParameterDivs() {
    let properties = $("div[id*=scenarioParameters-property]");
    for (let i = 0; i < properties.length; i++) {
        if (/\d/g.test(properties[i].id)) {
            properties[i].remove();
        }
    }

    let parameters = $("div[id^=div-parameter]");
    for (let i = 0; i < parameters.length; i++) {
        parameters[i].remove();
    }

    $("div[id^=start-value-div").remove();
    $("div[id^=duration-value-div").remove();
    $("div[id^=warmup-value-div").remove();
    $("div[id^=queueLength-value-div").remove();

    parameterValueDivCounterGlobal = 0;
    elementParameterCounterGlobal = 0;
    propertiesCounterGlobal = 0;
    numberOfPointsGlobal = 0;
    nodesActivities = [];
    nodesGateways = [];
    nodesEvents = [];
    nodesConnectingObjects = [];
    nodesResources = [];
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




    for (let i = 0; i < bpmnElementProcessXML.length; i++) {

        // * array di tutti gli elementi presenti in "process"
        let nodesProcess = Array.prototype.slice.call(bpmnElementProcessXML[i].getElementsByTagName("*"), 0);

        // console.log("Array di elementi del bpmn"); //TODO REMOVE
        // console.log(nodes); //TODO REMOVE

        // * avvaloramento variabile che contiene solo i task
        for (let j = 0; j < nodesProcess.length; j++) {
            if (nodesProcess[j].localName.toLowerCase().includes("task") ||
                nodesProcess[j].localName.toLowerCase().includes("subprocess") ||
                nodesProcess[j].localName.toLowerCase().includes("transaction") ||
                nodesProcess[j].localName.toLowerCase().includes("callactivity")) {
                nodesActivities.push(nodesProcess[j]);
            } else if (nodesProcess[j].localName.toLowerCase().includes("gateway")) {
                nodesGateways.push(nodesProcess[j]);
            } else if (nodesProcess[j].localName.toLowerCase().includes("event")
                && !nodesProcess[j].localName.toLowerCase().includes("definition")) {
                nodesEvents.push(nodesProcess[j]);
            } else if (nodesProcess[j].localName.toLowerCase().includes("sequenceflow")) {
                nodesConnectingObjects.push(nodesProcess[j]);
            }
            // console.log(nodes[j].localName);
        }


        // * avvaloramento variabile che contiene solo i gateway
        // for (let j = 0; j < nodesProcess.length; j++) {
        //     if (nodesProcess[j].localName.toLowerCase().includes("gateway")) {

        //         nodesGateways.push(nodesProcess[j]);
        //     }
        //     // console.log(nodes[j].localName);
        // }


        // * avvaloramento variabile che contiene solo gli eventi
        // for (let j = 0; j < nodesProcess.length; j++) {
        //     if (nodesProcess[j].localName.toLowerCase().includes("event")
        //         && !nodesProcess[j].localName.toLowerCase().includes("definition")) {

        //         nodesEvents.push(nodesProcess[j]);
        //     }
        //     // console.log(nodes[j].localName);
        // }


        // * avvaloramento variabile che contiene solo le frecce
        // for (let j = 0; j < nodesProcess.length; j++) {
        //     if (nodesProcess[j].localName.toLowerCase().includes("sequenceflow")) {

        //         nodesConnectingObjects.push(nodesProcess[j]);
        //     }
        //     // console.log(nodesConnectingObjects[j].localName);
        // }


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

    // console.log("Array di sole resources"); //TODO REMOVE
    // console.log(nodesResources); //TODO REMOVE


    setParameter($('#scenarioParameters-start-div'), "scen-par-btn");
    setParameter($('#scenarioParameters-duration-div'), "scen-par-btn");
    setParameter($('#scenarioParameters-warmup-div'), "scen-par-btn");

    let labelInitial = jQuery('<label/>', {
        text: 'Add Property'
    });

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
    btnAddProperty.on('click', function () {
        propertiesCounterGlobal += 1;
        parameterValueDivCounterGlobal += 1;
        //aggiunta div property
        let propertyDiv = jQuery('<div/>', {
            id: 'scenarioParameters-property' + propertiesCounterGlobal + '-div-' + parameterValueDivCounterGlobal,
            style: "border-radius: 10px; border: solid 1px black; padding: 2%",
            tabindex: '1'

        });


        setParameter(propertyDiv, "scen-par-btn");

        let btnTrash = jQuery('<button/>', {
            class: 'btn btn-primary btn-lg button-calculate btn-icon',
            type: 'button',
            id: 'btn-deleteProperty' + propertiesCounterGlobal + '-' + parameterValueDivCounterGlobal

        });

        let iElforTrash = jQuery('<i/>', {
            class: 'fa fa-trash',
            id: 'btn-deleteProperty' + propertiesCounterGlobal + '-' + parameterValueDivCounterGlobal
        });

        btnTrash.append(iElforTrash);

        let idLocalRemoveProperty = parameterValueDivCounterGlobal;
        let localPropertiesCounterGlobal = propertiesCounterGlobal;


        btnTrash.on('click', function () {
            $('div[id*=scenarioParameters-property' + localPropertiesCounterGlobal + '-div-' + idLocalRemoveProperty + ']').remove();
        });

        btnTrash.insertAfter(propertyDiv[0].childNodes[0].childNodes[0]);

        // for(let i in propertyDiv[0].childNodes){
        //     console.log(propertyDiv[0].childNodes[i]);
        //     if(propertyDiv[0].childNodes[i].id == "delete-div-property"+propertiesCounterGlobal+"-"+localPropertiesCounterGlobal){
        //         $('#'+propertyDiv[0].childNodes[i].id).append(btnTrash);
        //     }
        // }

        let labelPropertyName = jQuery('<label/>', {
            for: 'scenarioParameters-property-propertyParameters-name-' + parameterValueDivCounterGlobal,
            text: 'Name',
            width: '100%'
        });

        let inputPropertyName = jQuery('<input/>', {
            type: 'text',
            class: 'form-control form-control-input',
            id: 'scenarioParameters-property-propertyParameters-name-' + parameterValueDivCounterGlobal,
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
            id: 'propertyType-scenarioParameters-picker-' + parameterValueDivCounterGlobal,
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

        $('#scenarioParameters-property-propertyParameters-div').append(propertyDiv);


        if ($('#scen-par-btn').data('clicked') == true) {
            // console.log("sto focussando " + propertyDiv[0].id)
            propertyDiv.focus();
        }



    });
    if (firstTime) {
        $('#scenarioParameters-property-propertyParameters-div').append(labelInitial);
        $('#scenarioParameters-property-propertyParameters-div').append(btnAddProperty);
    }




    setParameter($('#scenarioParameters-queueLength-propertyParameters-div'), "scen-par-btn");
    // rimozione result type non disponibili per queueLength di propertyParameters
    let queueSelect = $('select[id*="queueLength-resultRequest"]');
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
            text: 'ID'
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
            id: 'activity-parameter-div-$$' + elRef + '$$'
        });
        divActivities.append(divActivitiesParameter);

        // setParameter(divActivitiesParameter);
        let elementName = nodesActivities[counter].localName;
        // console.log(elRef + " " + elementName);
        setElementParameter(divActivitiesParameter, "activities", elRef, elementName);

    }

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

        let divLabelsConnecting = jQuery('<div/>', {
            id: 'div-labels-connecting'
        });
        for (let i = 0; i < connectingObj.length; i++) {
            if (connectingObj[i].localName != "incoming") {
                let labelFlowLink = jQuery('<label/>', {
                    // for: 'gateway-id-input$$' + elRef + '$$',
                    style: 'color: blue',
                    text: connectingObj[i].textContent//,
                    // href: '#'+element.id
                });

                labelFlowLink.hover(
                    function () {
                        this.setAttribute('style', 'text-decoration: underline; color: blue; cursor: pointer');
                    }
                    ,
                    function () {
                        this.setAttribute('style', 'text-decoration: none; color: blue; cursor: default');
                    }
                );

                labelFlowLink.on("click", function () {
                    if ($("#button-connectingObjects").data('clicked') == false) {
                        //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                        $("#button-connectingObjects").click();
                    }
                    focusDelayed($("input[id*='$$" + connectingObj[i].textContent + "$$']"));
                });
                divLabelsConnecting.append(labelFlowLink);
            }
        }
        divGateways.append(divLabelsConnecting);


        // console.log(nodesGateways[counter].children); //TODO REMOVE
        let divGatewaysParameter = jQuery('<div/>', {

            id: 'gateway-parameter-div-$$' + elRef + '$$'
        });
        divGateways.append(divGatewaysParameter);

        // setParameter(divActivitiesParameter);
        let elementName = nodesGateways[counter].localName;
        // console.log(elRef + " " + elementName);
        if (elementName == "eventBasedGateway") {
            divGatewaysParameter.attr("style", "border-radius: 10px; border: solid 1px black; padding: 2%")
            setElementParameter(divGatewaysParameter, "gateways", elRef, elementName);
        } else {
            divGatewaysParameter.empty();
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
            id: 'event-parameter-div-$$' + elRef + '$$'
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
        if (nodesConnectingObjects[counter].localName == "sequenceFlow") {
            elRefLink = nodesConnectingObjects[counter].attributes[0].textContent;
        } else {
            elRefLink = nodesConnectingObjects[counter].attributes[2].textContent;
        }
        let labelFlowLink = jQuery('<label/>', {
            // for: 'gateway-id-input$$' + elRef + '$$',
            style: 'color: blue',
            text: elRefLink//,
            // href: '#'+element.id
        });

        labelFlowLink.hover(
            function () {
                this.setAttribute('style', 'text-decoration: underline; color: blue; cursor: pointer');
            }
            ,
            function () {
                this.setAttribute('style', 'text-decoration: none; color: blue; cursor: default');
            }
        );

        labelFlowLink.on("click", function () {
            let divName = $("input[id*='$$" + elRefLink + "$$']")[0].id.split('-')[0];
            if ($("#button-" + divName).data('clicked') == false) {
                //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                $("#button-" + divName).click();
            }
            focusDelayed($("input[id*='$$" + elRefLink + "$$']"));
        });

        divConnectingObjects.append(labelFlowLink);

        let divConnectingObjectsParameter = jQuery('<div/>', {
            style: "border-radius: 10px; border: solid 1px black; padding: 2%",
            id: 'connectingObject-parameter-div-$$' + elRef + '$$'
        });
        divConnectingObjects.append(divConnectingObjectsParameter);

        // setParameter(divActivitiesParameter);
        let elementName = nodesConnectingObjects[counter].localName;
        // console.log(elRef + " " + elementName);
        setElementParameter(divConnectingObjectsParameter, "connectingObjects", elRef, elementName);
    }


    for (let counter = 0; counter < nodesResources.length; counter++) {
        let labelElementRef;
        let elRef = nodesResources[counter].id;
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
                text: 'Element Ref: ' + elRef,
                style: 'margin-top:15%'
            });
        }
        divResources.append(labelElementRef);

        // let idCurrentScenario = dataTreeGlobal.scenario[currentScenarioGlobal-1].id;

        let labelId = jQuery('<label/>', {
            for: 'resource-id-input$$' + elRef + '$$',
            text: 'ID'
        });

        let inputId = jQuery('<input/>', {
            type: 'text',
            class: 'form-control form-control-input',
            id: 'resource-id-input$$' + elRef + '$$',
            placeholder: 'Resource ID'
        });

        // // * settaggio funzione salvataggio singola variabile all'interno della struttura globale
        // // inputId.on('change', function () {
        // //     console.log(2);
        // // });
        // // TODO vedere se usare change o input
        inputId.on('change', function () {
            saveOrCreateSingleFieldInElementParameters(this);
        });


        divResources.append(labelId);
        divResources.append(inputId);

        let divResourcesParameter = jQuery('<div/>', {
            style: "border-radius: 10px; border: solid 1px black; padding: 2%",
            id: 'resource-parameter-div-$$' + elRef + '$$'
        });
        divResources.append(divResourcesParameter);

        // setParameter(divActivitiesParameter);
        let elementName = nodesResources[counter].localName;
        // console.log(elRef + " " + elementName);
        setElementParameter(divResourcesParameter, "resources", elRef, elementName);

    }


    divElementParameter.append(buttonActivities);
    divElementParameter.append(divActivities);
    divElementParameter.append(buttonGateways);
    divElementParameter.append(divGateways);
    divElementParameter.append(buttonEvents);
    divElementParameter.append(divEvents);
    divElementParameter.append(buttonConnectingObjects);
    divElementParameter.append(divConnectingObjects);
    if (nodesResources.length != 0) {
        divElementParameter.append(buttonResources);
        divElementParameter.append(divResources);
    }

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
    // let xmlDoc = parser.parseFromString(undefined, "text/xml");

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
        $('#scenarioParameters-baseTimeUnit-picker').on('change', function () {
            let baseTimeValue = $('#scenarioParameters-baseTimeUnit-picker').val();
            dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].scenarioParameters.baseTimeUnit = TimeUnit[baseTimeValue];
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

    $('#scenario-inherits-picker').empty();
    $('#scenario-inherits-picker').append($('<option>', {
        value: "",
        text: ""
    }));

    for (let i = 0; i < dataTreeObjGlobal.scenario.length; i++) {
        if (i != currentScenarioGlobal - 1) {
            $('#scenario-inherits-picker').append($('<option>', {
                value: dataTreeObjGlobal.scenario[i].id,
                text: dataTreeObjGlobal.scenario[i].id
            }));
        }
    }
    // console.log("createFormFiels inizio")
    updateValidFor();
    refreshFormFields(scenarios, scenarioSelected);

    if (firstTime) {
        $('#scenario-inherits-picker').on('change', function () {
            if (this.value != "") {
                dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].inherits = this.value;
            } else {
                dataTreeGlobal.scenario[currentScenarioGlobal - 1].inherits = undefined;
            }

        });

        $('#scenario-picker').on('change', function () {
            // console.log("cuss ie u valor")
            // console.log(this.value)

            // * serie di if che servono a chiudere i menù a tendina quando si cambia scenario
            closeCollapsibleButton();

            let scenarioSelected = $('#scenario-picker').val();

            saveLocalCalendars();

            saveCurrentScenarioComplexElement(dataTreeObjGlobal.scenario[currentScenarioGlobal - 1]);


            //cambio dom
            currentScenarioGlobal = scenarioSelected;
            resetParameterDivs();


            // console.log("prima refresh")



            $('#scenario-inherits-picker').empty();
            $('#scenario-inherits-picker').append($('<option>', {
                value: "",
                text: ""
            }));

            for (let i = 0; i < dataTreeObjGlobal.scenario.length; i++) {
                if (i != currentScenarioGlobal - 1) {
                    $('#scenario-inherits-picker').append($('<option>', {
                        value: dataTreeObjGlobal.scenario[i].id,
                        text: dataTreeObjGlobal.scenario[i].id
                    }));
                }
            }
            updateValidFor();
            refreshFormFields(dataTreeObjGlobal.scenario, scenarioSelected);

            // console.log("dopo refresh")

            $('#js-simulation').scrollTop(0);

        });
    }



}

function updateValidFor() {
    let validForPickers = $('select[id*=-validFor-');
    // console.log("validFors + length: "+   validForPickers.length);
    // console.log(validForPickers);
    for (let i = 0; i < validForPickers.length; i++) {
        let picker = $('#' + $.escapeSelector(validForPickers[i].id));
        let oldValue = picker.val()
        // console.log("cuss ier u valor")
        // console.log(oldValue)
        // console.log(picker)
        picker.empty();

        picker.append($('<option>', {
            value: "",
            text: ""
        }));


        let calendarExistingTemp = dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].calendar
        for (let j in calendarExistingTemp) {
            picker.append($('<option>', {
                value: calendarExistingTemp[j].id,
                text: calendarExistingTemp[j].id
            }));
        }

        // let calendarExistingTemp = dataTreeObjGlobal.scenario[currentScenarioGlobal-1].calendar
        for (let j in calendarsCreatedGlobal) {
            picker.append($('<option>', {
                value: calendarsCreatedGlobal[j].id,
                text: calendarsCreatedGlobal[j].id
            }));
        }
        picker.val(oldValue);
    }
}

function saveCurrentScenarioComplexElement(scenarioToSave) {
    console.log("INIZIO FASE SALVATAGGIO COMPLEX")
    // let scenarioParameters = scenarioToSave.scenarioParameters;
    // let elementParameters = scenarioToSave.elementParameters;


    saveScenarioParameterComplexParameter(scenarioToSave, "start", $('#scenarioParameters-start-div')[0].childNodes);
    saveScenarioParameterComplexParameter(scenarioToSave, "duration", $('#scenarioParameters-duration-div')[0].childNodes);
    saveScenarioParameterComplexParameter(scenarioToSave, "warmup", $('#scenarioParameters-warmup-div')[0].childNodes);

    // TODO parte Property
    saveScenarioParameterComplexProperty(scenarioToSave, $("#scenarioParameters-propertyParameters-div")[0].childNodes);



    // TODO parte ciclo su elemRef

    let divActivities = $("#div-activities");
    let divGateways = $("#div-gateways");
    let divEvents = $("#div-events");
    let divConnectingObjects = $("#div-connectingObjects");
    let divResources = $("#div-resources");


    // console.log("array di activities");
    // console.log(divActivities)

    saveElementParametersSection(divActivities, scenarioToSave, 4);
    saveElementParametersSection(divGateways, scenarioToSave, 6);
    saveElementParametersSection(divEvents, scenarioToSave, 4);
    saveElementParametersSection(divConnectingObjects, scenarioToSave, 6, false);
    if (divResources.length != 0) {
        saveElementParametersSection(divResources, scenarioToSave, 4);
    }



    // TODO REMOVE
    console.log("nuova struttura");
    console.log(dataTreeObjGlobal)
}


function saveElementParametersSection(div, scenarioToSave, firstCicleIndex, haveResultRequest = true) {
    let divChildNodes = div[0].childNodes;

    for (let i = 0; i < divChildNodes.length; i = i + firstCicleIndex) {
        // console.log("activity iniziale")
        // console.log(divActivitiesChildNodes[i])
        let elementRef = divChildNodes[i].textContent.split("Element Ref: ")[1];
        let esiste = false;
        let posizione;
        for (let j = 0; j < scenarioToSave.elementParameters.length; j++) {
            if (elementRef == scenarioToSave.elementParameters[j].elementRef) {
                esiste = true;
                posizione = j;
            }
        }

        let idValueInput = divChildNodes[i + 2].value;
        let values = [];
        let parameterValuesDivChildNodes = divChildNodes[i + firstCicleIndex - 1].childNodes;


        for (let j = 2; j < parameterValuesDivChildNodes.length; j++) {
            let singleParameterDiv = parameterValuesDivChildNodes[j].childNodes;

            let singleParameterDivChildNodes;
            let valueToAdd;
            if (singleParameterDiv.length > 2) {
                if (singleParameterDiv[2].childNodes.length > 1) {
                    // if (singleParameterDiv[2].childNodes[1].id.includes("availability") || singleParameterDiv[2].childNodes[1].id.includes("quantity")) {
                    //     haveResultRequest = false;
                    // }
                    if (singleParameterDiv[2].childNodes[1].id.includes("property") || singleParameterDiv[2].childNodes[1].id.includes("role")) {

                        for (let k = 2; k < singleParameterDiv[2].childNodes.length; k++) {
                            singleParameterDivChildNodes = singleParameterDiv[2].childNodes[k].childNodes;
                            valueToAdd = getElementParameterObj(singleParameterDivChildNodes, elementRef, j - 2, haveResultRequest);
                            if (valueToAdd != undefined) {
                                values.push(valueToAdd);
                            }
                        }

                    } else {
                        singleParameterDivChildNodes = singleParameterDiv[2].childNodes;
                        valueToAdd = getElementParameterObj(singleParameterDivChildNodes, elementRef, j - 2, haveResultRequest);
                        if (valueToAdd != undefined) {
                            values.push(valueToAdd);
                        }
                    }
                }
            }
        }

        if (idValueInput != "" || values.length > 0) {
            if (esiste) {
                // * esiste e lo devo aggiornare
                scenarioToSave.elementParameters[posizione] = createElemParamObj(values, idValueInput, elementRef);
            } else {
                // * ne creo uno nuovo
                let newElemParam = createElemParamObj(values, idValueInput, elementRef);
                scenarioToSave.elementParameters = [newElemParam];
            }
        } else {
            if (esiste) {
                scenarioToSave.elementParameters.splice(posizione, 1);
            }
        }
    }
}


function createElemParamObj(values, idValueInput, elementRef) {
    let newElemParam = new ElementParameters();

    let timeParameters = new TimeParameters();
    let controlParameters = new ControlParameters();
    let costParameters = new CostParameters();
    let resourceParameters = new ResourceParameters();
    let propertyParameters = new PropertyParameters();
    let priorityParameters = new PriorityParameters();

    if (idValueInput != "") {
        newElemParam.id = idValueInput;
    }
    newElemParam.elementRef = elementRef;

    let flagParameters = [false, false, false, false, false, false];

    for (let j in values) {

        switch (values[j][1]) {
            case "Time Parameters": {
                flagParameters[0] = true;
                timeParameters[values[j][2]] = values[j][0];
                break;
            }
            case "Control Parameters": {
                flagParameters[1] = true;
                controlParameters[values[j][2]] = values[j][0];
                break;
            }
            case "Cost Parameters": {
                flagParameters[2] = true;
                costParameters[values[j][2]] = values[j][0];
                break;
            }
            case "Resource Parameters": {
                flagParameters[3] = true;
                if (values[j][2] == "role") {
                    resourceParameters[values[j][2]] = [values[j][0]];
                } else {
                    resourceParameters[values[j][2]] = values[j][0];
                }

                break;
            }
            case "Property Parameters": {
                flagParameters[4] = true;
                if (values[j][2] == "property") {
                    propertyParameters[values[j][2]] = [values[j][0]];
                } else {
                    propertyParameters[values[j][2]] = values[j][0];
                }
                break;
            }
            case "Priority Parameters": {
                flagParameters[5] = true;
                priorityParameters[values[j][2]] = values[j][0];
                break;
            }

        }
    }

    if (flagParameters[0]) {
        newElemParam.timeParameters = timeParameters;
    }
    if (flagParameters[1]) {
        newElemParam.controlParameters = controlParameters;
    }
    if (flagParameters[2]) {
        newElemParam.costParameters = costParameters;
    }
    if (flagParameters[3]) {
        newElemParam.resourceParameters = resourceParameters;
    }
    if (flagParameters[4]) {
        newElemParam.propertyParameters = [propertyParameters];
    }
    if (flagParameters[5]) {
        newElemParam.priorityParameters = priorityParameters;
    }

    return newElemParam;
}

function saveScenarioParameterComplexProperty(scenarioToSave, childNodes) {
    // console.log("child");
    // console.log(childNodes);

    // console.log("scenario");
    // console.log(scenarioToSave);

    let propertyDiv = childNodes[3];
    let queueLengthDiv = childNodes[5];

    let propertyArrayTemp = []


    // * parte property
    for (let i = 5; i < propertyDiv.childNodes.length; i++) {

        let singlePropertyChildNodes = propertyDiv.childNodes[i].childNodes;
        let singlePropertyValueDiv = singlePropertyChildNodes[3];
        let singlePropertyResultRequestSelect = singlePropertyChildNodes[5];
        let singlePropertyNameInput = singlePropertyChildNodes[7];
        let singlePropertyPropertyTypeSelect = singlePropertyChildNodes[9];

        let singlePropertyValues = []
        for (let j = 0; j < singlePropertyValueDiv.childNodes.length; j++) {

            let singlePropertyValuesChildNodes = singlePropertyValueDiv.childNodes[j].childNodes;

            let valueName = singlePropertyValuesChildNodes[0].value;

            // non gestiamo per il momento EnumParameter
            if (valueName != "") {
                // creaiamo l'oggetto value da pushare nell'array di values
                let singleValue = new factory[valueName]();

                // accediamo al div del singolo valore
                let parameterContent = singlePropertyValuesChildNodes[2].childNodes

                // console.log("singolo div value")
                // console.log(parameterContent);
                for (let k = 1; k < parameterContent.length; k = k + 2) {
                    let parameterContentTemp = parameterContent[k];
                    // console.log("singolo elemento")
                    // console.log(parameterContent[k])
                    if (parameterContent[k].tagName == "DIV") {
                        parameterContentTemp = parameterContent[k].childNodes[0];
                    }
                    let fieldName = parameterContentTemp.id.split("-")[2];
                    if (parameterContent[k].tagName == "DIV") {
                        singleValue[fieldName] = String(parameterContentTemp.checked);
                    } else {
                        if (parameterContentTemp.value == "") {
                            singleValue[fieldName] = undefined;
                        } else {
                            if (fieldName == "validFor") {
                                singleValue[fieldName] = [parameterContentTemp.value];
                            } else {
                                singleValue[fieldName] = parameterContentTemp.value;
                            }
                        }
                    }

                }


                if (valueName == "EnumParameter") {

                    let enumDiv = parameterContent[parameterContent.length - 1];

                    let enumValues = [];

                    for (let j = 0; j < enumDiv.childNodes.length; j++) {
                        let singleEnumValue = enumDiv.childNodes[j];
                        // console.log("enum");
                        let pickerValue = singleEnumValue.childNodes[0].value;
                        if (pickerValue != "") {
                            let singleConstantParam = new factory[pickerValue];
                            let enumContent = singleEnumValue.childNodes[2].childNodes;
                            for (let k = 1; k < enumContent.length; k = k + 2) {
                                let enumContentTemp = enumContent[k];
                                if (enumContent[k].tagName == "DIV") {
                                    enumContentTemp = enumContent[k].childNodes[0];
                                }
                                let fieldName = enumContentTemp.id.split("-")[2];
                                if (enumContent[k].tagName == "DIV") {
                                    singleConstantParam[fieldName] = String(enumContentTemp.checked);
                                    // console.log(singleValue)
                                } else {
                                    if (enumContentTemp.value == "") {
                                        singleConstantParam[fieldName] = undefined;
                                    } else {
                                        singleConstantParam[fieldName] = enumContentTemp.value;
                                    }
                                }
                            }
                            if (pickerValue == "StringParameter" || pickerValue == "DateTimeParameter" || pickerValue == "DurationParameter") {
                                if (singleConstantParam.value != undefined) {
                                    enumValues.push(singleConstantParam);
                                }
                            } else {
                                enumValues.push(singleConstantParam);
                            }
                        }

                    }

                    singleValue.value = enumValues;

                } else if (valueName == "UserDistribution") {
                    let pointsDiv = parameterContent[parameterContent.length - 1];

                    let pointsNodes = pointsDiv.childNodes;

                    let pointsElements = [];

                    for (let j = 0; j < pointsNodes.length; j++) {
                        // console.log("ciclo per ogni point, questo è il "+j)
                        let singlePointAllValuesDiv = pointsNodes[j].childNodes[3];
                        let singlePointProbabilityInput = pointsNodes[j].childNodes[5];

                        let singlePointValuesTemp = [];

                        // console.log("prima cosa")
                        // console.log(singlePointAllValuesDiv)

                        for (let k = 0; k < singlePointAllValuesDiv.childNodes.length; k++) {
                            // console.log("ciclo per ogni value nel value del point n"+j+", orasono nella sua value n"+k)
                            let singlePointValueDiv = singlePointAllValuesDiv.childNodes[k];

                            let pickerValue = singlePointValueDiv.childNodes[0].value;
                            if (pickerValue != "") {
                                let singleParamValue = new factory[pickerValue];
                                let singleValueContent = singlePointValueDiv.childNodes[2].childNodes;

                                // console.log("singleValueDiv")
                                // console.log(singleValueContent)
                                for (let h = 1; h < singleValueContent.length; h = h + 2) {
                                    let singleValueContentTemp = singleValueContent[h];
                                    if (singleValueContent[h].tagName == "DIV") {
                                        singleValueContentTemp = singleValueContent[h].childNodes[0];
                                    }
                                    let fieldName = singleValueContentTemp.id.split("-")[2];
                                    if (singleValueContent[h].tagName == "DIV") {
                                        singleParamValue[fieldName] = String(singleValueContentTemp.checked);
                                        // console.log(singleValue)
                                    } else {
                                        if (singleValueContentTemp.value == "") {
                                            singleParamValue[fieldName] = undefined;
                                        } else {
                                            singleParamValue[fieldName] = singleValueContentTemp.value;
                                        }
                                    }
                                }
                                // if (singleParamValue.value != undefined) {
                                // console.log("sto pischando")
                                singlePointValuesTemp.push(singleParamValue);
                                // }
                            }
                        }
                        if (pickerValue == "EnumParameter") {

                            let enumDiv = singleValueContent[singleValueContent.length - 1];

                            let enumValues = [];

                            for (let j = 0; j < enumDiv.childNodes.length; j++) {
                                let singleEnumValue = enumDiv.childNodes[j];
                                // console.log("enum");

                                let pickerValue = singleEnumValue.childNodes[0].value;
                                if (pickerValue != "") {
                                    let singleConstantParam = new factory[pickerValue];
                                    let enumContent = singleEnumValue.childNodes[2].childNodes;
                                    for (let k = 1; k < enumContent.length; k = k + 2) {
                                        let enumContentTemp = enumContent[k];
                                        if (enumContent[k].tagName == "DIV") {
                                            enumContentTemp = enumContent[k].childNodes[0];
                                        }
                                        let fieldName = enumContentTemp.id.split("-")[2];
                                        if (enumContent[k].tagName == "DIV") {
                                            singleConstantParam[fieldName] = String(enumContentTemp.checked);
                                            // console.log(singleValue)
                                        } else {
                                            if (enumContentTemp.value == "") {
                                                singleConstantParam[fieldName] = undefined;
                                            } else {
                                                singleConstantParam[fieldName] = enumContentTemp.value;
                                            }
                                        }
                                    }
                                    if (pickerValue == "StringParameter" || pickerValue == "DateTimeParameter" || pickerValue == "DurationParameter") {
                                        if (singleConstantParam.value != undefined) {
                                            enumValues.push(singleConstantParam);
                                        }
                                    } else {
                                        enumValues.push(singleConstantParam);
                                    }
                                }
                            }

                            singleParamValue.value = enumValues;

                        }

                        // console.log("singlePointValuesTemp");
                        // console.log(singlePointValuesTemp)

                        let singlePoint = new UserDistributionDataPoint();

                        // console.log("singlepintvlue")

                        // console.log(singlePointValuesTemp);

                        singlePoint.value = singlePointValuesTemp;

                        if (singlePointProbabilityInput.value != "") {
                            singlePoint.probability = singlePointProbabilityInput.value;
                        }

                        if (singlePoint.value.length > 0 || singlePoint.probability != undefined) {
                            pointsElements.push(singlePoint);
                        }

                    }

                    singleValue.points = pointsElements;
                }

                singlePropertyValues.push(singleValue)
            }

        }

        let propertyTemp = new Property();


        propertyTemp.value = singlePropertyValues;

        if (singlePropertyNameInput.value != "") {
            propertyTemp.name = singlePropertyNameInput.value
        }

        propertyTemp.type = singlePropertyPropertyTypeSelect.value

        if (propertyTemp.value.length > 0) {
            propertyTemp.resultRequest = [singlePropertyResultRequestSelect.value];
        }

        propertyArrayTemp.push(propertyTemp);
    }



    // * parte queueLength
    let queueLengthValuesDiv = queueLengthDiv.childNodes[3];
    let queueLengthResultRequestSelect = queueLengthDiv.childNodes[5];

    let queueLengthValues = [];

    // cicliamo per ogni divValue di QueueLength
    for (let i = 0; i < queueLengthValuesDiv.childNodes.length; i++) {

        let innerDivChildNodes = queueLengthValuesDiv.childNodes[i].childNodes;

        // valore nel picker
        let valueName = innerDivChildNodes[0].value;

        // non gestiamo per il momento EnumParameter
        if (valueName != "") {
            // creaiamo l'oggetto value da pushare nell'array di values
            let singleValue = new factory[valueName]();

            // accediamo al div del singolo valore
            let parameterContent = innerDivChildNodes[2].childNodes

            // console.log("singolo div value")
            // console.log(parameterContent);
            for (let j = 1; j < parameterContent.length; j = j + 2) {
                let parameterContentTemp = parameterContent[j];
                if (parameterContent[j].tagName == "DIV") {
                    parameterContentTemp = parameterContent[j].childNodes[0];
                }
                let fieldName = parameterContentTemp.id.split("-")[2];
                if (parameterContent[j].tagName == "DIV") {
                    singleValue[fieldName] = String(parameterContentTemp.checked);
                    // console.log(singleValue)
                } else {
                    if (parameterContentTemp.value == "") {
                        singleValue[fieldName] = undefined;
                    } else {
                        singleValue[fieldName] = parameterContentTemp.value;
                    }
                }
                // TODO gestire campi che non sono select o input
            }

            if (valueName == "EnumParameter") {

                let enumDiv = parameterContent[parameterContent.length - 1];

                let enumValues = [];

                for (let j = 0; j < enumDiv.childNodes.length; j++) {
                    let singleEnumValue = enumDiv.childNodes[j];
                    // console.log("enum");
                    let pickerValue = singleEnumValue.childNodes[0].value;
                    if (pickerValue != "") {
                        let singleConstantParam = new factory[pickerValue];
                        let enumContent = singleEnumValue.childNodes[2].childNodes;
                        for (let k = 1; k < enumContent.length; k = k + 2) {
                            let enumContentTemp = enumContent[k];
                            if (enumContent[k].tagName == "DIV") {
                                enumContentTemp = enumContent[k].childNodes[0];
                            }
                            let fieldName = enumContentTemp.id.split("-")[2];
                            if (enumContent[k].tagName == "DIV") {
                                singleConstantParam[fieldName] = String(enumContentTemp.checked);
                                // console.log(singleValue)
                            } else {
                                if (enumContentTemp.value == "") {
                                    singleConstantParam[fieldName] = undefined;
                                } else {
                                    singleConstantParam[fieldName] = enumContentTemp.value;
                                }
                            }
                        }
                        if (pickerValue == "StringParameter" || pickerValue == "DateTimeParameter" || pickerValue == "DurationParameter") {
                            if (singleConstantParam.value != undefined) {
                                enumValues.push(singleConstantParam);
                            }
                        } else {
                            enumValues.push(singleConstantParam);
                        }
                    }

                }

                singleValue.value = enumValues;

            } else if (valueName == "UserDistribution") {
                let pointsDiv = parameterContent[parameterContent.length - 1];

                let pointsNodes = pointsDiv.childNodes;

                let pointsElements = [];

                for (let j = 0; j < pointsNodes.length; j++) {
                    // console.log("ciclo per ogni point, questo è il "+j)
                    let singlePointAllValuesDiv = pointsNodes[j].childNodes[3];
                    let singlePointProbabilityInput = pointsNodes[j].childNodes[5];

                    let singlePointValuesTemp = [];

                    // console.log("prima cosa")
                    // console.log(singlePointAllValuesDiv)

                    for (let k = 0; k < singlePointAllValuesDiv.childNodes.length; k++) {
                        // console.log("ciclo per ogni value nel value del point n"+j+", orasono nella sua value n"+k)
                        let singlePointValueDiv = singlePointAllValuesDiv.childNodes[k];

                        let pickerValue = singlePointValueDiv.childNodes[0].value;
                        if (pickerValue != "") {
                            let singleParamValue = new factory[pickerValue];
                            let singleValueContent = singlePointValueDiv.childNodes[2].childNodes;

                            // console.log("singleValueDiv")
                            // console.log(singleValueContent)
                            for (let h = 1; h < singleValueContent.length; h = h + 2) {
                                let singleValueContentTemp = singleValueContent[h];
                                if (singleValueContent[h].tagName == "DIV") {
                                    singleValueContentTemp = singleValueContent[h].childNodes[0];
                                }
                                let fieldName = singleValueContentTemp.id.split("-")[2];
                                if (singleValueContent[h].tagName == "DIV") {
                                    singleParamValue[fieldName] = String(singleValueContentTemp.checked);
                                    // console.log(singleValue)
                                } else {
                                    if (singleValueContentTemp.value == "") {
                                        singleParamValue[fieldName] = undefined;
                                    } else {
                                        singleParamValue[fieldName] = singleValueContentTemp.value;
                                    }
                                }
                            }

                            if (pickerValue == "EnumParameter") {

                                let enumDiv = singleValueContent[singleValueContent.length - 1];

                                let enumValues = [];

                                for (let j = 0; j < enumDiv.childNodes.length; j++) {
                                    let singleEnumValue = enumDiv.childNodes[j];
                                    // console.log("enum");

                                    let pickerValue = singleEnumValue.childNodes[0].value;
                                    if (pickerValue != "") {
                                        let singleConstantParam = new factory[pickerValue];
                                        let enumContent = singleEnumValue.childNodes[2].childNodes;
                                        for (let k = 1; k < enumContent.length; k = k + 2) {
                                            let enumContentTemp = enumContent[k];
                                            if (enumContent[k].tagName == "DIV") {
                                                enumContentTemp = enumContent[k].childNodes[0];
                                            }
                                            let fieldName = enumContentTemp.id.split("-")[2];
                                            if (enumContent[k].tagName == "DIV") {
                                                singleConstantParam[fieldName] = String(enumContentTemp.checked);
                                                // console.log(singleValue)
                                            } else {
                                                if (enumContentTemp.value == "") {
                                                    singleConstantParam[fieldName] = undefined;
                                                } else {
                                                    singleConstantParam[fieldName] = enumContentTemp.value;
                                                }
                                            }
                                        }
                                        if (pickerValue == "StringParameter" || pickerValue == "DateTimeParameter" || pickerValue == "DurationParameter") {
                                            if (singleConstantParam.value != undefined) {
                                                enumValues.push(singleConstantParam);
                                            }
                                        } else {
                                            enumValues.push(singleConstantParam);
                                        }
                                    }
                                }

                                singleParamValue.value = enumValues;

                            }

                            // if (singleParamValue.value != undefined) {
                            // console.log("sto pischando")
                            singlePointValuesTemp.push(singleParamValue);
                            // }
                        }
                    }
                    // console.log("singlePointValuesTemp");
                    // console.log(singlePointValuesTemp)

                    let singlePoint = new UserDistributionDataPoint();

                    // console.log("singlepintvlue")

                    // console.log(singlePointValuesTemp);

                    singlePoint.value = singlePointValuesTemp;

                    if (singlePointProbabilityInput.value != "") {
                        singlePoint.probability = singlePointProbabilityInput.value;
                    }

                    if (singlePoint.value.length > 0 || singlePoint.probability != undefined) {
                        pointsElements.push(singlePoint);
                    }

                }

                singleValue.points = pointsElements;
            }
            queueLengthValues.push(singleValue)
        }
    }





    let propertyParameterObj = new PropertyParameters();
    let propertyObj = new Property();
    let queueLengthObj = new Parameter();


    propertyObj = propertyArrayTemp;

    queueLengthObj.value = queueLengthValues;
    if (queueLengthValues.length > 0) {
        queueLengthObj.resultRequest = [queueLengthResultRequestSelect.value];
    } else {
        queueLengthObj = undefined;
    }
    propertyParameterObj.property = propertyObj;
    propertyParameterObj.queueLength = queueLengthObj;

    // console.log(scenarioToSave.scenarioParameters.propertyParameters[0].queueLength);
    // scenarioToSave.scenarioParameters.propertyParameters = undefined
    if (propertyObj.length > 0 || queueLengthObj != undefined) {
        scenarioToSave.scenarioParameters.propertyParameters = [propertyParameterObj];
    } else {
        scenarioToSave.scenarioParameters.propertyParameters = [];
    }

}

function saveScenarioParameterComplexParameter(scenarioToSave, parameterName, childNodes) {
    // console.log("child di " + parameterName)
    // console.log(childNodes);

    // div che contiene i div values
    let valuesDiv = childNodes[3];
    let resultRequestDiv = childNodes[5];


    let values = [];

    // cicliamo per ogni divValue
    for (let i = 0; i < valuesDiv.childNodes.length; i++) {

        let innerDivChildNodes = valuesDiv.childNodes[i].childNodes;
        console.log("child di " + parameterName + " " + valuesDiv.childNodes[i].id)
        console.log(innerDivChildNodes);

        // valore nel picker
        let valueName = innerDivChildNodes[0].value;

        //TODO non gestiamo per il momento EnumParameter
        if (valueName != "") {
            // creaiamo l'oggetto value da pushare nell'array di values
            let singleValue = new factory[valueName]();

            // accediamo al div del singolo valore
            let parameterContent = innerDivChildNodes[2].childNodes

            // console.log("singolo div value")
            // console.log(parameterContent);
            for (let j = 1; j < parameterContent.length; j = j + 2) {
                let parameterContentTemp = parameterContent[j];
                if (parameterContent[j].tagName == "DIV") {
                    parameterContentTemp = parameterContent[j].childNodes[0];
                }
                let fieldName = parameterContentTemp.id.split("-")[2];
                if (parameterContent[j].tagName == "DIV") {
                    singleValue[fieldName] = String(parameterContentTemp.checked);
                    // console.log(singleValue)
                } else {

                    if (parameterContentTemp.value == "") {
                        singleValue[fieldName] = undefined;
                    } else {
                        if (fieldName == "validFor") {
                            singleValue[fieldName] = [parameterContentTemp.value];
                        } else {
                            singleValue[fieldName] = parameterContentTemp.value;
                        }
                    }
                }
            }
            if (valueName == "EnumParameter") {

                let enumDiv = parameterContent[parameterContent.length - 1];

                let enumValues = [];

                for (let j = 0; j < enumDiv.childNodes.length; j++) {
                    let singleEnumValue = enumDiv.childNodes[j];
                    // console.log("enum");

                    let pickerValue = singleEnumValue.childNodes[0].value;
                    if (pickerValue != "") {
                        let singleConstantParam = new factory[pickerValue];
                        let enumContent = singleEnumValue.childNodes[2].childNodes;
                        for (let k = 1; k < enumContent.length; k = k + 2) {
                            let enumContentTemp = enumContent[k];
                            if (enumContent[k].tagName == "DIV") {
                                enumContentTemp = enumContent[k].childNodes[0];
                            }
                            let fieldName = enumContentTemp.id.split("-")[2];
                            if (enumContent[k].tagName == "DIV") {
                                singleConstantParam[fieldName] = String(enumContentTemp.checked);
                                // console.log(singleValue)
                            } else {
                                if (enumContentTemp.value == "") {
                                    singleConstantParam[fieldName] = undefined;
                                } else {
                                    singleConstantParam[fieldName] = enumContentTemp.value;
                                }
                            }
                        }
                        if (pickerValue == "StringParameter" || pickerValue == "DateTimeParameter" || pickerValue == "DurationParameter") {
                            if (singleConstantParam.value != undefined) {
                                enumValues.push(singleConstantParam);
                            }
                        } else {
                            enumValues.push(singleConstantParam);
                        }
                    }
                }

                singleValue.value = enumValues;

            } else if (valueName == "UserDistribution") {
                let pointsDiv = parameterContent[parameterContent.length - 1];

                let pointsNodes = pointsDiv.childNodes;

                let pointsElements = [];

                for (let j = 0; j < pointsNodes.length; j++) {
                    // console.log("ciclo per ogni point, questo è il "+j)
                    let singlePointAllValuesDiv = pointsNodes[j].childNodes[3];
                    let singlePointProbabilityInput = pointsNodes[j].childNodes[5];

                    let singlePointValuesTemp = [];

                    // console.log("prima cosa")
                    // console.log(singlePointAllValuesDiv)

                    for (let k = 0; k < singlePointAllValuesDiv.childNodes.length; k++) {
                        // console.log("ciclo per ogni value nel value del point n"+j+", orasono nella sua value n"+k)
                        let singlePointValueDiv = singlePointAllValuesDiv.childNodes[k];

                        let pickerValue = singlePointValueDiv.childNodes[0].value;
                        if (pickerValue != "") {
                            let singleParamValue = new factory[pickerValue];
                            let singleValueContent = singlePointValueDiv.childNodes[2].childNodes;

                            // console.log("singleValueDiv")
                            // console.log(singleValueContent)
                            for (let h = 1; h < singleValueContent.length; h = h + 2) {
                                let singleValueContentTemp = singleValueContent[h];
                                if (singleValueContent[h].tagName == "DIV") {
                                    singleValueContentTemp = singleValueContent[h].childNodes[0];
                                }
                                let fieldName = singleValueContentTemp.id.split("-")[2];
                                if (singleValueContent[h].tagName == "DIV") {
                                    singleParamValue[fieldName] = String(singleValueContentTemp.checked);
                                    // console.log(singleValue)
                                } else {
                                    if (singleValueContentTemp.value == "") {
                                        singleParamValue[fieldName] = undefined;
                                    } else {
                                        singleParamValue[fieldName] = singleValueContentTemp.value;
                                    }
                                }
                            }
                            if (pickerValue == "EnumParameter") {

                                let enumDiv = singleValueContent[singleValueContent.length - 1];

                                let enumValues = [];

                                for (let j = 0; j < enumDiv.childNodes.length; j++) {
                                    let singleEnumValue = enumDiv.childNodes[j];
                                    // console.log("enum");

                                    let pickerValue = singleEnumValue.childNodes[0].value;
                                    if (pickerValue != "") {
                                        let singleConstantParam = new factory[pickerValue];
                                        let enumContent = singleEnumValue.childNodes[2].childNodes;
                                        for (let k = 1; k < enumContent.length; k = k + 2) {
                                            let enumContentTemp = enumContent[k];
                                            if (enumContent[k].tagName == "DIV") {
                                                enumContentTemp = enumContent[k].childNodes[0];
                                            }
                                            let fieldName = enumContentTemp.id.split("-")[2];
                                            if (enumContent[k].tagName == "DIV") {
                                                singleConstantParam[fieldName] = String(enumContentTemp.checked);
                                                // console.log(singleValue)
                                            } else {
                                                if (enumContentTemp.value == "") {
                                                    singleConstantParam[fieldName] = undefined;
                                                } else {
                                                    singleConstantParam[fieldName] = enumContentTemp.value;
                                                }
                                            }
                                        }
                                        if (pickerValue == "StringParameter" || pickerValue == "DateTimeParameter" || pickerValue == "DurationParameter") {
                                            if (singleConstantParam.value != undefined) {
                                                enumValues.push(singleConstantParam);
                                            }
                                        } else {
                                            enumValues.push(singleConstantParam);
                                        }
                                    }
                                }

                                singleParamValue.value = enumValues;

                            }


                            // if (singleParamValue.value != undefined) {
                            // console.log("sto pischando")
                            singlePointValuesTemp.push(singleParamValue);
                            // }
                        }
                    }
                    // console.log("singlePointValuesTemp");
                    // console.log(singlePointValuesTemp)

                    let singlePoint = new UserDistributionDataPoint();

                    // console.log("singlepintvlue")

                    // console.log(singlePointValuesTemp);

                    singlePoint.value = singlePointValuesTemp;

                    if (singlePointProbabilityInput.value != "") {
                        singlePoint.probability = singlePointProbabilityInput.value;
                    }

                    if (singlePoint.value.length > 0 || singlePoint.probability != undefined) {
                        pointsElements.push(singlePoint);
                    }

                }


                singleValue.points = pointsElements;
            }

            values.push(singleValue)
        }
    }

    let obj = new Parameter();
    obj.value = values;
    if (values.length > 0) {
        obj.resultRequest = [resultRequestDiv.value];
    } else {
        obj = undefined
    }

    scenarioToSave.scenarioParameters[parameterName] = obj;
}

function getElementParameterObj(childNodes, elRef, pickerIndex, haveResultRequest = true) {


    let elRefWithEscape = $.escapeSelector('$$' + elRef + '$$');
    let query = 'select[id$=' + elRefWithEscape + ']';
    let outputQuery = $(query);

    let selected_value = outputQuery[pickerIndex].value;

    let optgroup = outputQuery[pickerIndex].options[outputQuery[pickerIndex].options.selectedIndex].parentElement.label

    let selectedValueRigthName = selected_value.charAt(0).toLowerCase() + selected_value.slice(1);

    if (selected_value == "Interruptible" || selected_value == "Priority" || selected_value == "Probability" ||
        selected_value == "Condition" || selected_value == "Availability" || selected_value == "Quantity") {
        haveResultRequest = false;
    }

    let isProperty = false;
    let propertyNameDiv;
    let propertyTypeDiv;

    let valuesDiv = childNodes[3];
    let resultRequestDiv;
    if (haveResultRequest) {
        resultRequestDiv = childNodes[5];
    }


    if (childNodes[0].id.includes("property")) {
        isProperty = true;
        haveResultRequest = false;
        propertyNameDiv = childNodes[5];
        propertyTypeDiv = childNodes[7];
        // pickerIndex = 0;
    }

    // div che contiene i div values
    let values = [];
    // cicliamo per ogni divValue
    if (valuesDiv != undefined) {
        for (let i = 0; i < valuesDiv.childNodes.length; i++) {

            let innerDivChildNodes = valuesDiv.childNodes[i].childNodes;

            // valore nel picker
            let valueName = innerDivChildNodes[0].value;

            // non gestiamo per il momento EnumParameter
            if (valueName != "") {
                // creaiamo l'oggetto value da pushare nell'array di values
                let singleValue = new factory[valueName]();

                // accediamo al div del singolo valore
                let parameterContent = innerDivChildNodes[2].childNodes

                // console.log("singolo div value")
                // console.log(parameterContent);
                for (let j = 1; j < parameterContent.length; j = j + 2) {
                    let parameterContentTemp = parameterContent[j];
                    if (parameterContent[j].tagName == "DIV") {
                        parameterContentTemp = parameterContent[j].childNodes[0];
                    }
                    let fieldName = parameterContentTemp.id.split("-")[2];
                    if (parameterContent[j].tagName == "DIV") {
                        singleValue[fieldName] = String(parameterContentTemp.checked);
                        // console.log(singleValue)
                    } else {
                        if (parameterContentTemp.value == "") {
                            singleValue[fieldName] = undefined;
                        } else {
                            if (fieldName == "validFor") {
                                singleValue[fieldName] = [parameterContentTemp.value];
                            } else {
                                singleValue[fieldName] = parameterContentTemp.value;
                            }
                        }
                    }
                    // TODO gestire campi che non sono select o input
                }

                if (valueName == "EnumParameter") {

                    let enumDiv = parameterContent[parameterContent.length - 1];

                    let enumValues = [];

                    for (let j = 0; j < enumDiv.childNodes.length; j++) {
                        let singleEnumValue = enumDiv.childNodes[j];
                        // console.log("enum");
                        let pickerValue = singleEnumValue.childNodes[0].value;
                        if (pickerValue != "") {
                            let singleConstantParam = new factory[pickerValue];
                            let enumContent = singleEnumValue.childNodes[2].childNodes;
                            for (let k = 1; k < enumContent.length; k = k + 2) {
                                let enumContentTemp = enumContent[k];
                                if (enumContent[k].tagName == "DIV") {
                                    enumContentTemp = enumContent[k].childNodes[0];
                                }
                                let fieldName = enumContentTemp.id.split("-")[2];
                                if (enumContent[k].tagName == "DIV") {
                                    singleConstantParam[fieldName] = String(enumContentTemp.checked);
                                    // console.log(singleValue)
                                } else {
                                    if (enumContentTemp.value == "") {
                                        singleConstantParam[fieldName] = undefined;
                                    } else {
                                        singleConstantParam[fieldName] = enumContentTemp.value;
                                    }
                                }
                            }
                            if (pickerValue == "StringParameter" || pickerValue == "DateTimeParameter" || pickerValue == "DurationParameter") {
                                if (singleConstantParam.value != undefined) {
                                    enumValues.push(singleConstantParam);
                                }
                            } else {
                                enumValues.push(singleConstantParam);
                            }
                        }

                    }

                    singleValue.value = enumValues;

                } else if (valueName == "UserDistribution") {
                    let pointsDiv = parameterContent[parameterContent.length - 1];

                    let pointsNodes = pointsDiv.childNodes;

                    let pointsElements = [];

                    for (let j = 0; j < pointsNodes.length; j++) {
                        // console.log("ciclo per ogni point, questo è il "+j)
                        let singlePointAllValuesDiv = pointsNodes[j].childNodes[3];
                        let singlePointProbabilityInput = pointsNodes[j].childNodes[5];

                        let singlePointValuesTemp = [];

                        // console.log("prima cosa")
                        // console.log(singlePointAllValuesDiv)

                        for (let k = 0; k < singlePointAllValuesDiv.childNodes.length; k++) {
                            // console.log("ciclo per ogni value nel value del point n"+j+", orasono nella sua value n"+k)
                            let singlePointValueDiv = singlePointAllValuesDiv.childNodes[k];

                            let pickerValue = singlePointValueDiv.childNodes[0].value;
                            if (pickerValue != "") {
                                let singleParamValue = new factory[pickerValue];
                                let singleValueContent = singlePointValueDiv.childNodes[2].childNodes;

                                // console.log("singleValueDiv")
                                // console.log(singleValueContent)
                                for (let h = 1; h < singleValueContent.length; h = h + 2) {
                                    let singleValueContentTemp = singleValueContent[h];
                                    if (singleValueContent[h].tagName == "DIV") {
                                        singleValueContentTemp = singleValueContent[h].childNodes[0];
                                    }
                                    let fieldName = singleValueContentTemp.id.split("-")[2];
                                    if (singleValueContent[h].tagName == "DIV") {
                                        singleParamValue[fieldName] = String(singleValueContentTemp.checked);
                                        // console.log(singleValue)
                                    } else {
                                        if (singleValueContentTemp.value == "") {
                                            singleParamValue[fieldName] = undefined;
                                        } else {
                                            singleParamValue[fieldName] = singleValueContentTemp.value;
                                        }
                                    }
                                }


                                if (pickerValue == "EnumParameter") {

                                    let enumDiv = singleValueContent[singleValueContent.length - 1];

                                    let enumValues = [];

                                    for (let j = 0; j < enumDiv.childNodes.length; j++) {
                                        let singleEnumValue = enumDiv.childNodes[j];
                                        // console.log("enum");

                                        let pickerValue = singleEnumValue.childNodes[0].value;
                                        if (pickerValue != "") {
                                            let singleConstantParam = new factory[pickerValue];
                                            let enumContent = singleEnumValue.childNodes[2].childNodes;
                                            for (let k = 1; k < enumContent.length; k = k + 2) {
                                                let enumContentTemp = enumContent[k];
                                                if (enumContent[k].tagName == "DIV") {
                                                    enumContentTemp = enumContent[k].childNodes[0];
                                                }
                                                let fieldName = enumContentTemp.id.split("-")[2];
                                                if (enumContent[k].tagName == "DIV") {
                                                    singleConstantParam[fieldName] = String(enumContentTemp.checked);
                                                    // console.log(singleValue)
                                                } else {
                                                    if (enumContentTemp.value == "") {
                                                        singleConstantParam[fieldName] = undefined;
                                                    } else {
                                                        singleConstantParam[fieldName] = enumContentTemp.value;
                                                    }
                                                }
                                            }
                                            if (pickerValue == "StringParameter" || pickerValue == "DateTimeParameter" || pickerValue == "DurationParameter") {
                                                if (singleConstantParam.value != undefined) {
                                                    enumValues.push(singleConstantParam);
                                                }
                                            } else {
                                                enumValues.push(singleConstantParam);
                                            }
                                        }
                                    }

                                    singleParamValue.value = enumValues;

                                }

                                // if (singleParamValue.value != undefined) {
                                // console.log("sto pischando")
                                singlePointValuesTemp.push(singleParamValue);
                                // }
                            }
                        }
                        // console.log("singlePointValuesTemp");
                        // console.log(singlePointValuesTemp)

                        let singlePoint = new UserDistributionDataPoint();

                        // console.log("singlepintvlue")

                        // console.log(singlePointValuesTemp);

                        singlePoint.value = singlePointValuesTemp;

                        if (singlePointProbabilityInput.value != "") {
                            singlePoint.probability = singlePointProbabilityInput.value;
                        }

                        if (singlePoint.value.length > 0 || singlePoint.probability != undefined) {
                            pointsElements.push(singlePoint);
                        }

                    }

                    singleValue.points = pointsElements;
                }
                values.push(singleValue)
            }
        }

        let obj;
        if (isProperty) {
            obj = new Property();
            obj.value = values;
            if (propertyNameDiv.value != "" && propertyNameDiv.value != undefined) {
                obj.name = propertyNameDiv.value;
            }
            obj.type = propertyTypeDiv.value;

        } else {
            obj = new Parameter();
            obj.value = values;
            if (haveResultRequest) {
                if (values.length > 0) {
                    obj.resultRequest = [resultRequestDiv.value];
                } else {
                    return undefined;
                }
            }
        }

        // scenarioToSave.scenarioParameters[parameterName] = obj;
        if (values.length == 0 && haveResultRequest == false && !isProperty) {
            return undefined;
        } else {
            return [obj, optgroup, selectedValueRigthName];
        }

    } else {
        return undefined;
    }
}

function setElementParameter(parameter, section, elRef, elementName) {

    let labelInitial = jQuery('<label/>', {
        text: 'Add Parameter'
    });
    parameter.append(labelInitial);

    let btnAdd = jQuery('<button/>', {
        class: 'btn btn-primary btn-lg button-calculate btn-icon',
        type: 'button',
        id: 'btn-create-elementParameter-$$' + elRef + '$$'
    });

    let iElForPlus = jQuery('<i/>', {
        class: 'fa fa-plus',
        id: 'btn-create-elementParameter-$$' + elRef + '$$'
    });

    btnAdd.append(iElForPlus);

    btnAdd.on('click', function () {
        elementParameterCounterGlobal += 1;

        let div = jQuery('<div/>', {
            id: 'div-parameter' + elementParameterCounterGlobal + '-$$' + elRef + '$$',
            tabindex: '1',
            style: "border-radius: 10px; border: solid 1px black; padding: 2%"
        });

        let elementParameterTypePicker = jQuery('<select/>', {
            class: "scenario-picker",
            id: 'select-parameter' + elementParameterCounterGlobal + '-$$' + elRef + '$$'
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

        if (section == "activities") {
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


        
            if (elRef != undefined) {
                for (let i in nodesActivities) {
                    if(nodesActivities[i].id == elRef && (! nodesActivities[i].localName.toLowerCase().includes("task"))){
                        let elementsInSubActivity = nodesActivities[i].children;
                        if(elementsInSubActivity.length > 0){
                            let haveDecomposition = false;
                            let haveIncoming = false;
                            for(let j=0; j < elementsInSubActivity.length; j++){  
                                if(elementsInSubActivity[j].localName != "incoming" && elementsInSubActivity[j].localName != "outgoing"){
                                    haveDecomposition = true; 
                                }
                                if(elementsInSubActivity[j].localName == "incoming"){
                                    haveIncoming = true;
                                }
                            }
                            if(haveDecomposition){
                                superclassOptions = ["Cost Parameters", "Property Parameters"];
                                singleOptionMatrix = [
                                    ["Fixed Cost", "Unit Cost"],
                                    ["Property"]
                                ];
                            }else{
                                if(haveIncoming){
                                    superclassOptions = ["Cost Parameters", "Property Parameters"];
                                    singleOptionMatrix = [
                                        ["Fixed Cost", "Unit Cost"],
                                        ["Property"]
                                    ];
                                }
                            }
                        }
    
                    }
                }
            }
    

        } else if (section == "events") {
            if (elementName == "startEvent") {
                superclassOptions = ["Control Parameters", "Property Parameters"];
                singleOptionMatrix = [
                    ["Inter Trigger Timer", "Trigger Count", "Probability", "Condition"], //TODO prob e cond da verificare
                    ["Property"]
                ]
            } else if (elementName == "endEvent") {
                superclassOptions = ["Property Parameters"];
                singleOptionMatrix = [
                    ["Property"]
                ]
            } else {
                if (elementName == "intermediateCatchEvent") {
                    superclassOptions = ["Control Parameters", "Property Parameters"];
                    singleOptionMatrix = [
                        ["Inter Trigger Timer"],
                        ["Property"]
                    ]
                } else if (elementName == "boundaryEvent") {
                    superclassOptions = ["Control Parameters", "Property Parameters"];
                    singleOptionMatrix = [
                        ["Probability", "Condition"],
                        ["Property"]
                    ]
                } else {
                    superclassOptions = ["Property Parameters"];
                    singleOptionMatrix = [
                        ["Property"]
                    ]
                }
            }
        } else if (section == "gateways") {
            superclassOptions = ["Control Parameters"];
            singleOptionMatrix = [["Inter Trigger Timer", "Trigger Count"]];

        } else if (section == "resources") {
            superclassOptions = ["Resource Parameters", "Cost Parameters"];
            singleOptionMatrix = [
                ["Availability", "Quantity", "Role", "Selection"],
                ["Fixed Cost", "Unit Cost"]
            ];

        } else {
            if (elementName == "sequenceFlow") {
                superclassOptions = ["Control Parameters", "Property Parameters"];
                singleOptionMatrix = [
                    ["Probability", "Condition"], //solo per sequence flow
                    ["Property"] //sia per sequence flow che per message flow
                ]
            } else {
                superclassOptions = ["Property Parameters"];
                singleOptionMatrix = [
                    ["Property"] //sia per sequence flow che per message flow
                ]
            }

        }


        for (let i = 0; i < superclassOptions.length; i++) {
            let subGroup = $('<optgroup>', {
                label: superclassOptions[i]
            });
            for (let j = 0; j < singleOptionMatrix[i].length; j++) {
                let singleNames = singleOptionMatrix[i][j].split(" ");
                let nameSplittedWithoutSpace = "";
                for (let k = 0; k < singleNames.length; k++) {
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
            id: 'btn-deleteParameter' + elementParameterCounterGlobal + '-$$' + elRef + '$$'

        });

        let iElforTrash = jQuery('<i/>', {
            class: 'fa fa-trash',
            id: 'btn-deleteParameter' + elementParameterCounterGlobal + '-$$' + elRef + '$$'
        });

        btnTrash.append(iElforTrash);

        let localParametersCounter = elementParameterCounterGlobal;

        btnTrash.on('click', function () {
            let divToDeleteName = $.escapeSelector('div-parameter' + localParametersCounter + '-$$' + elRef + '$$');
            let divToDelete = $('#' + divToDeleteName);
            // console.log("div element");
            // console.log(divToDelete);
            divToDelete.remove();
        });


        div.append(btnTrash);


        let divType = jQuery('<div/>', {
            id: 'divType-parameter' + elementParameterCounterGlobal + '-$$' + elRef + '$$'
            // style: "border-radius: 10px; border: solid 1px black; padding: 2%"
        });

        div.append(divType);
        //  TODO fare set parameter sull'on change del picker

        elementParameterTypePicker.on('change', function () {

            // console.log("ooooooooooooooooooooooooooooooooooooooooooooooo")
            let externalDiv = this.parentElement.parentElement;
            // console.log(externalDiv)
            // externalDiv = externalDiv.childNodes[2];
            let nameArrayUsed = [];
            for (let i = 2; i < externalDiv.childNodes.length; i++) {
                let sibling = externalDiv.childNodes[i];
                if (sibling.childNodes[0].id != this.id) {
                    // console.log(sibling.childNodes[0].value);
                    nameArrayUsed.push(sibling.childNodes[0].value);
                }
            }

            if (nameArrayUsed.length > 0) {
                if (nameArrayUsed.includes(this.value) && this.value != "") {
                    window.alert("ERROR: Value " + this.value + " is already used in this parameter");
                    this.value = "";
                }
            }



            divType.empty();
            let selected_option = $(this).find(":selected"); // get selected option for the changed select only
            let selected_value = selected_option.val();
            let optgroup = selected_option.parent().attr('label');

            if (this.value != "") {
                setParameter(divType, "elem-par-btn");

                let resultRequestPicker = $("[id*=parameter" + localParametersCounter + "-resultRequest]")[0];
                let resultRequestLabel = $("[id*=parameter" + localParametersCounter + "-label-resultRequest]")[0]
                switch (optgroup) {
                    case "Time Parameters": {
                        //nothing to do
                        //TODO Vedere se rimuovere perché non si deve fare nulla
                        break;
                    }
                    case "Control Parameters": {
                        // console.log(selected_value);
                        if (selected_value == "InterTriggerTimer") {
                            //all but not count
                            resultRequestPicker.removeChild(resultRequestPicker.options[3]);
                        } else if (selected_value == "TriggerCount") {
                            //only count
                            resultRequestPicker.removeChild(resultRequestPicker.options[4]);
                            resultRequestPicker.removeChild(resultRequestPicker.options[0]);
                            resultRequestPicker.removeChild(resultRequestPicker.options[0]);
                            resultRequestPicker.removeChild(resultRequestPicker.options[0]);

                        } else {
                            resultRequestLabel.remove();
                            resultRequestPicker.remove();
                        }
                        break;
                    }
                    case "Resource Parameters": {
                        if (selected_value != "Selection") {
                            resultRequestLabel.remove();
                            resultRequestPicker.remove();
                            if (selected_value == "Role") {
                                divType.empty();

                                let labelInitial = jQuery('<label/>', {
                                    text: 'Add Role'
                                });
                                divType.append(labelInitial);

                                let btnAddRole = jQuery('<button/>', {
                                    class: 'btn btn-primary btn-lg button-calculate btn-icon',
                                    type: 'button',
                                    id: 'btn-create-role'

                                });

                                let iElForPlus = jQuery('<i/>', {
                                    class: 'fa fa-plus',
                                    id: 'btn-create-role'
                                });

                                btnAddRole.append(iElForPlus);
                                let rolesCounter = 0;
                                btnAddRole.on('click', function () {
                                    rolesCounter += 1;
                                    parameterValueDivCounterGlobal += 1;
                                    //aggiunta div property
                                    let roleDiv = jQuery('<div/>', {
                                        id: 'elementParameters-role' + rolesCounter + '-div-' + parameterValueDivCounterGlobal,
                                        style: "border-radius: 10px; border: solid 1px black; padding: 2%",
                                        tabindex: '1'
                                    });

                                    setParameter(roleDiv);

                                    let btnTrash = jQuery('<button/>', {
                                        class: 'btn btn-primary btn-lg button-calculate btn-icon',
                                        type: 'button',
                                        id: 'btn-deleteRole' + rolesCounter + '-' + parameterValueDivCounterGlobal

                                    });

                                    let iElforTrash = jQuery('<i/>', {
                                        class: 'fa fa-trash',
                                        id: 'btn-deleteRole' + rolesCounter + '-' + parameterValueDivCounterGlobal
                                    });



                                    btnTrash.append(iElforTrash);

                                    let idLocalRemoveRole = parameterValueDivCounterGlobal;
                                    let localRolesCounter = rolesCounter;


                                    btnTrash.on('click', function () {
                                        $('div[id*=elementParameters-role' + localRolesCounter + '-div-' + idLocalRemoveRole + ']').remove();
                                    });

                                    // roleDiv.append(btnTrash);
                                    btnTrash.insertAfter(roleDiv[0].childNodes[0].childNodes[0]);

                                    divType.append(roleDiv);


                                    if ($('#elem-par-btn').data('clicked') == true) {
                                        // console.log("sto focussando " + roleDiv[0].id)
                                        roleDiv.focus();
                                    }

                                });
                                divType.append(btnAddRole);
                            }
                        } else {
                            //only min max
                            resultRequestPicker.removeChild(resultRequestPicker.options[2]);
                            resultRequestPicker.removeChild(resultRequestPicker.options[2]);
                            resultRequestPicker.removeChild(resultRequestPicker.options[2]);
                        }
                        break;
                    }
                    case "Cost Parameters": {
                        //only sum
                        resultRequestPicker.removeChild(resultRequestPicker.options[0]);
                        resultRequestPicker.removeChild(resultRequestPicker.options[0]);
                        resultRequestPicker.removeChild(resultRequestPicker.options[0]);
                        resultRequestPicker.removeChild(resultRequestPicker.options[0]);
                        break;
                    }
                    case "Property Parameters": {
                        if (selected_value == "Property") {
                            divType.empty();

                            let labelInitial = jQuery('<label/>', {
                                text: 'Add Property'
                            });
                            divType.append(labelInitial);

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
                            // let propertiesCounterGlobal = 0;
                            btnAddProperty.on('click', function () {
                                propertiesCounterGlobal += 1;
                                parameterValueDivCounterGlobal += 1;
                                //aggiunta div property
                                let propertyDiv = jQuery('<div/>', {
                                    id: 'elementParameters-property' + propertiesCounterGlobal + '-div-' + parameterValueDivCounterGlobal,
                                    style: "border-radius: 10px; border: solid 1px black; padding: 2%",
                                    tabindex: '1'
                                });

                                setParameter(propertyDiv);

                                let labelPropertyName = jQuery('<label/>', {
                                    for: 'elementParameters-property-propertyParameters-name-' + parameterValueDivCounterGlobal,
                                    text: 'Name',
                                    width: '100%'
                                });

                                let inputPropertyName = jQuery('<input/>', {
                                    type: 'text',
                                    class: 'form-control form-control-input',
                                    id: 'elementParameters-property-propertyParameters-name-' + parameterValueDivCounterGlobal,
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
                                    id: 'propertyType-elementParameters-picker-' + parameterValueDivCounterGlobal,
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
                                    id: 'btn-deleteProperty' + propertiesCounterGlobal + '-' + parameterValueDivCounterGlobal

                                });

                                let iElforTrash = jQuery('<i/>', {
                                    class: 'fa fa-trash',
                                    id: 'btn-deleteProperty' + propertiesCounterGlobal + '-' + parameterValueDivCounterGlobal
                                });

                                btnTrash.append(iElforTrash);

                                let idLocalRemoveProperty = parameterValueDivCounterGlobal;
                                let localPropertiesCounterGlobal = propertiesCounterGlobal;


                                btnTrash.on('click', function () {
                                    $('div[id*=elementParameters-property' + localPropertiesCounterGlobal + '-div-' + idLocalRemoveProperty + ']').remove();
                                });

                                btnTrash.insertAfter(propertyDiv[0].childNodes[0].childNodes[0]);

                                divType.append(propertyDiv);

                                if ($('#elem-par-btn').data('clicked') == true) {
                                    // console.log("sto focussando " + propertyDiv[0].id)
                                    propertyDiv.focus();
                                }


                            });
                            divType.append(btnAddProperty);




                        } else {
                            //all but not count and sum
                            resultRequestPicker.removeChild(resultRequestPicker.options[3]);
                            resultRequestPicker.removeChild(resultRequestPicker.options[3]);
                        }
                        break;
                    }
                    case "Priority Parameters": {
                        resultRequestLabel.remove();
                        resultRequestPicker.remove();

                        break;
                    }
                }
            }

        });


        //TODO gestire nell'on change l'eliminazione delle option di resultRequest


        parameter.append(div);

        if ($('#elem-par-btn').data('clicked') == true) {
            // console.log("sto focussando " + div[0].id)
            div.focus();
        }

    });

    parameter.append(btnAdd);


}

function setParameter(parameter, buttonID) {

    // console.log("parameter in ingresso")
    // console.log(parameter[0].id);

    let parameterName = parameter[0].id.split("-")[1];
    parameter.empty();

    // console.log("parameter name")
    // console.log(parameterName)


    let divTemp = jQuery('<div/>', {
        style: "width: 100%",
        id: 'delete-div-' + parameterName + "-" + parameterValueDivCounterGlobal
    });

    let nameLabel = jQuery('<label/>', {
        style: "font-size: large",
        text: parameterName.charAt(0).toUpperCase() + parameterName.slice(1)
    });

    divTemp.append(nameLabel);

    parameter.append(divTemp);

    let valueLabel = jQuery('<label/>', {
        text: "Value",
    });

    let btnAdd = jQuery('<button/>', {
        class: 'btn btn-primary btn-lg button-calculate btn-icon',
        type: 'button',
        id: 'btn-create-' + parameterName + '-value'

    });

    let iElForPlus = jQuery('<i/>', {
        class: 'fa fa-plus',
        id: 'btn-create-' + parameterName + '-value'
    });

    btnAdd.append(iElForPlus);

    btnAdd.on("click", function () {
        // console.log("nomeeeeee")
        // console.log(parameterName)
        let superclassOptions = ["Constant Parameters", "Distribution Parameters", "Enum Parameters", "Expression Parameters"];
        let singleOptionMatrix = [
            ["Boolean Parameter", "DateTime Parameter", "Duration Parameter", "Floating Parameter", "Numeric Parameter",
                "String Parameter"],
            ["Beta Distribution", "Binomial Distribution", "Erlang Distribution", "Gamma Distribution",
                "Log Normal Distribution", "Negative Exponential Distribution", "Normal Distribution",
                "Poisson Distribution", "Triangular Distribution", "Truncated Normal Distribution", "Uniform Distribution",
                "User Distribution", "Weibull Distribution"],
            ["Enum Parameter"],
            ["Expression Parameter"]];

        if (parameterName.includes("point")) {
            singleOptionMatrix[1].splice(singleOptionMatrix[1].length - 2, 1)
        }

       



        parameterValueDivCounterGlobal += 1;

        let valuesSection = $('#' + parameterName + '-values-section');

        //aggiunta divs
        let valueDiv = jQuery('<div/>', {
            id: parameterName + "-value-div-" + parameterValueDivCounterGlobal,
            style: "border-radius: 10px; border: solid 1px black; padding: 2%",
            tabindex: '1'
        });

        let parameterValuePicker = jQuery('<select/>', {
            class: "scenario-picker",
            id: parameterName + "-value-picker-" + parameterValueDivCounterGlobal
        });

        parameterValuePicker.append($('<option>', {
            value: "",
            text: ""
        }));

        //creazione picker con tutti i possibili valori di ParameterValue
        for (let i = 0; i < superclassOptions.length; i++) {
            let subGroup = $('<optgroup>', {
                label: superclassOptions[i]
            });
            for (let j = 0; j < singleOptionMatrix[i].length; j++) {
                let singleNames = singleOptionMatrix[i][j].split(" ");
                let nameSplittedWithoutSpace = "";
                for (let k = 0; k < singleNames.length; k++) {
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
            // console.log("ooooooooooooooooooooooooooooooooooooooooooooooo")
            let externalDiv = this.parentElement.parentElement;
            let nameArrayUsed = []
            for (let i = 0; i < externalDiv.childNodes.length; i++) {
                let sibling = externalDiv.childNodes[i];
                if (sibling.childNodes[0].id != this.id) {
                    //     console.log(sibling.childNodes[0].value);
                    nameArrayUsed.push(sibling.childNodes[0].value);
                }
            }

            if (nameArrayUsed.length > 0) {
                if (nameArrayUsed.includes(this.value) && this.value != "") {
                    window.alert("ERROR: Value " + this.value + " is already used in this parameter");
                    this.value = "";
                }
            }

            // console.log("array")
            // console.log(nameArrayUsed)

            let idElementsLocal = this.id.split("-")[3];
            let contentDiv = $('#' + parameterName + '-value-content-div-' + idElementsLocal);

            contentDiv.empty();

            if (this.value != "") {
                let valueValidForLabel = jQuery('<label/>', {
                    for: parameterName + '-value-validFor-picker-' + idElementsLocal,
                    text: 'Valid For',
                    style: "width: 100%"
                });

                let valueValidForSelect = jQuery('<select/>', {
                    class: 'scenario-picker',
                    id: parameterName + '-value-validFor-picker-' + idElementsLocal
                });


                contentDiv.append(valueValidForLabel);
                contentDiv.append(valueValidForSelect);
                // console.log("setParameterChangePicker")
                updateValidFor();


                let valueInstanceLabel = jQuery('<label/>', {
                    for: parameterName + '-value-instance-input-' + idElementsLocal,
                    text: 'Instance',
                    style: 'width: 100%'
                });

                let valueInstanceInput = jQuery('<input/>', {
                    type: 'text',
                    class: 'form-control form-control-input',
                    id: parameterName + '-value-instance-input-' + idElementsLocal,
                    placeholder: 'Instance value'
                });
                contentDiv.append(valueInstanceLabel);
                contentDiv.append(valueInstanceInput);

                let valueResultLabel = jQuery('<label/>', {
                    style: 'width: 100%',
                    for: parameterName + '-value-result-input-' + idElementsLocal,
                    text: 'Result'
                });

                let valueResultPicker = jQuery('<select/>', {
                    class: 'scenario-picker',
                    id: parameterName + '-value-result-picker-' + idElementsLocal
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
                    for: parameterName + '-value-resultTimeStamp-input-' + idElementsLocal,
                    text: 'Result Time Stamp'
                });

                let valueResultTimeStampInput = jQuery('<input/>', {
                    type: 'datetime-local',
                    class: 'form-control form-control-input',
                    id: parameterName + '-value-resultTimeStamp-input-' + idElementsLocal,
                    placeholder: 'Result Time Stamp value'
                });
                contentDiv.append(valueResultTimeStampLabel);
                contentDiv.append(valueResultTimeStampInput);
            }
            switch (this.value) {
                case "ExpressionParameter": {
                    let expressionLabel = jQuery('<label/>', {
                        for: parameterName + '-value-value-expressionParameter-input-' + idElementsLocal,
                        text: 'Value'
                    });

                    let expressionInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName + '-value-value-expressionParameter-input-' + idElementsLocal,
                        placeholder: 'The XPATH expression'
                    });
                    contentDiv.append(expressionLabel);
                    contentDiv.append(expressionInput);
                    break;
                }
                case "EnumParameter": {

                    let enumValuesLabel = jQuery('<label/>', {
                        for: parameterName + '-value-enumParameterValue-input-' + idElementsLocal,
                        text: 'Values'
                    });

                    let btnAddEnumValues = jQuery('<button/>', {
                        class: 'btn btn-primary btn-lg button-calculate btn-icon',
                        type: 'button',
                        id: 'btn-create-' + parameterName + '-value-enumParameter-values-' + idElementsLocal

                    });

                    let iElForPlusEnumValues = jQuery('<i/>', {
                        class: 'fa fa-plus',
                        id: 'btn-create-' + parameterName + '-value-enumParameter-values-' + idElementsLocal
                    });

                    btnAddEnumValues.append(iElForPlusEnumValues);
                    btnAddEnumValues.on("click", function () {

                        parameterValueDivCounterGlobal += 1;

                        let idElementsEnumLocal = this.id.split("-")[6];
                        let contentEnumValues = $('#' + parameterName + "-value-enum-values-content-div-" + idElementsEnumLocal);

                        let constantParameterValues = ["Boolean Parameter", "DateTime Parameter", "Duration Parameter",
                            "Floating Parameter", "Numeric Parameter", "String Parameter"];


                        let enumValuePicker = jQuery('<select/>', {
                            class: "scenario-picker",
                            id: parameterName + "-value-enum-values-picker-" + parameterValueDivCounterGlobal
                        });

                        enumValuePicker.append($('<option>', {
                            value: "",
                            text: ""
                        }));

                        enumValuePicker.append($('<optgroup>', {
                            label: "Constant Parameter"
                        }));


                        for (let i = 0; i < constantParameterValues.length; i++) {
                            let singleNames = constantParameterValues[i].split(" ");
                            let nameSplittedWithoutSpace = "";
                            for (let j = 0; j < singleNames.length; j++) {
                                nameSplittedWithoutSpace += singleNames[j];
                            }
                            enumValuePicker.append($('<option>', {
                                value: nameSplittedWithoutSpace,
                                text: constantParameterValues[i]
                            }));
                        }

                        let enumDiv = jQuery('<div/>', {
                            style: "border-radius: 10px; border: solid 1px black; padding: 2%",
                            id: 'enumParameter-' + parameterName + '-value-div-' + idElementsEnumLocal + '-' + parameterValueDivCounterGlobal,
                            tabindex: '1'
                        });

                        enumDiv.append(enumValuePicker);

                        contentEnumValues.append(enumDiv);

                        let btnTrash = jQuery('<button/>', {
                            class: 'btn btn-primary btn-lg button-calculate btn-icon',
                            type: 'button',
                            id: 'btn-deleteValue-' + parameterName + '-value-' + idElementsEnumLocal + '-' + parameterValueDivCounterGlobal

                        });

                        let iElforTrash = jQuery('<i/>', {
                            class: 'fa fa-trash',
                            id: 'btn-deleteValue-' + parameterName + '-value-' + idElementsEnumLocal + '-' + parameterValueDivCounterGlobal
                        });

                        btnTrash.append(iElforTrash);

                        let idLocal = parameterValueDivCounterGlobal;

                        btnTrash.on('click', function () {
                            $('div[id*=' + parameterName + '-value-div-' + idElementsEnumLocal + '-' + idLocal + ']').remove();

                        });

                        enumDiv.append(btnTrash);

                        let enumContentDiv = jQuery('<div/>', {
                            id: 'enumParameter-' + parameterName + '-content-div-' + idElementsEnumLocal + '-' + parameterValueDivCounterGlobal
                        });

                        enumDiv.append(enumContentDiv);

                        //gestione onchange del picker di enum
                        enumValuePicker.on('change', function () {
                            enumContentDiv.empty();

                            switch (this.value) {
                                case "BooleanParameter": {
                                    let valueBooleanLabel = jQuery('<label/>', {
                                        for: 'enumParameter-' + parameterName + '-value-booleanParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
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
                                        id: 'enumParameter-' + parameterName + '-value-booleanParameterValue-input-' + idElementsEnumLocal + '-' + idLocal
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
                                        for: 'enumParameter-' + parameterName + '-value-booleanParameterValue-input-' + idElementsEnumLocal + '-' + idLocal
                                    });

                                    labelOnOffSwitch.append(spanInner);
                                    labelOnOffSwitch.append(spanSwitch);

                                    divBoolean.append(labelOnOffSwitch);

                                    enumContentDiv.append(valueBooleanLabel);
                                    enumContentDiv.append(divBoolean);

                                    break;
                                }
                                case "DateTimeParameter": {
                                    let dateTimeLabel = jQuery('<label/>', {
                                        for: 'enumParameter-' + parameterName + '-value-value-dateTimeParameter-input-' + idElementsEnumLocal + '-' + idLocal,
                                        text: 'Value'
                                    });

                                    let dateTimeInput = jQuery('<input/>', {
                                        type: 'text',
                                        class: 'form-control form-control-input',
                                        id: 'enumParameter-' + parameterName + '-value-value-dateTimeParameter-input-' + idElementsEnumLocal + '-' + idLocal,
                                        placeholder: 'DateTime value'
                                    });
                                    enumContentDiv.append(dateTimeLabel);
                                    enumContentDiv.append(dateTimeInput);
                                    break;
                                }
                                case "DurationParameter": {
                                    let durationLabel = jQuery('<label/>', {
                                        for: 'enumParameter-' + parameterName + '-value-durationParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
                                        text: 'Value'
                                    });

                                    let durationInput = jQuery('<input/>', {
                                        type: 'text',
                                        class: 'form-control form-control-input',
                                        id: 'enumParameter-' + parameterName + '-value-durationParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
                                        placeholder: 'Duration value'
                                    });
                                    enumContentDiv.append(durationLabel);
                                    enumContentDiv.append(durationInput);
                                    break;
                                }
                                case "FloatingParameter": {
                                    let floatingLabel = jQuery('<label/>', {
                                        for: 'enumParameter-' + parameterName + '-value-floatingParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
                                        text: 'Value'
                                    });

                                    let floatingInput = jQuery('<input/>', {
                                        type: 'text',
                                        class: 'form-control form-control-input',
                                        id: 'enumParameter-' + parameterName + '-value-floatingParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
                                        placeholder: 'Floating value'
                                    });

                                    enumContentDiv.append(floatingLabel);
                                    enumContentDiv.append(floatingInput);

                                    let floatingTimeUnitLabel = jQuery('<label/>', {
                                        for: 'enumParameter-value-timeUnit-floatingParameter-picker-' + idElementsEnumLocal + '-' + idLocal,
                                        text: 'Time Unit',
                                        style: "width: 100%"
                                    });

                                    let floatingTimeUnitPicker = jQuery('<select/>', {
                                        class: 'scenario-picker',
                                        id: 'enumParameter-value-timeUnit-floatingParameter-picker-' + idElementsEnumLocal + '-' + idLocal
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
                                case "NumericParameter": {
                                    let numericLabel = jQuery('<label/>', {
                                        for: 'enumParameter-' + parameterName + '-value-numericParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
                                        text: 'Value'
                                    });

                                    let numericInput = jQuery('<input/>', {
                                        type: 'text',
                                        class: 'form-control form-control-input',
                                        id: 'enumParameter-' + parameterName + '-value-numericParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
                                        placeholder: 'Int value'
                                    });

                                    enumContentDiv.append(numericLabel);
                                    enumContentDiv.append(numericInput);

                                    let numericTimeUnitLabel = jQuery('<label/>', {
                                        for: 'enumParameter-value-timeUnit-numericParameter-picker-' + idElementsEnumLocal + '-' + idLocal,
                                        text: 'Time Unit',
                                        style: "width: 100%"
                                    });

                                    let numericTimeUnitPicker = jQuery('<select/>', {
                                        class: 'scenario-picker',
                                        id: 'enumParameter-value-timeUnit-numericParameter-picker-' + idElementsEnumLocal + '-' + idLocal
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
                                case "StringParameter": {
                                    let stringLabel = jQuery('<label/>', {
                                        for: 'enumParameter-' + parameterName + '-value-stringParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
                                        text: 'Value'
                                    });

                                    let stringInput = jQuery('<input/>', {
                                        type: 'text',
                                        class: 'form-control form-control-input',
                                        id: 'enumParameter-' + parameterName + '-value-stringParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
                                        placeholder: 'String value'
                                    });
                                    enumContentDiv.append(stringLabel);
                                    enumContentDiv.append(stringInput);
                                    break;
                                }
                            }
                        });
                        if ($('#' + buttonID).data('clicked') == true) {
                            console.log("sto focussando " + enumDiv[0].id)
                            enumDiv[0].focus();
                        }
                    });

                    let divContentEnumValues = jQuery('<div/>', {
                        id: parameterName + "-value-enum-values-content-div-" + idElementsLocal
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
                        id: parameterName + '-' + distributionName + '-timeUnit-input-' + idElementsLocal,
                        text: 'Time Unit',
                        style: "width: 100%"
                    });

                    let valueTimeUnitPicker = jQuery('<select/>', {
                        class: 'scenario-picker',
                        id: parameterName + '-' + distributionName + '-timeUnit-input-' + idElementsLocal,
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
                        for: parameterName + '-' + distributionName + '-shape-input-' + idElementsLocal,
                        text: 'Shape'
                    });

                    let shapeInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName + '-' + distributionName + '-shape-input-' + idElementsLocal,
                        placeholder: 'Shape value'
                    });
                    contentDiv.append(shapeLabel);
                    contentDiv.append(shapeInput);

                    let scaleLabel = jQuery('<label/>', {
                        for: parameterName + '-' + distributionName + '-scale-input-' + idElementsLocal,
                        text: 'Scale'
                    });

                    let scaleInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName + '-' + distributionName + '-scale-input-' + idElementsLocal,
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
                            id: parameterName + '-' + distributionName + '-timeUnit-input-' + idElementsLocal,
                            text: 'Time Unit',
                            style: "width: 100%"
                        });

                        let valueTimeUnitPicker = jQuery('<select/>', {
                            class: 'scenario-picker',
                            id: parameterName + '-' + distributionName + '-timeUnit-input-' + idElementsLocal,
                        });

                        for (let timeUnit in TimeUnit) {
                            valueTimeUnitPicker.append($('<option>', {
                                value: timeUnit,
                                text: timeUnit
                            }));
                        }
                        contentDiv.append(valueTimeUnitLabel);
                        contentDiv.append(valueTimeUnitPicker);

                        if (this.value == "NormalDistribution" ||
                            this.value == "LogNormalDistribution" ||
                            this.value == "PoissonDistribution" ||
                            this.value == "ErlangDistribution" ||
                            this.value == "TruncatedNormalDistribution" ||
                            this.value == "NegativeExponentialDistribution") {
                            let meanLabel = jQuery('<label/>', {
                                width: "-webkit-fill-available",
                                for: parameterName + '-' + distributionName + '-mean-input-' + idElementsLocal,
                                text: 'Mean'
                            });

                            let meanInput = jQuery('<input/>', {
                                type: 'text',
                                class: 'form-control form-control-input',
                                id: parameterName + '-' + distributionName + '-mean-input-' + idElementsLocal,
                                placeholder: 'Mean value'
                            });
                            contentDiv.append(meanLabel);
                            contentDiv.append(meanInput);
                        }

                        if (this.value == "NormalDistribution" ||
                            this.value == "LogNormalDistribution" ||
                            this.value == "TruncatedNormalDistribution") {
                            let standardDeviationLabel = jQuery('<label/>', {
                                for: parameterName + '-' + distributionName + '-standardDeviation-input-' + idElementsLocal,
                                text: 'Standard Deviation'
                            });

                            let standardDeviationInput = jQuery('<input/>', {
                                type: 'text',
                                class: 'form-control form-control-input',
                                id: parameterName + '-' + distributionName + '-standardDeviation-input-' + idElementsLocal,
                                placeholder: 'Standard Deviation value'
                            });
                            contentDiv.append(standardDeviationLabel);
                            contentDiv.append(standardDeviationInput);
                        }

                        if (this.value == "UniformDistribution" ||
                            this.value == "TriangularDistribution" ||
                            this.value == "TruncatedNormalDistribution") {
                            let minLabel = jQuery('<label/>', {
                                width: "-webkit-fill-available",
                                for: parameterName + '-' + distributionName + '-min-input-' + idElementsLocal,
                                text: 'Min'
                            });

                            let minInput = jQuery('<input/>', {
                                type: 'text',
                                class: 'form-control form-control-input',
                                id: parameterName + '-' + distributionName + '-min-input-' + idElementsLocal,
                                placeholder: 'Min value'
                            });
                            contentDiv.append(minLabel);
                            contentDiv.append(minInput);
                        }

                        if (this.value == "UniformDistribution" ||
                            this.value == "TriangularDistribution" ||
                            this.value == "TruncatedNormalDistribution") {
                            let maxLabel = jQuery('<label/>', {
                                for: parameterName + '-' + distributionName + '-max-input-' + idElementsLocal,
                                text: 'Max'
                            });

                            let maxInput = jQuery('<input/>', {
                                type: 'text',
                                class: 'form-control form-control-input',
                                id: parameterName + '-' + distributionName + '-max-input-' + idElementsLocal,
                                placeholder: 'Max value'
                            });
                            contentDiv.append(maxLabel);
                            contentDiv.append(maxInput);
                        }

                        if (this.value == "TriangularDistribution") {
                            let modeLabel = jQuery('<label/>', {
                                for: parameterName + '-' + distributionName + '-mode-input-' + idElementsLocal,
                                text: 'Mode'
                            });

                            let modeInput = jQuery('<input/>', {
                                type: 'text',
                                class: 'form-control form-control-input',
                                id: parameterName + '-' + distributionName + '-mode-input-' + idElementsLocal,
                                placeholder: 'Mode value'
                            });
                            contentDiv.append(modeLabel);
                            contentDiv.append(modeInput);
                        }

                        if (this.value == "ErlangDistribution") {
                            let kLabel = jQuery('<label/>', {
                                for: parameterName + '-' + distributionName + '-k-input-' + idElementsLocal,
                                text: 'K'
                            });

                            let kInput = jQuery('<input/>', {
                                type: 'text',
                                class: 'form-control form-control-input',
                                id: parameterName + '-' + distributionName + '-k-input-' + idElementsLocal,
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
                        id: parameterName + '-' + distributionName + '-timeUnit-input-' + idElementsLocal,
                        text: 'Time Unit',
                        style: "width: 100%"
                    });

                    let valueTimeUnitPicker = jQuery('<select/>', {
                        class: 'scenario-picker',
                        id: parameterName + '-' + distributionName + '-timeUnit-input-' + idElementsLocal,
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
                        for: parameterName + '-' + distributionName + '-probability-input-' + idElementsLocal,
                        text: 'Probability'
                    });

                    let probabilityInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName + '-' + distributionName + '-probability-input-' + idElementsLocal,
                        placeholder: 'Probability value'
                    });
                    contentDiv.append(probabilityLabel);
                    contentDiv.append(probabilityInput);

                    let trialsLabel = jQuery('<label/>', {
                        for: parameterName + '-' + distributionName + '-trials-input-' + idElementsLocal,
                        text: 'Trials'
                    });

                    let trialsInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName + '-' + distributionName + '-trials-input-' + idElementsLocal,
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
                        id: parameterName + '-' + distributionName + '-timeUnit-input-' + idElementsLocal,
                        text: 'Time Unit',
                        style: "width: 100%"
                    });

                    let valueTimeUnitPicker = jQuery('<select/>', {
                        class: 'scenario-picker',
                        id: parameterName + '-' + distributionName + '-timeUnit-input-' + idElementsLocal,
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
                        for: parameterName + '-userDistribution-discrete-input-' + idElementsLocal,
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
                        id: parameterName + '-userDistribution-discrete-input-' + idElementsLocal
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
                        for: parameterName + '-userDistribution-discrete-input-' + idElementsLocal
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

                    let pointsLabel = jQuery('<label/>', {
                        for: parameterName + '-points-userDistribution-' + idElementsLocal,
                        text: 'Points'
                    });

                    let btnAddPoints = jQuery('<button/>', {
                        class: 'btn btn-primary btn-lg button-calculate btn-icon',
                        type: 'button',
                        id: 'btn-create-' + parameterName + '-points-userDistribution-' + idElementsLocal

                    });

                    let iElForPlusPoints = jQuery('<i/>', {
                        class: 'fa fa-plus',
                        id: 'btn-create-' + parameterName + '-points-userDistribution-' + idElementsLocal
                    });

                    btnAddPoints.append(iElForPlusPoints);
                    btnAddPoints.on("click", function () {

                        numberOfPointsGlobal++;
                        parameterValueDivCounterGlobal += 1;


                        let idElementsUserLocal = this.id.split("-")[5];
                        // console.log(idElementsUserLocal)
                        let contentPointValues = $('#' + parameterName + "-points-userDistribution-content-div-" + idElementsUserLocal);

                        let probabilityLabel = jQuery('<label/>', {
                            for: parameterName + '-userDistribution-probability' + numberOfPointsGlobal + '-input-' + parameterValueDivCounterGlobal,
                            text: 'Probability'
                        });

                        let probabilityInput = jQuery('<input/>', {
                            type: 'text',
                            class: 'form-control form-control-input',
                            id: parameterName + '-userDistribution-probability' + numberOfPointsGlobal + '-input-' + parameterValueDivCounterGlobal,
                            placeholder: 'Probability value'
                        });
                        // contentPointValues.append(probabilityLabel);
                        // contentPointValues.append(probabilityInput);

                        // setParameter(contentPointValues);

                        // let superclassOptions = ["Constant Parameters", "Distribution Parameters", "Enum Parameters", "Expression Parameters"];
                        // let singleOptionMatrix = [
                        //     ["Boolean Parameter", "DateTime Parameter", "Duration Parameter", "Floating Parameter", "Numeric Parameter",
                        //         "String Parameter"],
                        //     ["Beta Distribution", "Binomial Distribution", "Erlang Distribution", "Gamma Distribution",
                        //         "Log Normal Distribution", "Negative Exponential Distribution", "Normal Distribution",
                        //         "Poisson Distribution", "Triangular Distribution", "Truncated Normal Distribution", "Uniform Distribution",
                        //         "Weibull Distribution"],
                        //     ["Enum Parameter"],
                        //     ["Expression Parameter"]];


                        // let userValuePicker = jQuery('<select/>', {
                        //     class: "scenario-picker",
                        //     id: parameterName + "-value-user-values-picker-" + parameterValueDivCounterGlobal
                        // });

                        // userValuePicker.append($('<option>', {
                        //     value: "",
                        //     text: ""
                        // }));

                        // //creazione picker con tutti i possibili valori di ParameterValue
                        // for (let i = 0; i < superclassOptions.length; i++) {
                        //     let subGroup = $('<optgroup>', {
                        //         label: superclassOptions[i]
                        //     });
                        //     for (let j = 0; j < singleOptionMatrix[i].length; j++) {
                        //         let singleNames = singleOptionMatrix[i][j].split(" ");
                        //         let nameSplittedWithoutSpace = "";
                        //         for (let k = 0; k < singleNames.length; k++) {
                        //             nameSplittedWithoutSpace += singleNames[k];
                        //         }
                        //         subGroup.append($('<option>', {
                        //             value: nameSplittedWithoutSpace,
                        //             text: singleOptionMatrix[i][j]
                        //         }));
                        //     }
                        //     userValuePicker.append(subGroup);
                        // }


                        let pointDiv = jQuery('<div/>', {
                            style: "border-radius: 10px; border: solid 1px black; padding: 2%",
                            id: 'userDistribution-point' + numberOfPointsGlobal + '-' + parameterName + '-div-' + idElementsUserLocal + '-' + parameterValueDivCounterGlobal,
                            tabindex: '1'
                        });


                        pointDiv.append(probabilityLabel);
                        pointDiv.append(probabilityInput);

                        setParameter(pointDiv);



                        let btnTrash = jQuery('<button/>', {
                            class: 'btn btn-primary btn-lg button-calculate btn-icon',
                            type: 'button',
                            id: 'btn-deletePoint' + numberOfPointsGlobal + '-' + parameterValueDivCounterGlobal
                        });

                        let iElforTrash = jQuery('<i/>', {
                            class: 'fa fa-trash',
                            id: 'btn-deletePoint' + numberOfPointsGlobal + '-' + parameterValueDivCounterGlobal
                        });

                        btnTrash.append(iElforTrash);

                        let idLocalRemovePoint = parameterValueDivCounterGlobal;
                        let localPointsCounterGlobal = numberOfPointsGlobal;


                        btnTrash.on('click', function () {
                            // $('div[id*=scenarioParameters-property' + localPropertiesCounterGlobal + '-div-' + idLocalRemoveProperty + ']').remove();
                            pointDiv.remove();
                        });

                        btnTrash.insertAfter(pointDiv[0].childNodes[0].childNodes[0]);

                        //rimozione resultRequest per point
                        pointDiv.children().last().remove();
                        pointDiv.children().last().remove();

                        pointDiv.append(probabilityLabel);
                        pointDiv.append(probabilityInput);

                        contentPointValues.append(pointDiv);

                        // let btnTrash = jQuery('<button/>', {
                        //     class: 'btn btn-primary btn-lg button-calculate btn-icon',
                        //     type: 'button',
                        //     id: 'btn-deleteValue-' + parameterName + '-value-' + idElementsEnumLocal + '-' + parameterValueDivCounterGlobal

                        // });

                        // let iElforTrash = jQuery('<i/>', {
                        //     class: 'fa fa-trash',
                        //     id: 'btn-deleteValue-' + parameterName + '-value-' + idElementsEnumLocal + '-' + parameterValueDivCounterGlobal
                        // });

                        // btnTrash.append(iElforTrash);

                        // let idLocal = parameterValueDivCounterGlobal;

                        // btnTrash.on('click', function () {
                        //     $('div[id*=' + parameterName + '-value-div-' + idElementsEnumLocal + '-' + idLocal + ']').remove();

                        // });

                        // enumDiv.append(btnTrash);

                        // let enumContentDiv = jQuery('<div/>', {
                        //     id: 'enumParameter-' + parameterName + '-content-div-' + idElementsEnumLocal + '-' + parameterValueDivCounterGlobal
                        // });

                        // enumDiv.append(enumContentDiv);

                        // //gestione onchange del picker di enum
                        // enumValuePicker.on('change', function () {
                        //     enumContentDiv.empty();

                        //     switch (this.value) {
                        //         case "BooleanParameter": {
                        //             let valueBooleanLabel = jQuery('<label/>', {
                        //                 for: 'enumParameter-' + parameterName + '-value-booleanParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
                        //                 text: 'Value'
                        //             });

                        //             let divBoolean = jQuery('<div/>', {
                        //                 class: "onoffswitch"
                        //             });

                        //             // <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="scenarioParametersAttribute-traceOutput-input" checked></input>
                        //             let booleanCheckBox = jQuery('<input/>', {
                        //                 type: "checkbox",
                        //                 name: "onoffswitch",
                        //                 class: "onoffswitch-checkbox",
                        //                 id: 'enumParameter-' + parameterName + '-value-booleanParameterValue-input-' + idElementsEnumLocal + '-' + idLocal
                        //             });
                        //             divBoolean.append(booleanCheckBox);

                        //             let spanInner = jQuery('<span/>', {
                        //                 class: "onoffswitch-inner"
                        //             });

                        //             let spanSwitch = jQuery('<span/>', {
                        //                 class: "onoffswitch-switch"
                        //             });

                        //             let labelOnOffSwitch = jQuery('<label/>', {
                        //                 class: "onoffswitch-label",
                        //                 for: 'enumParameter-' + parameterName + '-value-booleanParameterValue-input-' + idElementsEnumLocal + '-' + idLocal
                        //             });

                        //             labelOnOffSwitch.append(spanInner);
                        //             labelOnOffSwitch.append(spanSwitch);

                        //             divBoolean.append(labelOnOffSwitch);

                        //             enumContentDiv.append(valueBooleanLabel);
                        //             enumContentDiv.append(divBoolean);

                        //             break;
                        //         }
                        //         case "DateTimeParameter": {
                        //             let dateTimeLabel = jQuery('<label/>', {
                        //                 for: 'enumParameter-' + parameterName + '-value-value-dateTimeParameter-input-' + idElementsEnumLocal + '-' + idLocal,
                        //                 text: 'Value'
                        //             });

                        //             let dateTimeInput = jQuery('<input/>', {
                        //                 type: 'text',
                        //                 class: 'form-control form-control-input',
                        //                 id: 'enumParameter-' + parameterName + '-value-value-dateTimeParameter-input-' + idElementsEnumLocal + '-' + idLocal,
                        //                 placeholder: 'DateTime value'
                        //             });
                        //             enumContentDiv.append(dateTimeLabel);
                        //             enumContentDiv.append(dateTimeInput);
                        //             break;
                        //         }
                        //         case "DurationParameter": {
                        //             let durationLabel = jQuery('<label/>', {
                        //                 for: 'enumParameter-' + parameterName + '-value-durationParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
                        //                 text: 'Value'
                        //             });

                        //             let durationInput = jQuery('<input/>', {
                        //                 type: 'text',
                        //                 class: 'form-control form-control-input',
                        //                 id: 'enumParameter-' + parameterName + '-value-durationParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
                        //                 placeholder: 'Duration value'
                        //             });
                        //             enumContentDiv.append(durationLabel);
                        //             enumContentDiv.append(durationInput);
                        //             break;
                        //         }
                        //         case "FloatingParameter": {
                        //             let floatingLabel = jQuery('<label/>', {
                        //                 for: 'enumParameter-' + parameterName + '-value-floatingParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
                        //                 text: 'Value'
                        //             });

                        //             let floatingInput = jQuery('<input/>', {
                        //                 type: 'text',
                        //                 class: 'form-control form-control-input',
                        //                 id: 'enumParameter-' + parameterName + '-value-floatingParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
                        //                 placeholder: 'Floating value'
                        //             });

                        //             enumContentDiv.append(floatingLabel);
                        //             enumContentDiv.append(floatingInput);

                        //             let floatingTimeUnitLabel = jQuery('<label/>', {
                        //                 for: 'enumParameter-value-timeUnit-floatingParameter-picker-' + idElementsEnumLocal + '-' + idLocal,
                        //                 text: 'Time Unit',
                        //                 style: "width: 100%"
                        //             });

                        //             let floatingTimeUnitPicker = jQuery('<select/>', {
                        //                 class: 'scenario-picker',
                        //                 id: 'enumParameter-value-timeUnit-floatingParameter-picker-' + idElementsEnumLocal + '-' + idLocal
                        //             });

                        //             for (let timeUnit in TimeUnit) {
                        //                 floatingTimeUnitPicker.append($('<option>', {
                        //                     value: timeUnit,
                        //                     text: timeUnit
                        //                 }));
                        //             }

                        //             enumContentDiv.append(floatingTimeUnitLabel);
                        //             enumContentDiv.append(floatingTimeUnitPicker);

                        //             break;
                        //         }
                        //         case "NumericParameter": {
                        //             let numericLabel = jQuery('<label/>', {
                        //                 for: 'enumParameter-' + parameterName + '-value-numericParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
                        //                 text: 'Value'
                        //             });

                        //             let numericInput = jQuery('<input/>', {
                        //                 type: 'text',
                        //                 class: 'form-control form-control-input',
                        //                 id: 'enumParameter-' + parameterName + '-value-numericParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
                        //                 placeholder: 'Int value'
                        //             });

                        //             enumContentDiv.append(numericLabel);
                        //             enumContentDiv.append(numericInput);

                        //             let numericTimeUnitLabel = jQuery('<label/>', {
                        //                 for: 'enumParameter-value-timeUnit-numericParameter-picker-' + idElementsEnumLocal + '-' + idLocal,
                        //                 text: 'Time Unit',
                        //                 style: "width: 100%"
                        //             });

                        //             let numericTimeUnitPicker = jQuery('<select/>', {
                        //                 class: 'scenario-picker',
                        //                 id: 'enumParameter-value-timeUnit-numericParameter-picker-' + idElementsEnumLocal + '-' + idLocal
                        //             });

                        //             for (let timeUnit in TimeUnit) {
                        //                 numericTimeUnitPicker.append($('<option>', {
                        //                     value: timeUnit,
                        //                     text: timeUnit
                        //                 }));
                        //             }

                        //             enumContentDiv.append(numericTimeUnitLabel);
                        //             enumContentDiv.append(numericTimeUnitPicker);

                        //             break;
                        //         }
                        //         case "StringParameter": {
                        //             let stringLabel = jQuery('<label/>', {
                        //                 for: 'enumParameter-' + parameterName + '-value-stringParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
                        //                 text: 'Value'
                        //             });

                        //             let stringInput = jQuery('<input/>', {
                        //                 type: 'text',
                        //                 class: 'form-control form-control-input',
                        //                 id: 'enumParameter-' + parameterName + '-value-stringParameterValue-input-' + idElementsEnumLocal + '-' + idLocal,
                        //                 placeholder: 'String value'
                        //             });
                        //             enumContentDiv.append(stringLabel);
                        //             enumContentDiv.append(stringInput);
                        //             break;
                        //         }
                        //     }
                        // });
                        // if ($('#' + buttonID).data('clicked') == true) {
                        //     console.log("sto focussando " + enumDiv[0].id)
                        //     enumDiv[0].focus();
                        // }
                    });

                    let divContentPoints = jQuery('<div/>', {
                        id: parameterName + "-points-userDistribution-content-div-" + idElementsLocal
                    });

                    contentDiv.append(pointsLabel);
                    contentDiv.append(btnAddPoints);
                    contentDiv.append(divContentPoints);

                    //TODO Fare points che è un'array di parameters senza userdistribution

                    break;
                }

                /**
                 * Sezione constant parameter
                 */
                case "BooleanParameter": {
                    let valueBooleanLabel = jQuery('<label/>', {
                        for: parameterName + '-value-value-booleanParameter-input-' + idElementsLocal,
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
                        id: parameterName + '-value-value-booleanParameter-input-' + idElementsLocal
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
                        for: parameterName + '-value-value-booleanParameter-input-' + idElementsLocal
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
                case "StringParameter": {
                    let stringLabel = jQuery('<label/>', {
                        for: parameterName + '-value-value-stringParameter-input-' + idElementsLocal,
                        text: 'Value'
                    });

                    let stringInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName + '-value-value-stringParameter-input-' + idElementsLocal,
                        placeholder: 'String value'
                    });
                    contentDiv.append(stringLabel);
                    contentDiv.append(stringInput);
                    break;

                }
                case "DurationParameter": {
                    let durationLabel = jQuery('<label/>', {
                        for: parameterName + '-value-value-durationParameter-input-' + idElementsLocal,
                        text: 'Value'
                    });

                    let durationInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName + '-value-value-durationParameter-input-' + idElementsLocal,
                        placeholder: 'Duration value'
                    });
                    contentDiv.append(durationLabel);
                    contentDiv.append(durationInput);
                    break;

                }
                case "DateTimeParameter": {
                    let dateTimeLabel = jQuery('<label/>', {
                        for: parameterName + '-value-value-dateTimeParameter-input-' + idElementsLocal,
                        text: 'Value'
                    });

                    let dateTimeInput = jQuery('<input/>', {
                        type: 'datetime-local',
                        class: 'form-control form-control-input',
                        id: parameterName + '-value-value-dateTimeParameter-input-' + idElementsLocal,
                        // placeholder: ' value'
                    });
                    contentDiv.append(dateTimeLabel);
                    contentDiv.append(dateTimeInput);
                    break;
                }
                case "FloatingParameter": {
                    let floatingLabel = jQuery('<label/>', {
                        for: parameterName + '-value-value-floatingParameter-input-' + idElementsLocal,
                        text: 'Value'
                    });

                    let floatingInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName + '-value-value-floatingParameter-input-' + idElementsLocal,
                        placeholder: 'Float value'
                    });
                    contentDiv.append(floatingLabel);
                    contentDiv.append(floatingInput);

                    let floatingTimeUnitLabel = jQuery('<label/>', {
                        for: parameterName + '-value-timeUnit-picker-' + idElementsLocal,
                        text: 'Time Unit',
                        style: "width: 100%"
                    });

                    let floatingTimeUnitPicker = jQuery('<select/>', {
                        class: 'scenario-picker',
                        id: parameterName + '-value-timeUnit-picker-' + idElementsLocal
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
                case "NumericParameter": {
                    let numericLabel = jQuery('<label/>', {
                        for: parameterName + '-value-value-numericParameter-input-' + idElementsLocal,
                        text: 'Value'
                    });

                    let numericInput = jQuery('<input/>', {
                        type: 'text',
                        class: 'form-control form-control-input',
                        id: parameterName + '-value-value-numericParameter-input-' + idElementsLocal,
                        placeholder: 'Int value'
                    });
                    contentDiv.append(numericLabel);
                    contentDiv.append(numericInput);

                    let numericTimeUnitLabel = jQuery('<label/>', {
                        for: parameterName + '-value-timeUnit-picker-' + idElementsLocal,
                        text: 'Time Unit',
                        style: "width: 100%"
                    });

                    let numericTimeUnitPicker = jQuery('<select/>', {
                        class: 'scenario-picker',
                        id: parameterName + '-value-timeUnit-picker-' + idElementsLocal
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
            id: parameterName + "-value-content-div-" + parameterValueDivCounterGlobal
        });

        let btnTrash = jQuery('<button/>', {
            class: 'btn btn-primary btn-lg button-calculate btn-icon',
            type: 'button',
            id: 'btn-deleteParameter-' + parameterName + '-value-' + parameterValueDivCounterGlobal

        });

        let iElforTrash = jQuery('<i/>', {
            class: 'fa fa-trash',
            id: 'btn-deleteParameter-' + parameterName + '-value-' + parameterValueDivCounterGlobal
        });

        btnTrash.append(iElforTrash);

        let idLocal = parameterValueDivCounterGlobal;

        // console.log(parameterName);
        btnTrash.on('click', function () {
            let divToDelete = $('#' + parameterName + '-value-div-' + idLocal)
            // console.log("div");
            // console.log(divToDelete)

            divToDelete.remove();
        });

        valueDiv.append(parameterValuePicker);
        valueDiv.append(btnTrash);
        valueDiv.append(valueContentDiv);

        valuesSection.append(valueDiv);

        // console.log("div")
        // console.log(valueDiv[0])

        // console.log("aooo")
        // console.log( $('#' + buttonID).data('clicked') )
        if ($('#' + buttonID).data('clicked') == true) {
            // console.log("sto focussando " + valueDiv[0].id)
            valueDiv[0].focus();
        }
    });

    parameter.append(valueLabel);
    parameter.append(btnAdd);

    let valuesSection = jQuery('<div/>', {
        id: parameterName + '-values-section'
    });

    parameter.append(valuesSection);

    if (!parameterName.match(/property/g) || parameter[0].id.split('-')[0] == "scenarioParameters") {
        let resultRequestLabel = jQuery('<label/>', {
            style: 'width: 100%',
            text: 'Result Request',
            id: parameterName + '-label-resultRequest-picker-' + parameterValueDivCounterGlobal
        });

        let resultRequestPicker = jQuery('<select/>', {
            class: 'scenario-picker',
            id: parameterName + '-resultRequest-picker-' + parameterValueDivCounterGlobal
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
        // console.log("elem aperto")
        //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
        $("#elem-par-btn").click();
    }
    if ($("#button-activities").data('clicked') == true) {
        // console.log("activiti aperto")
        //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
        $("#button-activities").click();
    }
    if ($("#button-gateways").data('clicked') == true) {
        // console.log("gatewy aperto")
        //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
        $("#button-gateways").click();
    }
    if ($("#button-events").data('clicked') == true) {
        // console.log("events aperto")
        //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
        $("#button-events").click();
    }
    if ($("#button-connectingObjects").data('clicked') == true) {
        // console.log("connobj aperto")
        //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
        $("#button-connectingObjects").click();
    }
    if ($("#button-resources").data('clicked') == true) {
        // console.log("resc aperto")
        //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
        $("#button-resources").click();
    }
    if ($("#scen-par-btn").data('clicked') == true) {
        // console.log("scenPAr aperto")
        //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
        $("#scen-par-btn").click();
    }
    if ($("#calendar-btn").data('clicked') == true) {
        // console.log("calendar aperto")
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

    // console.log("prima popolare scenario attribute")
    populateScenarioAttributesForm(scenarios, scenarioSelected); //popoliamo il form con gli attributi bpsim di scenario
    // console.log("dopo popolare scenario attribute")

    // console.log("prima popolare element")
    populateScenarioElementsForm(scenarios, scenarioSelected); //popoliamo il form con gli elementi bpsim di scenario
    // console.log("dopo popolare element")
}


// * Funzione di supporto per popolare gli attributi di Scenario
function populateScenarioAttributesForm(scenarios, scenarioSelected) {

    //TODO gestire caso in cui si debba creare bspim da zero
    if (scenarioSelected != "") {

        scenarioSelected -= 1;

        // console.log("prima di id")
        let idScenarioInput = $('#scenario-id-input');
        let idScenarioVal = scenarios[scenarioSelected].id;
        setField(idScenarioInput, idScenarioVal);
        // console.log("dopo di id")

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

        let inheritsScenarioInput = $('#scenario-inherits-picker');
        let inheritsScenarioVal = scenarios[scenarioSelected].inherits;
        // console.log("elemn by id");
        // console.log(inheritsScenarioInput)
        // inheritsScenarioInput.value ="S3";
        if (inheritsScenarioVal != undefined) {
            inheritsScenarioInput.val(inheritsScenarioVal);
        } else {
            inheritsScenarioInput.val("");
        }
        // setField(inheritsScenarioInput, inheritsScenarioVal);
    } else {
        //TODO valutare se settare defaults e considerare aggiunta scenario
    }
}

// * Funzione di supporto per popolare gli attributi di Scenario
function populateScenarioElementsForm(scenarios, scenarioSelected) {
    // console.log("scenario numero " + scenarioSelected);
    if (scenarioSelected != "") {
        scenarioSelected -= 1;
        // console.log("prima popolare scenario parameter");
        populateScenarioParametersForm(scenarios[scenarioSelected].scenarioParameters);
        // console.log("dopo popolare scenario parameter");

        // console.log("prima popolare element parameter");
        populateElementParametersForm(scenarios[scenarioSelected].elementParameters);
        // console.log("dopo popolare element parameter");

        // console.log("prima popolare calendar");
        populateCalendarForm(scenarios[scenarioSelected].calendar);
        // console.log("dopo popolare calendar");

    } else {
        //TODO gestire caso in cui si debba creare bspim da zero
    }
}

function populateElementParametersForm(elementParameters) {

    // contiene anche quelli della sezione resources
    let fields = $("input[id*='$$']");

    // console.log("fields")
    // console.log(fields)

    for (let i = 0; i < fields.length; i++) {
        let elRefTot = fields[i].id.split("$$")[1];
        let contained = false;
        for (let j = 0; j < elementParameters.length; j++) {
            if (elRefTot == elementParameters[j].elementRef) {

                contained = true;
                let idElementVal = elementParameters[j].id;
                setField($(fields[i]), idElementVal);

                let keys = Object.keys(elementParameters[j]);
                let values = Object.values(elementParameters[j]);

                let div = $("div[id*='$$" + elRefTot + "$$']");
                // console.log("div")
                // console.log(div)
                let childNodes = div[0].childNodes;
                let indexOfButton = /*childNodes.length -*/ 1;

                for (let k in keys) {
                    if (keys[k] == "_controlParameters" || keys[k] == "_timeParameters" || keys[k] == "_costParameters" ||
                        keys[k] == "_resourceParameters" || keys[k] == "_propertyParameters" || keys[k] == "_priorityParameters") {
                        let innerKeys;
                        let innerValues;

                        // ci sono alcuni elementi che sono prima array
                        if (keys[k] == "_propertyParameters" && values[k].length > 0) {
                            innerKeys = Object.keys(values[k][0])
                            innerValues = Object.values(values[k][0]);
                        } else {
                            innerKeys = Object.keys(values[k])
                            innerValues = Object.values(values[k]);
                        }

                        for (let key = 0; key < innerKeys.length; key++) {
                            // * object.value toglie gli undefined, ma non gli array lunghi 0, quindi role va gestito a parte

                            if (!(innerKeys[key] == "_role" && innerValues[key].length == 0)) {
                                childNodes[indexOfButton].click();
                                let pickerValue = innerKeys[key].split('_')[1];
                                pickerValue = pickerValue.charAt(0).toUpperCase() + pickerValue.slice(1);
                                // console.log("valore")
                                // console.log(pickerValue)
                                let select = childNodes[childNodes.length - 1].childNodes[0].id;
                                // console.log("select")
                                // console.log(childNodes[childNodes.length - 1].childNodes[0])
                                if (select.includes("$$")) {
                                    select = $.escapeSelector(select);
                                }
                                $('#' + select).val(pickerValue);
                                $('#' + select).change();
                                let divToPassID = childNodes[childNodes.length - 1].childNodes[2].id;
                                if (divToPassID.includes("$$")) {
                                    divToPassID = $.escapeSelector(divToPassID);
                                }
                                if ((keys[k] == "_propertyParameters" && pickerValue == "Property") ||
                                    (innerKeys[key] == "_role" && innerValues[key].length != 0)) {
                                    setPropertyField($('#' + divToPassID)[0], innerValues[key]);
                                } else {

                                    setParameterField($('#' + divToPassID)[0], innerValues[key]);

                                }
                            }



                        }
                    }
                }
            }
        }

        if (!contained) {
            setField($(fields[i]), undefined);
        }
    }
}


function setPropertyField(inputElement, obj) {
    // console.log("cose in ingresso");
    // console.log(inputElement);
    // console.log(obj);
    let childNodes = inputElement.childNodes;
    if (obj.length > 0) {
        let indexOfButton = childNodes.length - 1;
        for (let i in obj) {
            childNodes[indexOfButton].click();

            let graphicalElement = childNodes[childNodes.length - 1]
            setParameterField(graphicalElement, obj[i]);

            let graphicalElementChild = graphicalElement.childNodes
            if (obj[i].name != undefined) {
                graphicalElementChild[graphicalElementChild.length - 1 - 2].value = obj[i].name;
            }
            if (obj[i].type != undefined) {
                graphicalElementChild[graphicalElementChild.length - 1].value = obj[i].type;
            }
        }
    }
}

function setParameterField(inputElement, obj) {

    // console.log("elemento");
    // console.log(inputElement)
    // console.log("oggetto")
    // console.log(obj)

    let childNodes = inputElement.childNodes;

    if (obj != undefined) {
        for (let i in obj.value) {
            inputElement.childNodes[2].click();
            let picker = inputElement.childNodes[3].childNodes[i].childNodes[0];
            let divCurrent = inputElement.childNodes[3].childNodes[i].childNodes[2];

            let pickerID = picker.id;
            if (pickerID.includes("$$")) {
                pickerID = $.escapeSelector(pickerID);
            }

            $('#' + pickerID).val(obj.value[i].getType());


            $('#' + pickerID).change();

            let divCurrentID = divCurrent.id;
            if (divCurrentID.includes('$$')) {
                divCurrentID = $.escapeSelector(divCurrentID);
            }
            let divElements = $('#' + divCurrentID)[0].childNodes;

            let divElementsWithoutLabels = [];
            for (let j in divElements) {
                if (j % 2 == 1) {
                    divElementsWithoutLabels.push(divElements[j]);
                }
            }
            for (let j = 0; j < divElementsWithoutLabels.length; j++) { //skip labels
                let attributeName;
                // bisogna distinguere i punti in cui si ha l' 'on/off' switch
                if (divElementsWithoutLabels[j].tagName == "DIV") {
                    attributeName = divElementsWithoutLabels[j].childNodes[0].id.split('-')[2];
                    if (obj.value[i][attributeName] == "true") {
                        $('#' + divElementsWithoutLabels[j].childNodes[0].id).prop('checked', true);
                    } else {
                        $('#' + divElementsWithoutLabels[j].childNodes[0].id).prop('checked', false);
                    }
                } else {
                    attributeName = divElementsWithoutLabels[j].id.split('-')[2];
                    let value = obj.value[i][attributeName];
                    if (value != undefined) {
                        if (attributeName == "validFor") {
                            // console.log("dentro " + i);
                            // console.log(divElementsWithoutLabels[j]);
                            // console.log(value[0])
                            // $('#'+$.escapeSelector(divElementsWithoutLabels[j].id)).val(value[0]);
                            divElementsWithoutLabels[j].value = value[0];

                        } else {
                            divElementsWithoutLabels[j].value = value;
                        }
                    }
                }
            }
            if (divElements[divElements.length - 1].id.includes("enum")) {
                let enumValues = obj.value[i]["value"];
                // let enumContent = divElements[divElements.length-1].childNodes;
                for (let j = 0; j < enumValues.length; j++) {
                    divElements[divElements.length - 2].click();
                    let singleEnumDiv = divElements[divElements.length - 1].childNodes[j];

                    singleEnumDiv.childNodes[0].value = enumValues[j].getType();
                    $('#' + $.escapeSelector(singleEnumDiv.childNodes[0].id)).trigger('change');
                    let valuesSingleEnumContent = singleEnumDiv.childNodes[2].childNodes;
                    for (let k = 1; k < valuesSingleEnumContent.length; k = k + 2) {
                        let attributeName;
                        // bisogna distinguere i punti in cui si ha l' 'on/off' switch
                        if (valuesSingleEnumContent[k].tagName == "DIV") {
                            attributeName = valuesSingleEnumContent[k].childNodes[0].id.split('-')[2];
                            if (enumValues[j][attributeName] == "true") {
                                $('#' + $.escapeSelector(valuesSingleEnumContent[k].childNodes[0].id)).prop('checked', true);
                            } else {
                                $('#' + $.escapeSelector(valuesSingleEnumContent[k].childNodes[0].id)).prop('checked', false);
                            }
                        } else {
                            attributeName = valuesSingleEnumContent[k].id.split('-')[2];
                            let value = enumValues[j][attributeName];

                            if (value != undefined) {
                                valuesSingleEnumContent[k].value = value;
                            }
                        }
                    }
                }
            } else if (divElements[divElements.length - 1].id.includes("userDistribution")) {
                // console.log("palomaaaaaaaaaaa")
                // console.log(obj.value[i]);
                let points = obj.value[i].points;
                for (let j in points) {
                    divElements[divElements.length - 2].click();

                    let singlePointDiv = divElements[divElements.length - 1].childNodes[j]

                    // fase popolamento ricorsivo di values
                    let valuesObj = points[j]["value"];
                    for (let k in valuesObj) {
                        singlePointDiv.childNodes[2].click();
                        // console.log("singlePointDiv")
                        // console.log(singlePointDiv)

                        let singleValueDiv = singlePointDiv.childNodes[singlePointDiv.childNodes.length - 3].childNodes[k]
                        singleValueDiv.childNodes[0].value = valuesObj[k].getType();
                        $('#' + $.escapeSelector(singleValueDiv.childNodes[0].id)).change();

                        let valueFields = singleValueDiv.childNodes[2].childNodes;

                        for (let h = 1; h < valueFields.length; h = h + 2) {
                            // for (let k = 1; k < valuesSingleEnumContent.length; k = k + 2) {
                            let attributeName;
                            // bisogna distinguere i punti in cui si ha l' 'on/off' switch
                            if (valueFields[h].tagName == "DIV") {
                                attributeName = valueFields[h].childNodes[0].id.split('-')[2];

                                if (valuesObj[k][attributeName] == "true") {
                                    $('#' + $.escapeSelector(valueFields[h].childNodes[0].id)).prop('checked', true);
                                } else {
                                    $('#' + $.escapeSelector(valueFields[h].childNodes[0].id)).prop('checked', false);
                                }
                            } else {
                                attributeName = valueFields[h].id.split('-')[2];
                                let value = valuesObj[k][attributeName];

                                if (value != undefined) {
                                    if (attributeName == "validFor") {
                                        valueFields[h].value = value[0];

                                    } else {
                                        valueFields[h].value = value;
                                    }
                                }
                            }
                            // console.log("attributename");
                            // console.log(attributeName);
                        }

                        if (valueFields[valueFields.length - 1].id.includes("enum")) {
                            let enumValues = valuesObj[k]["value"];
                            // let enumContent = divElements[divElements.length-1].childNodes;
                            for (let j = 0; j < enumValues.length; j++) {
                                valueFields[valueFields.length - 2].click();
                                let singleEnumDiv = valueFields[valueFields.length - 1].childNodes[j];

                                singleEnumDiv.childNodes[0].value = enumValues[j].getType();
                                $('#' + $.escapeSelector(singleEnumDiv.childNodes[0].id)).trigger('change');
                                let valuesSingleEnumContent = singleEnumDiv.childNodes[2].childNodes;
                                for (let k = 1; k < valuesSingleEnumContent.length; k = k + 2) {
                                    let attributeName;
                                    // bisogna distinguere i punti in cui si ha l' 'on/off' switch
                                    if (valuesSingleEnumContent[k].tagName == "DIV") {
                                        attributeName = valuesSingleEnumContent[k].childNodes[0].id.split('-')[2];
                                        if (enumValues[j][attributeName] == "true") {
                                            $('#' + $.escapeSelector(valuesSingleEnumContent[k].childNodes[0].id)).prop('checked', true);
                                        } else {
                                            $('#' + $.escapeSelector(valuesSingleEnumContent[k].childNodes[0].id)).prop('checked', false);
                                        }
                                    } else {
                                        attributeName = valuesSingleEnumContent[k].id.split('-')[2];
                                        let value = enumValues[j][attributeName];

                                        if (value != undefined) {
                                            valuesSingleEnumContent[k].value = value;
                                        }
                                    }
                                }
                            }
                        }

                        // console.log("valuesObj")
                        // console.log(valuesObj[k])


                    }

                    // popolamento field probability
                    singlePointDiv.childNodes[singlePointDiv.childNodes.length - 1].value = points[j]["probability"];

                    // console.log("singlepointdiv")
                    // console.log(singlePointDiv);
                    // points[j]["probability"] 
                    // let singlePointDiv = divElements[divElements.length - 1].childNodes[j];
                    // console.log(singlePointDiv);
                }
            }

        }

        if (obj.resultRequest.length > 0) {
            let offset = 0;
            if (inputElement.id.includes("scenarioParameters-property")) {
                offset = 4;
            }
            // console.log("result")
            // console.log(childNodes[childNodes.length-1-offset])
            childNodes[(childNodes.length) - 1 - offset].value = obj.resultRequest[0];
        }
    } else {
        childNodes[(childNodes.length) - 1].value = "min"
    }

}

function populateScenarioParametersForm(scenarioParameters) {
    //TODO controllare al cambio del picker
    let startScenParDiv = $('#scenarioParameters-start-div');
    let startScenParVal = scenarioParameters.start;
    setParameterField(startScenParDiv[0], startScenParVal);

    let durationScenParDiv = $('#scenarioParameters-duration-div');
    let durationScenParVal = scenarioParameters.duration;
    setParameterField(durationScenParDiv[0], durationScenParVal);

    let warmupScenParDiv = $('#scenarioParameters-warmup-div');
    let warmupScenParVal = scenarioParameters.warmup;
    setParameterField(warmupScenParDiv[0], warmupScenParVal);

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


    // * sezione property parameters
    let propertyScenParDiv = $('#scenarioParameters-property-propertyParameters-div');
    let queueLengthScenParDiv = $('#scenarioParameters-queueLength-propertyParameters-div');
    if (scenarioParameters.propertyParameters.length > 0) {
        let propertyScenParVal = scenarioParameters.propertyParameters[0].property;
        // console.log("mino")
        // console.log(propertyScenParVal)
        setPropertyField(propertyScenParDiv[0], propertyScenParVal);
        // console.log("mano")
        let queueLengthScenParVal = scenarioParameters.propertyParameters[0].queueLength;
        setParameterField(queueLengthScenParDiv[0], queueLengthScenParVal);
    } else {
        $("select[id^=queueLength-resultRequest-picker]")[0].value = "min";
    }

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
            // console.log("changeIdCalendarVecchi")
            updateValidFor();
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
            idListGlobal.splice(idListGlobal.indexOf(calId), 1);
            // console.log("deleteCalendarVecchi")
            updateValidFor()
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
            val: calName,
            placeholder: "Calendar name"
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
            val: calCalendar,
            placeholder: "Calendar content"

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
        while (newCalId == "" || idListGlobal.includes(newCalId)) {
            if (newCalId == "") {
                newCalId = prompt("Insert Calendar ID (It can not be empty):");
            } else if (idListGlobal.includes(newCalId)) {
                newCalId = prompt("ID: " + newCalId + " is not availaible. Insert a new Calendar ID:");
            }
        }
        if (newCalId != null) {
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
                id: 'calendar-' + newCalId + '-id-input',
                value: newCalId
            });
            inputCalID.on('change', function () {
                saveCalendarField(this, true);
                updateValidFor();
            });

            let btnTrash = jQuery('<button/>', {
                class: 'btn btn-primary btn-lg button-calculate btn-icon',
                type: 'button',
                id: 'btn-delete-calendar-' + newCalId

            });

            let iEl = jQuery('<i/>', {
                class: 'fa fa-trash',
                id: 'icon-btn-delete-calendar-' + newCalId
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
                idListGlobal.splice(idListGlobal.indexOf(newCalId), 1);
                updateValidFor();

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
                id: 'calendar-' + newCalId + '-name-input',
                placeholder: "Calendar name"
            });
            inputCalName.on('change', function () {
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
                id: 'calendar-' + newCalId + '-calendar-input',
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
            if (inputCalName.val() == "") {
                calendarTemp.name = undefined;

            } else {
                calendarTemp.name = inputCalName.val();

            }
            calendarTemp.calendar = inputCalCalendar.val();

            calendarsCreatedGlobal.push(calendarTemp);
            calendarsCreatedIDCounterGlobal += 1;
            updateValidFor();
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
                    window.alert("ERROR: ID: " + value + " is already used")
                }, 10);
                validName = false;
                $('#scenario-id-input').val(dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].id); //reset scenario id
            }
        }
        if (value == "") {
            setTimeout(function () {
                window.alert("ERROR: A scenario must have an ID")
            }, 10);
            validName = false;
            $('#scenario-id-input').val(dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].id); //reset scenario id
        }
        console.log(idListGlobal)
    }

    if (validName) {
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
        let notNumber = false;
        if (fieldName == "replication" || fieldName == "seed") {
            if (!value.match(/^\d+$/)) {//Number.isNaN(parseInt(value,10))){
                setTimeout(function () {
                    window.alert("ERROR: You must insert an int value in replications");
                }, 10);
                if (fieldName == "replication") {
                    $('#scenarioParametersAttribute-replication-input').val(dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].scenarioParameters.replication);
                }
                if (fieldName == "seed") {
                    $('#scenarioParametersAttribute-seed-input').val(dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].scenarioParameters.seed);
                }
                notNumber = true;
            } else {
                value = parseInt(value, 10);
            }
        }
        if (value == "") {
            value = undefined;
        }
        if (!notNumber) {
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
                window.alert("ERROR: ID: " + value + " is already used")
            }, 10);
            validName = false;
            // $(document.getElementById(field.id)).val(undefined); //TODO reset value in input (o undefined o vecchio valore)
        }
    }

    // if(value == ""){
    //     validName = false;
    // }

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
                            if (value == "") {
                                idListGlobal.splice(j, 1);
                                elementParameters[i][fieldName] = undefined;
                            } else {
                                idListGlobal[j] = value;
                            }
                        }
                    }
                }
            }
        }
        if (!found) {
            let elementParametersToAdd = [];
            let elemPar = new ElementParameters();
            if (value != "") {
                elemPar[fieldName] = value;
                elemPar.elementRef = elRef;
                elementParametersToAdd.push(elemPar);
                dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].elementParameters = elementParametersToAdd;
                idListGlobal.push(value);
            }
        }

    } else {
        let found = false;
        for (let i = 0; i < elementParameters.length; i++) {
            if (elementParameters[i].elementRef == elRef) {
                found = true;
                let oldValue = elementParameters[i][fieldName];
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
    // console.log("funzioneeeeeeeeee")

    let value = field.value;

    let calendarID = field.id.split("-")[1];
    let fieldName = field.id.split("-")[2];
    // console.log(field);

    let calendarsExisting = dataTreeObjGlobal.scenario[currentScenarioGlobal - 1].calendar;
    let calendarsNew = calendarsCreatedGlobal;
    // console.log(calendarsExisting);
    // console.log(calendarsNew);

    let flagIdUsed = false;

    if (fieldName == "id") {
        for (let i = 0; i < idListGlobal.length; i++) {
            if (idListGlobal[i] == value) {
                for (let j = 0; j < calendarsExisting.length; j++) {
                    if (calendarsExisting[j].id == calendarID) {
                        //silly timeout per far apparire l'errore in scrittura sull'input field
                        setTimeout(function () {
                            window.alert("ERROR: ID: " + value + " is already used")
                        }, 1);
                        flagIdUsed = true;
                        $('#calendar-' + calendarID + '-id-input').val(calendarsExisting[j][fieldName]); //reset value in iput
                    }
                }
            }
        }

        if (value == "") {
            for (let j = 0; j < calendarsExisting.length; j++) {
                if (calendarsExisting[j].id == calendarID) {
                    //silly timeout per far apparire l'errore in scrittura sull'input field
                    setTimeout(function () {
                        window.alert("ERROR: A calendar must have an ID")
                    }, 1);
                    flagIdUsed = true;
                    $('#calendar-' + calendarID + '-id-input').val(calendarsExisting[j][fieldName]); //reset value in iput
                }
            }
        }

        for (let i = 0; i < idListGlobal.length; i++) {
            if (idListGlobal[i] == value) {
                for (let j = 0; j < calendarsNew.length; j++) {
                    if (calendarsNew[j].id == calendarID) {
                        //silly timeout per far apparire l'errore in scrittura sull'input field
                        setTimeout(function () {
                            window.alert("ERROR: ID: " + value + " is already used")
                        }, 1);
                        flagIdUsed = true;
                        $('#calendar-' + calendarID + '-id-input').val(calendarsNew[j][fieldName]); //reset value in iput
                    }
                }
            }
        }

        if (value == "") {
            for (let j = 0; j < calendarsNew.length; j++) {
                if (calendarsNew[j].id == calendarID) {
                    //silly timeout per far apparire l'errore in scrittura sull'input field
                    setTimeout(function () {
                        window.alert("ERROR: A calendar must have an ID")
                    }, 1);
                    flagIdUsed = true;
                    $('#calendar-' + calendarID + '-id-input').val(calendarsNew[j][fieldName]); //reset value in iput
                }
            }
        }
    }

    if (!flagIdUsed) {
        if (isNew) {
            for (let i = 0; i < calendarsNew.length; i++) {
                if (calendarsNew[i].id == calendarID) {
                    if (value != "") {
                        calendarsNew[i][fieldName] = value;
                    } else {
                        calendarsNew[i][fieldName] = undefined;
                    }
                    console.log(calendarsNew[i]);
                }
            }
        } else {
            // console.log("modifica");

            // console.log(calendarExisting);
            for (let i = 0; i < calendarsExisting.length; i++) {
                if (calendarsExisting[i].id == calendarID) {
                    if (value != "") {
                        calendarsExisting[i][fieldName] = value;
                    } else {
                        calendarsExisting[i][fieldName] = undefined;
                    }
                    console.log(calendarsExisting[i]);
                }
            }

        }
        if (fieldName == "id") {
            for (let i = 0; i < idListGlobal.length; i++) {
                if (idListGlobal[i] == calendarID) {
                    idListGlobal[i] = value;
                }
            }
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

        for (let j = 0; j < node.attributes.length; j++) {

            // if seguente serve a creare un array di calendar poiché validFor pretende un array di calendar
            if (node.attributes[j].localName === "validFor" || node.attributes[j].localName === "quantity") {
                let tempArray = [];
                tempArray.push(node.attributes[j].value);
                nodeObject[node.attributes[j].localName] = tempArray;
            } else {

                nodeObject[node.attributes[j].localName] = node.attributes[j].value;
            }
        }

        // if per salvare il contenuto di testo del tag xml calendar
        if (node.localName === "Calendar") {
            nodeObject["calendar"] = node.textContent;
        }
    }

    return nodeObject
}

// * Funzione ricorsiva che popola una struttura dati ad albero in base ai valori degli elementi della simulazione
// * ritorna un array di 2 elementi, uno è il nodo, l'altro è il nodo sotto forma di oggetto
function buildDataTree(nodo, nodoObject) {

    let numFigli = nodo.childElementCount;
    let nodoFiglio;

    let childNodes = nodo.childNodes;
    let temp = [];
    // for (let i = 0; i < childNodes.length; i++) {
    //     // * togliamo dai figli quelli che hanno campo "#text" poiche sarebbero gli invii dell'XML
    //     if (childNodes[i].nodeName == '#text') {
    //         nodo.removeChild(childNodes[i]);
    //     }
    // }

    // childNodes = Array.from(childNodes);


    for (let i = 0; i < childNodes.length; i++) {
        // * togliamo dai figli quelli che hanno campo "#text" poiche sarebbero gli invii dell'XML
        if (childNodes[i].nodeName != '#text') {
            temp.push(childNodes[i]);
        }
    }
    childNodes = temp;
    let haveMoreValue = false;
    let moreValuesTempArray = [];
    while (numFigli > 0) {

        let childToPass = childNodes.shift(); // * shift = pop ma fatta in testa
        nodoFiglio = buildDataTree(childToPass, createObj(childToPass));
        let nameAttr = nodoFiglio[0].localName.charAt(0).toLowerCase() + nodoFiglio[0].localName.slice(1);

        // console.log("nodoFiglio di ")
        // console.log(nodo)
        // console.log(nodoFiglio)


        if (isParameter(nodoFiglio[0].localName)) {

            let parameterFieldsToDelete = [];
            for (let i = 0; i < Object.keys(nodoFiglio[1]).length; i++) {
                // salvo tutti quei parametri che si sono creati in più ovvero quelli che non iniziano per '_'
                if (Object.keys(nodoFiglio[1])[i].charAt(0) != "_" /*&& Object.keys(nodoFiglio[1])[i] != "name"*/) {
                    let temp = nodoFiglio[1][Object.keys(nodoFiglio[1])[i]];
                    parameterFieldsToDelete.push(temp);
                }
            }

            if (parameterFieldsToDelete.length > 0) {
                if (parameterFieldsToDelete.length > 1 || parameterFieldsToDelete[0].length > 1) {
                    let newParameterFieldsToDelete = []
                    for (let i in parameterFieldsToDelete) {
                        for (let j in parameterFieldsToDelete[i]) {
                            newParameterFieldsToDelete.push(parameterFieldsToDelete[i][j]);
                        }
                    }
                    parameterFieldsToDelete = newParameterFieldsToDelete;
                }
            }



            let tempResultRequest = nodoFiglio[1].resultRequest;

            let tempName;
            let tempType;

            if (nodoFiglio[0].localName == "Property") {
                tempName = nodoFiglio[1].name;
                tempType = nodoFiglio[1].type;
            }

            nodoFiglio[1] = new factory[nodoFiglio[0].localName]();
            nodoFiglio[1].resultRequest = tempResultRequest;
            nodoFiglio[1].value = parameterFieldsToDelete;
            if (nodoFiglio[0].localName == "Property") {
                nodoFiglio[1].name = tempName;
                nodoFiglio[1].type = tempType;
            }
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

                if (nodoFiglio[0].localName == "UserDistributionDataPoint") {


                    let newTempArray = [];

                    for (let i = 0; i < tempArray.length; i++) {
                        let singlePoint = tempArray[i];
                        let nameToEliminate = [];
                        // console.log(Object.keys(singlePoint))
                        for (let j = 0; j < Object.keys(singlePoint).length; j++) {
                            if (Object.keys(singlePoint)[j].charAt(0) != "_") {

                                if (singlePoint[Object.keys(singlePoint)[j]][0] == undefined) {
                                    singlePoint["value"].push(singlePoint[Object.keys(singlePoint)[j]]);
                                } else {
                                    singlePoint["value"].push(singlePoint[Object.keys(singlePoint)[j]][0]);
                                }
                                nameToEliminate.push(Object.keys(singlePoint)[j])
                            }
                        }
                        for (let j in nameToEliminate) {
                            delete singlePoint[nameToEliminate[j]];
                        }
                        newTempArray.push(singlePoint);
                    }
                    nodoObject["points"] = newTempArray;
                } else {
                    nodoObject[nameAttr] = tempArray;
                }
            } else {
                if (nameAttr.includes("Distribution") ||
                    isConstantParameter(nameAttr) ||
                    nameAttr.includes("Expression") ||
                    nameAttr.includes("Enum")) {

                    haveMoreValue = true;
                    moreValuesTempArray.push([nameAttr, nodoFiglio[1]]);
                } else {

                    nodoObject[nameAttr] = nodoFiglio[1];
                }
            }
        }
        numFigli--;
    }
    if (haveMoreValue) {
        if (moreValuesTempArray.length != 1) {
            nodoObject[moreValuesTempArray[0][0]] = []
            nodoObject[moreValuesTempArray[0][0]].push(moreValuesTempArray[0][1])
            for (let i in moreValuesTempArray) {
                if (i != 0) {
                    if (moreValuesTempArray[i][0] == moreValuesTempArray[i - 1][0]) {
                        nodoObject[moreValuesTempArray[i][0]].push(moreValuesTempArray[i][1])
                    } else {
                        nodoObject[moreValuesTempArray[i][0]] = []
                        nodoObject[moreValuesTempArray[i][0]].push(moreValuesTempArray[i][1])
                    }
                }
            }
        } else {
            nodoObject[moreValuesTempArray[0][0]] = moreValuesTempArray[0][1]
        }

    }

    let nodo_nodoObj = [];
    nodo_nodoObj.push(nodo);
    nodo_nodoObj.push(nodoObject);
    return nodo_nodoObj;
}

function isConstantParameter(parameterName) {
    let constantParameters = ["stringParameter", "numericParameter", "floatingParameter", "booleanParameter",
        "durationParameter", "dateTimeParameter"];

    return constantParameters.includes(parameterName);
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
        "UnitCost", "Duration", "Property", "EnumParameter"];

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
            $('#js-simulation').css('display', 'unset');
            $('#sim-buttons-section').css('display', 'inline-flex');
            $('.horizontal-wrapper').css('display', 'flex');

            // * richiama la funzione openDiagram
            xmlGlobal = xml;
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


    // //TODO remove these line 
    // $('#js-drop-zone').css('display', 'none');
    // $('#js-canvas').css('display', 'block');


    // // xmlGlobal=firstdiagramXML;
    // // xmlGlobal=bpmn_example1;
    // // xmlGlobal=bpmn_example2;
    // // xmlGlobal=bpmn_example3;
    // // xmlGlobal=bpmn_example4;
    // // xmlGlobal=bpmn_example5;
    // // xmlGlobal=bpmn_example6;
    // xmlGlobal = bpmn_example7;
    // openDiagram();
    // // * END Remove


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
                e.element.type.toLowerCase().includes("transaction") ||
                e.element.type.toLowerCase().includes("callactivity") ||
                e.element.type.toLowerCase().includes("eventsubprocess")) {
                // * gestione dell'apertura dei bottoni
                if ($("#elem-par-btn").data('clicked') == false) {
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#elem-par-btn").click();
                }

                if ($("#button-activities").data('clicked') == false) {
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#button-activities").click();
                }
            } else if (e.element.type.toLowerCase().includes("gateway")) {
                // * gestione dell'apertura dei bottoni
                if ($("#elem-par-btn").data('clicked') == false) {
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#elem-par-btn").click();
                }
                if ($("#button-gateways").data('clicked') == false) {
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#button-gateways").click();
                }
            } else if (e.element.type.toLowerCase().includes("event")) {
                // * gestione dell'apertura dei bottoni
                if ($("#elem-par-btn").data('clicked') == false) {
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#elem-par-btn").click();
                }
                if ($("#button-events").data('clicked') == false) {
                    //al click di un elemento del bpmn apro la sezione bpsim dedicata (elem param e task/gateway/etc.)
                    $("#button-events").click();
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

            console.log($("input[id*='$$" + elemRefClicked + "$$']"));
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