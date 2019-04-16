import firstdiagramXML from '../resources/firstDiagram.bpmn';
import carRepairProcessXML from '../resources/CarRepairProcess.bpmn';
import {DateTime, DurationParameter} from "./types/parameter_type/ConstantParameter";
import {BPSimData} from "./types/scenario/BPSimData";
import {Scenario} from "./types/scenario/Scenario";
import {factory} from "./types/factory";
import {ResultType} from "./types/parameter_type/ResultType";
import {Parameter} from "./types/parameter_type/Parameter";


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
        // $('.djs-container').css('overflow', 'auto');

        // xmlParsing(xml);
        createFormFields(xml);
        xmlParsingToLeaves(xml);

        // structurePopulation();
    });
}

function createFormFields(xml) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, "text/xml");

    // const bpmnPrefix = definitionsTag[0].prefix;

    const bpmnNamespaceURI = "http://www.omg.org/spec/BPMN/20100524/MODEL";
    const bpsimNamespaceURI = "http://www.bpsim.org/schemas/1.0";


    let bpmnProcessFields = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "process");
    console.log(bpmnProcessFields[0]);

    var nodes = Array.prototype.slice.call(bpmnProcessFields[0].getElementsByTagName("*"), 0);
    console.log(nodes);

    var nodesTask = [];
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].localName == "task") {

            nodesTask.push(nodes[i]);
        }
        // console.log(nodes[i].localName);
    }
    console.log(nodesTask);

    let taskForm = $('#task-form');

    let a1 = jQuery('<label/>', {
        for: 'vendor1',
        text: 'Vendor1'
    });

    let b1 = jQuery('<input/>', {
        type: 'text',
        class: 'form-control form-control-input',
        id: 'vendor1',
        value: 'Caputo & Lazazzera'
    });

    taskForm.css('display', 'block');

    let a2 = $("<label for=\"vendor2\">Vendor2</label>");

    let b2 = $("<input type=\"text\" class=\"form-control form-control-input\" id=\"vendor2\" value=\"Caputo & Lazazzera\">");


    taskForm.append(a1);
    taskForm.append(b1);

    taskForm.append(a2);
    taskForm.append(b2);

}


function structurePopulation() {
    let d1 = new DateTime(2019, 1, 5);
    let d2 = new DateTime(2019, 1, 10);

    let sc = new Scenario("1", "ciao", "descr", d1, d2, "Pippo");
    console.log(sc);

    let sc2 = new Scenario("2", "ciao", "provola", d1, d2, "Pippo");
    console.log(sc2);

    let bp = new BPSimData();
    bp.addScenario(sc);
    console.log(bp);

    bp.addScenario(sc2);
    console.log(bp);

    //let id = new ConstantParameter(null,"",ResultType.COUNT, d1, null);

}

function xmlParsingToLeaves(xml) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, "text/xml");

    // const bpmnPrefix = definitionsTag[0].prefix;

    const bpmnNamespaceURI = "http://www.omg.org/spec/BPMN/20100524/MODEL";
    const bpsimNamespaceURI = "http://www.bpsim.org/schemas/1.0";


    let bpsimNS = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "extensionElements");
    console.log(bpsimNS[0]);

    var nodes = Array.prototype.slice.call(bpsimNS[0].getElementsByTagName("*"), 0);
    console.log(nodes);

    //creo gli oggetti per ogni nodo  e li avvaloro in base ai campi definiti nel bpsim in input
    let nodeObjects = [];
    for (let i = 0; i < nodes.length; i++) {
        // console.log(nodes[i].localName,"    ", factory[nodes[i].localName]);
        if (nodes[i].localName === "ResultRequest") {
            nodeObjects[i] = factory[nodes[i].localName][nodes[i].textContent];
        } else {
            nodeObjects[i] = new factory[nodes[i].localName]();
            for (let j = 0; j < nodes[i].attributes.length; j++) {
                nodeObjects[i][nodes[i].attributes[j].localName] = nodes[i].attributes[j].value;
            }
        }
    }

    console.log(nodeObjects);

    let temp = buildDataTree(nodes[0], createObj(nodes[0]));
    // console.log("RISULTATO SEGUE");

    console.log(temp);


    // buildDataTree(nodes, nodeObjects);


    // var leafNodes = nodes.filter(function(elem) {
    //     return !elem.hasChildNodes();
    // });
    // console.log(leafNodes);
    // //creo gli oggetti per ogni nodo foglia e li avvaloro in base ai campi definiti nel bpsim in input
    // let leafObjects = [];
    // for(let i=0; i<leafNodes.length; i++){
    //     leafObjects[i] = new factory[leafNodes[i].localName]();
    //     for(let j=0; j<leafNodes[i].attributes.length; j++){
    //         leafObjects[i][leafNodes[i].attributes[j].localName] = leafNodes[i].attributes[j].value ;
    //     }
    // }

    // console.log(leafObjects);

}

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

