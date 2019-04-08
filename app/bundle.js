(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

    let bp = new BPSimData(sc);
    console.log(bp);

    bp.addScenario(sc2);
    console.log(bp);


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

},{}],2:[function(require,module,exports){
var BPSimData = (function () {
    function BPSimData(scenarios) {
        this._scenarios.concat(scenarios);
    }
    Object.defineProperty(BPSimData.prototype, "scenarios", {
        get: function () {
            return this._scenarios;
        },
        enumerable: true,
        configurable: true
    });
    BPSimData.prototype.addScenario = function (scenario) {
        this._scenarios.push(scenario);
    };
    return BPSimData;
})();
exports.BPSimData = BPSimData;

},{}],3:[function(require,module,exports){
var DateTime = (function () {
    function DateTime(year, month, day, hour, minutes, seconds) {
        if (hour === void 0) { hour = 0; }
        if (minutes === void 0) { minutes = 0; }
        if (seconds === void 0) { seconds = 0; }
        var temp = new Date(Date.UTC(year, month, day, hour, minutes, seconds));
        this._date = temp.toISOString();
    }
    Object.defineProperty(DateTime.prototype, "date", {
        get: function () {
            return this._date;
        },
        enumerable: true,
        configurable: true
    });
    return DateTime;
})();
exports.DateTime = DateTime;

},{}],4:[function(require,module,exports){
var Scenario = (function () {
    function Scenario(id, name, description, created, modified, author, vendor, version, result, inherits, scenarioParameters, vendorExtension, elementParameters) {
        if (vendor === void 0) { vendor = "Caputo & Lazazzera"; }
        if (version === void 0) { version = "1.0"; }
        if (result === void 0) { result = null; }
        if (inherits === void 0) { inherits = null; }
        if (scenarioParameters === void 0) { scenarioParameters = null; }
        if (vendorExtension === void 0) { vendorExtension = null; }
        if (elementParameters === void 0) { elementParameters = null; }
        this._id = id;
        this._name = name;
        this._description = description;
        this._created = created;
        this._modified = modified;
        this._author = author;
        this._vendor = vendor;
        this._version = version;
        this._result = result;
        this._inherits = inherits;
        this._elementParameters = elementParameters;
        this._scenarioParameters = scenarioParameters;
        this._vendorExtension = vendorExtension;
    }
    Object.defineProperty(Scenario.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "description", {
        get: function () {
            return this._description;
        },
        set: function (value) {
            this._description = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "created", {
        get: function () {
            return this._created;
        },
        set: function (value) {
            this._created = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "modified", {
        get: function () {
            return this._modified;
        },
        set: function (value) {
            this._modified = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "author", {
        get: function () {
            return this._author;
        },
        set: function (value) {
            this._author = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "vendor", {
        get: function () {
            return this._vendor;
        },
        set: function (value) {
            this._vendor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "version", {
        get: function () {
            return this._version;
        },
        set: function (value) {
            this._version = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "result", {
        get: function () {
            return this._result;
        },
        set: function (value) {
            this._result = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "inherits", {
        get: function () {
            return this._inherits;
        },
        set: function (value) {
            this._inherits = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "elementParameters", {
        get: function () {
            return this._elementParameters;
        },
        set: function (value) {
            this._elementParameters = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "scenarioParameters", {
        get: function () {
            return this._scenarioParameters;
        },
        set: function (value) {
            this._scenarioParameters = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "vendorExtension", {
        get: function () {
            return this._vendorExtension;
        },
        set: function (value) {
            this._vendorExtension = value;
        },
        enumerable: true,
        configurable: true
    });
    return Scenario;
})();
exports.Scenario = Scenario;

},{}]},{},[1,2,4,3]);
