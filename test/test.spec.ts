import { BPSimData } from "../app/types/scenario/BPSimData";
import { Scenario } from "../app/types/scenario/Scenario";
import { expect } from 'chai';
import 'mocha';
import { DateTime, BooleanParameter, FloatingParameter, NumericParameter, StringParameter } from "../app/types/parameter_type/ConstantParameter";
import { VendorExtension } from "../app/types/scenario/VendorExtension";
import { Calendar } from "../app/types/calendar/Calendar";
import { ScenarioParameters } from "../app/types/scenario/ScenarioParameters";
import { TimeUnit } from "../app/types/scenario/TimeUnit";
import { Parameter } from "../app/types/parameter_type/Parameter";
import { ResultType } from "../app/types/parameter_type/ResultType";
import { ExpressionParameter } from "../app/types/parameter_type/ExpressionParameter";
import { EnumParameter } from "../app/types/parameter_type/EnumParameter";
import { ErlangDistribution, UserDistribution, UserDistributionDataPoint, TriangularDistribution, GammaDistribution, LogNormalDistribution } from "../app/types/parameter_type/DistributionParameter";
import { Property } from "../app/types/parameters/Property";
import { PropertyType } from "../app/types/parameters/PropertyType";
import { PropertyParameters } from "../app/types/parameters/PropertyParameters";
import { ElementParameters } from "../app/types/parameters/ElementParameters";
import { CostParameters } from "../app/types/parameters/CostParameters";
import { ControlParameters } from "../app/types/parameters/ControlParameters";
import { TimeParameters } from "../app/types/parameters/TimeParameters";
import { ResourceParameters } from "../app/types/parameters/ResourceParameters";
import { PriorityParameters } from "../app/types/parameters/PriorityParameters";

const bpsimNamespaceURI = "http://www.bpsim.org/schemas/1.0";

let bpsimdata = new BPSimData();

describe('Scenario testing default values and simple attributes', () => {
  let scenario = new Scenario();
  scenario.name = "Scenario1";
  let dt = new DateTime();
  dt.date = "2009-06-15T13:45:30";
  scenario.created = dt;
  bpsimdata.addScenario(scenario);

  it('should return the name \"Scenario1\"', () => {
    expect(bpsimdata.scenario[0].name).to.equal('Scenario1');
  });
  it('should return the name \"Caputo \& Lazazzera\"', () => {
    expect(bpsimdata.scenario[0].vendor).to.equal('Caputo & Lazazzera');
  });
  it('should return the date \"2009-06-15T13:45:30\"', () => {
    expect(bpsimdata.scenario[0].created.date).to.equal('2009-06-15T13:45:30');
  });
  it('should return the JSON.stringfy object with default values', () => {
    expect(JSON.stringify(bpsimdata.scenario[0])).to.equal('{"_vendor":"Caputo & Lazazzera","_elementParameters":[],"_scenarioParameters":{"_replication":1,"_baseTimeUnit":"min","_baseCurrencyUnit":"USD","_baseResultFrequencyCumul":"false","_traceOutput":"false","_traceFormat":"XES","_propertyParameters":[]},"_vendorExtensions":[],"_calendar":[],"_name":"Scenario1","_created":{"_date":"2009-06-15T13:45:30"}}');
  });

});

