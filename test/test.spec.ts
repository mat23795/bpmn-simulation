import { BPSimData } from "../app/types/scenario/BPSimData";
import { Scenario } from "../app/types/scenario/Scenario";
import { expect } from 'chai';
import 'mocha';
import { DateTime, BooleanParameter } from "../app/types/parameter_type/ConstantParameter";
import { VendorExtension } from "../app/types/scenario/VendorExtension";
import { Calendar } from "../app/types/calendar/Calendar";
import { ScenarioParameters } from "../app/types/scenario/ScenarioParameters";
import { TimeUnit } from "../app/types/scenario/TimeUnit";
import { Parameter } from "../app/types/parameter_type/Parameter";
import { ResultType } from "../app/types/parameter_type/ResultType";
import { ExpressionParameter } from "../app/types/parameter_type/ExpressionParameter";
import { EnumParameter } from "../app/types/parameter_type/EnumParameter";
import { ErlangDistribution } from "../app/types/parameter_type/DistributionParameter";

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
    it('should return the JSON.stringfy \"VendorExtensions\" object', () => {
      expect(JSON.stringify(bpsimdata.scenario[1].vendorExtensions)).to.equal('[{"_name":"Vendor XXXX","_value":"<ciao>"},{"_name":"Vendor YYYY","_value":"<hello>"}]');
    });

    it('should return the number of \"Calendar\" elements', () => {
      expect(bpsimdata.scenario[1].calendar.length).to.equal(3);
    });
    it('should return the JSON.stringfy \"Calendar\" object', () => {
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
      it('should return the \"Start\" value', () => {
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
    describe('Scenario testing \"ScenarioParameters\" properties', () => {
    

    });

  });

});