function buildDataTree(nodo, nodoObject) {

    let numFigli = nodo.childElementCount;
    let nodoFiglio;

    let childNodes=nodo.childNodes;
    let temp=[];
    for(let i = 0; i<childNodes.length;i++){
        if(childNodes[i].nodeName != '#text'){
            temp.push(childNodes[i]);
        }
    }
    childNodes = temp;

    while (numFigli > 0) {
        let childToPass = childNodes.pop();
        nodoFiglio = buildDataTree(childToPass, createObj(childToPass));
        let nameAttr = nodoFiglio[0].localName.charAt(0).toLowerCase() + nodoFiglio[0].localName.slice(1);
        //VEDERE SE FUNZIONA PER CHI HA ARRAY OLTRE
        if(nodoFiglio[0].localName === "Scenario" ||
            nodoFiglio[0].localName === "ElementParameters"
        ){
            let tempArray = [];
            tempArray.push(nodoFiglio[1]);
            // console.log(tempArray);

            // console.log(nameAttr);
            nodoObject[nameAttr] = tempArray;

        }else {
            // console.log(nodo);
            // console.log(nodoObject);
            // console.log(nameAttr);

            nodoObject[nameAttr] = nodoFiglio[1];
        }
        numFigli--;
    }

    let nodo_nodoObj = [];
    nodo_nodoObj.push(nodo);
    nodo_nodoObj.push(nodoObject);
    return nodo_nodoObj;
}


function xmlParsing(xml) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, "text/xml");

    const bpmnNamespaceURI = "http://www.omg.org/spec/BPMN/20100524/MODEL";
    const bpsimNamespaceURI = "http://www.bpsim.org/schemas/1.0";


    let bpsimNS = xmlDoc.getElementsByTagNameNS(bpsimNamespaceURI, "BPSimData");
    //VA FATTO FOREACH PER OGNI SCENARIO

    //ci colleghiamo al tag definitions bpmn
    let definitionsTag = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "definitions");

    //prefisso bpmn (es. semantic, bpmn)
    const bpmnPrefix = definitionsTag[0].prefix;
    let bpsimPrefix = "bpsim"; //default


    if (bpsimNS.length == 0) {
        //Aggiungere namespace bpsim al namespace
        definitionsTag[0].setAttribute("xlmns:" + bpsimPrefix, bpsimNamespaceURI);

        //Aggiunta bpmn:relationship
        let relationship = xmlDoc.createElement(bpmnPrefix + ":relationship");
        relationship.setAttribute("type", "BPSimData");
        definitionsTag[0].appendChild(relationship);

        //Aggiunta bpmn:extensionElements
        let extensionElements = xmlDoc.createElement(bpmnPrefix + ":extensionElements");
        relationship.appendChild(extensionElements);

        //Aggiunta bpsim:BPSimData
        let bpsimData = xmlDoc.createElement(bpsimPrefix + ":BPSimData");
        extensionElements.appendChild(bpsimData);

        //Aggiunta bpsim:Scenario
        let scenario = xmlDoc.createElement(bpsimPrefix + ":Scenario");
        // scenario.setAttribute("id", $('#id').val());
        // scenario.setAttribute("name", $('#name').val());
        // scenario.setAttribute("description", $('#description').val());
        //CREATED
        //MODIFIED
        // scenario.setAttribute("author", $('#author').val());
        // scenario.setAttribute("vendor", $('#vendor').val());
        // scenario.setAttribute("version", $('#version').val());

        bpsimData.appendChild(scenario);

        console.log(bpsimData);
    } else {
        //TODO inserire nuovi valori del xml letto
        bpsimPrefix = bpsimNS[0].prefix;
        console.log("ciao " + bpsimPrefix);
    }
    console.log(xmlDoc);

    // AGGIUNGERE TAG IN SCRITTURA XML
    // prova = xmlDoc.createElement("rel");
    // bpsimNS = xmlDoc.getElementsByTagNameNS("http://www.omg.org/spec/BPMN/20100524/MODEL", "definitions");
    // bpsimNS[0].appendChild(prova);
    // console.log(bpsimNS[0]);


    //prova per leggere un valore di un attributo e settare uno nuovo o lo stesso
    // bpsimNS = xmlDoc.getElementsByTagNameNS("http://www.bpsim.org/schemas/1.0", "DurationParameter");
    // console.log(bpsimNS);
    // bpsimNS[0].setAttribute("value", "PROVA")
    // console.log(bpsimNS[0].getAttribute("value"));
    // console.log(bpsimNS[0]);
}

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


            $('#js-drop-zone').css('display', 'none');
            $('#js-canvas').css('display', 'block');
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

// check file api availability
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
    // END Remove


    registerFileDrop(container, openDiagram);
}


var eventBus = viewer.get('eventBus');

// you may hook into any of the following events
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

        if (event == 'element.click') {
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
