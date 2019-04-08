import firstdiagramXML from '../resources/firstDiagram.bpmn';
// import carRepairProcessXML from '../resources/CarRepairProcess.bpmn';
import {DateTime} from "./types/DateTime";
import {Scenario} from "./types/Scenario";
import {BPSimData} from "./types/BPSimData";
import {ConstantParameter} from "./types/ParameterValue";
import {ResultType} from "./types/ResultType";


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
        structurePopulation();
    });
}

function structurePopulation() {
    let d1 = new DateTime(2019, 1, 5);
    let d2 = new DateTime(2019, 1, 10);

    let sc = new Scenario("1","ciao","descr",d1,d2,"Pippo");
    console.log(sc);

    let sc2 = new Scenario("2","ciao","provola",d1,d2,"Pippo");
    console.log(sc2);

    let bp = new BPSimData();
    bp.addScenario(sc);
    console.log(bp);

    bp.addScenario(sc2);
    console.log(bp);

    //let temp = new ConstantParameter(null,"",ResultType.COUNT, d1, null);

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
        definitionsTag[0].setAttribute("xlmns:"+bpsimPrefix, bpsimNamespaceURI);

        //Aggiunta bpmn:relationship
        let relationship = xmlDoc.createElement(bpmnPrefix+":relationship");
        relationship.setAttribute("type","BPSimData");
        definitionsTag[0].appendChild(relationship);

        //Aggiunta bpmn:extensionElements
        let extensionElements = xmlDoc.createElement(bpmnPrefix+":extensionElements");
        relationship.appendChild(extensionElements);

        //Aggiunta bpsim:BPSimData
        let bpsimData = xmlDoc.createElement(bpsimPrefix+":BPSimData");
        extensionElements.appendChild(bpsimData);

        //Aggiunta bpsim:Scenario
        let scenario = xmlDoc.createElement(bpsimPrefix+":Scenario");
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
    }else{
        //TODO inserire nuovi valori del xml letto
        bpsimPrefix = bpsimNS[0].prefix;
        console.log("ciao "+ bpsimPrefix);
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

    // console.log(firstdiagramXML);

    openDiagram(firstdiagramXML);

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
        if (!e.element.id.includes("label")) {
            console.log(event + 'on' + e.element.id);
        } else {
            //TODO disabilitare css per le label
        }
    });

})
;