describe('Scenario testing complex attributes', () => {
  let scenario = new Scenario();
  scenario.name = "Scenario2";

  describe('Scenario testing \"Calendar\" and \"VendorExtension\"', () => {

    let vendorExtension1 = new VendorExtension();
    vendorExtension1.name = "Vendor XXXX";
    vendorExtension1.value = "<ciao>";
    let vendorExtension2 = new VendorExtension();
    vendorExtension2.name = "Vendor YYYY";
    vendorExtension2.value = "<hello>";
    scenario.vendorExtensions = [vendorExtension1, vendorExtension2];

    let calendar1 = new Calendar();
    calendar1.id = "C1";
    calendar1.name = "Calendario attivo";
    calendar1.calendar = "TEST1";
    let calendar2 = new Calendar();
    calendar2.id = "C2";
    calendar2.name = "Calendario vecchio";
    calendar2.calendar = "TEST2";
    let calendar3 = new Calendar();
    calendar3.id = "C3";
    calendar3.name = "Calendario non valido";
    calendar3.calendar = "TEST3";
    scenario.calendar = [calendar1, calendar2, calendar3];

    bpsimdata.addScenario(scenario);


    it('should return the name \"Scenario2\"', () => {
      expect(bpsimdata.scenario[1].name).to.equal('Scenario2');
    });

    it('should return the number of \"VendorExtension\" elements', () => {
      expect(bpsimdata.scenario[1].vendorExtensions.length).to.equal(2);
    });
    it('should return the JSON.stringify \"VendorExtensions\" object', () => {
      expect(JSON.stringify(bpsimdata.scenario[1].vendorExtensions)).to.equal('[{"_name":"Vendor XXXX","_value":"<ciao>"},{"_name":"Vendor YYYY","_value":"<hello>"}]');
    });

    it('should return the number of \"Calendar\" elements', () => {
      expect(bpsimdata.scenario[1].calendar.length).to.equal(3);
    });
    it('should return the JSON.stringify \"Calendar\" object', () => {
      expect(JSON.stringify(bpsimdata.scenario[1].calendar)).to.equal('[{"_id":"C1","_name":"Calendario attivo","_calendar":"TEST1"},{"_id":"C2","_name":"Calendario vecchio","_calendar":"TEST2"},{"_id":"C3","_name":"Calendario non valido","_calendar":"TEST3"}]');
    });

  });

  describe('Scenario testing \"ScenarioParameters\"', () => {
    let scenPar = new ScenarioParameters();

    scenPar.replication = 10;
    scenPar.baseTimeUnit = TimeUnit.hours;
    scenPar.baseCurrencyUnit = "EUR";
    bpsimdata.scenario[1].scenarioParameters = scenPar;

    describe('Scenario testing \"ScenarioParameters\" simple attributes', () => {

      it('should return the \"Replications\" value', () => {
        expect(bpsimdata.scenario[1].scenarioParameters.replication).to.equal(10);
      });
      it('should return the \"BaseTimeUnit\" value', () => {
        expect(bpsimdata.scenario[1].scenarioParameters.baseTimeUnit).to.equal("hour");
      });
      it('should return the \"BaseCurrencyUnit\" value', () => {
        expect(bpsimdata.scenario[1].scenarioParameters.baseCurrencyUnit).to.equal("EUR");
      });

    });
    describe('Scenario testing \"ScenarioParameters\" parameters', () => {
      it('should return the JSON.stringify \"Start\" object', () => {
        let calendar = new Calendar();
        calendar.id = "C1";
        bpsimdata.scenario[1].calendar = [calendar];

        let start = new Parameter();
        start.resultRequest = [ResultType.count];

        let boolpar = new BooleanParameter();
        boolpar.validFor = bpsimdata.scenario[1].calendar[0];
        boolpar.value = true;

        let expressionpar = new ExpressionParameter();
        expressionpar.result = ResultType.max;
        expressionpar.value = "XPATH";

        let enumpar = new EnumParameter();
        enumpar.value = [boolpar];

        let erlangdistr = new ErlangDistribution();
        erlangdistr.k = 10;
        erlangdistr.mean = 0.8;

        start.value = [boolpar, expressionpar, enumpar];

        bpsimdata.scenario[1].scenarioParameters.start = start;
        expect(JSON.stringify(bpsimdata.scenario[1].scenarioParameters.start)).to.equal('{"_value":[{"_validFor":{"_id":"C1","_name":"Calendario attivo","_calendar":"TEST1"},"_value":true},{"_result":"max","_value":"XPATH"},{"_value":[{"_validFor":{"_id":"C1","_name":"Calendario attivo","_calendar":"TEST1"},"_value":true}]}],"_resultRequest":["count"]}');
      });

    });
    describe('Scenario testing \"ScenarioParameters\" property parameters', () => {

      it('should return the JSON.strigify \"Property Parameters\" object', () => {
        let property1 = new Property();
        property1.type = PropertyType.long;

        let floatpar = new FloatingParameter();
        floatpar.result = ResultType.max;
        floatpar.timeUnit = TimeUnit.year;
        floatpar.value = 2.1;

        let triangdistr = new TriangularDistribution();
        triangdistr.min = 2;
        triangdistr.instance = "Triangolo";

        let userdistr = new UserDistribution();
        userdistr.discrete = true;
        let point1 = new UserDistributionDataPoint();
        point1.probability = 0.8;
        point1.value = [floatpar, triangdistr];
        userdistr.points = [point1];

        property1.value = [floatpar, userdistr, triangdistr];


        let property2 = new Property();
        let boolpar = new BooleanParameter();
        boolpar.value = false;
        boolpar.instance = "Ciao";

        let numpar = new NumericParameter();
        numpar.result = ResultType.max;
        numpar.timeUnit = TimeUnit.year;
        numpar.value = 9;

        property2.value = [boolpar, numpar];

        let propertyparam = new PropertyParameters();
        propertyparam.property = [property1, property2];

        bpsimdata.scenario[1].scenarioParameters.propertyParameters = [propertyparam];


        expect(JSON.stringify(bpsimdata.scenario[1].scenarioParameters.propertyParameters)).to.equal('[{"_property":[{"_value":[{"_result":"max","_timeUnit":"year","_value":2.1},{"_points":[{"_value":[{"_result":"max","_timeUnit":"year","_value":2.1},{"_min":2,"_instance":"Triangolo"}],"_probability":0.8}],"_discrete":true},{"_min":2,"_instance":"Triangolo"}],"_resultRequest":[],"_type":"long"},{"_value":[{"_value":false,"_instance":"Ciao"},{"_result":"max","_timeUnit":"year","_value":9}],"_resultRequest":[]}]}]');
      });

    });
  });

  describe('Scenario testing \"ElementParameters\" parameters', () => {

    it('should return the JSON.strigify \"Element Parameters\" object', () => {
      let property1 = new Property();
      property1.type = PropertyType.long;

      let floatpar = new FloatingParameter();
      floatpar.result = ResultType.max;
      floatpar.timeUnit = TimeUnit.year;
      floatpar.value = 2.9;

      let triangdistr = new TriangularDistribution();
      triangdistr.max = 1;
      triangdistr.instance = "Cerchio";

      let userdistr = new UserDistribution();
      userdistr.discrete = true;
      let point1 = new UserDistributionDataPoint();
      point1.probability = 0.1;
      point1.value = [floatpar, triangdistr];
      userdistr.points = [point1];

      property1.value = [floatpar, userdistr, triangdistr];

      let stringpar = new StringParameter();
      stringpar.result = ResultType.max;
      stringpar.value = "Parola";

      let propertyparam = new PropertyParameters();
      propertyparam.property = [property1];

      let param1 = new Parameter();
      let gammadistr = new GammaDistribution();
      gammadistr.scale = 2;
      let lognormaldistr = new LogNormalDistribution();
      lognormaldistr.mean = 0.7;
      param1.value = [gammadistr, lognormaldistr];
      let costparam = new CostParameters();
      costparam.fixedCost = param1;

      let elem1 = new ElementParameters();
      elem1.elementRef = "ref_XXX";
      elem1.id = "el1";
      elem1.propertyParameters = [propertyparam];
      elem1.costParameters = costparam;

      let param2 = new Parameter();
      let booleanparam = new BooleanParameter();
      booleanparam.value = true;
      param2.value = [booleanparam];
      let controlparam = new ControlParameters();
      controlparam.triggerCount = param2;
      let timeparam = new TimeParameters();
      timeparam.lagTime = param1;
      let resourceparam = new ResourceParameters();
      resourceparam.role = [param1, param2];
      let priorityparam = new PriorityParameters();
      priorityparam.interruptible = param1;

      let elem2 = new ElementParameters();
      elem2.elementRef = "ref_YYY";
      elem2.id = "el2";
      elem2.controlParameters = controlparam;
      elem2.timeParameters = timeparam;
      elem2.resourceParameters = resourceparam;
      elem2.priorityParameters = priorityparam;

      bpsimdata.scenario[1].elementParameters = [elem1, elem2];


      expect(JSON.stringify(bpsimdata.scenario[1].elementParameters)).to.equal('[{"_vendorExtensions":[],"_propertyParameters":[{"_property":[{"_value":[{"_result":"max","_timeUnit":"year","_value":2.9},{"_points":[{"_value":[{"_result":"max","_timeUnit":"year","_value":2.9},{"_max":1,"_instance":"Cerchio"}],"_probability":0.1}],"_discrete":true},{"_max":1,"_instance":"Cerchio"}],"_resultRequest":[],"_type":"long"}]}],"_elementRef":"ref_XXX","_id":"el1","_costParameters":{"_fixedCost":{"_value":[{"_scale":2},{"_mean":0.7}],"_resultRequest":[]}}},{"_vendorExtensions":[],"_propertyParameters":[],"_elementRef":"ref_YYY","_id":"el2","_controlParameters":{"_triggerCount":{"_value":[{"_value":true}],"_resultRequest":[]}},"_timeParameters":{"_lagTime":{"_value":[{"_scale":2},{"_mean":0.7}],"_resultRequest":[]}},"_resourceParameters":{"_role":[{"_value":[{"_scale":2},{"_mean":0.7}],"_resultRequest":[]},{"_value":[{"_value":true}],"_resultRequest":[]}]},"_priorityParameters":{"_interruptible":{"_value":[{"_scale":2},{"_mean":0.7}],"_resultRequest":[]}}}]');
    });

  });

});