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

        xmlParsing(xml);

    });
}

function xmlParsing(xml) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, "text/xml");

    const bpmnNamespaceURI = "http://www.omg.org/spec/BPMN/20100524/MODEL";
    const bpsimNamespaceURI = "http://www.bpsim.org/schemas/1.0";


    let bpsimNS = xmlDoc.getElementsByTagNameNS(bpsimNamespaceURI, "BPSim");
    //VA FATTO FOREACH PER OGNI SCENARIO

    //ci colleghiamo al tag definitions bpmn
    let definitionsTag = xmlDoc.getElementsByTagNameNS(bpmnNamespaceURI, "definitions");

    if (bpsimNS.length == 0) {
        //Aggiungere namespace bpsim al namespace
        definitionsTag[0].setAttribute("xlmns:bpsim", bpsimNamespaceURI);

        //Aggiungere relationship
        relationship = xmlDoc.createElementNS(bpmnNamespaceURI,'relationship');
        console.log(relationship);
        definitionsTag[0].appendChild(relationship);

        console.log(definitionsTag[0]);
    }else{
        //TODO inserire nuovi valori del xml letto
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
