
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('TEST_1 Avvio', () => {

  it('apertura file .html', () => {
    cy.visit('./../../../dist/index.html')
  })

})

describe('TEST_2 Drag-n-Drop', function () {

  it('esistenza dropzone con dicitura', function () {
    cy.get('#js-drop-zone')
      .should('contain', "Drop your BPMN diagram here")
  })

  describe('2.1 Fase eventi drag-n-drop', function () {
    it('cambio colore dropzone quando si passa sopra', function () {
      cy.get('#js-drop-zone')
        .trigger('dragover')
        .should('have.css', 'background-color', 'rgb(240, 248, 255)')
        .trigger('dragleave')
        .should('have.css', 'background-color', 'rgb(255, 255, 255)')
    })

    it('aggiunta del file e apertura al drop', function () {

      const fileName = '../../resources/TechnicalSupportProcess.bpmn';

      cy.fixture(fileName).then(fileContent => {
        cy.get('#js-drop-zone').upload(
          { fileContent, fileName, mimeType: 'text/xml', encoding: 'utf-8' },
          { subjectType: 'drag-n-drop' },
        );
      });

    })

  })
})

describe('TEST_3 Manipolazione di Scenarios', () => {
  it('controllo picker settato sul primo scenarioe avente opzioni corrette', () => {
    cy.get('#scenario-picker').should('have.text', 'S1S2S3').should('have.value', '1');
  });

  describe('3.1 Creazione di un nuovo Scenario', () => {
    it('creazione nuovo scenario con id corretto', () => {
      cy.get('#create-scenario').trigger('click')
      cy.get('.vex-dialog-input > input').type('NuovoScenario')
      cy.get('.vex-dialog-button-primary').click()
    });
    it('controllo picker settato su nuovo scenario', () => {
      cy.get('#scenario-picker').should('have.text', 'S1S2S3NuovoScenario').should('have.value', '4');
      cy.get('#scenario-id-input').should('have.value', 'NuovoScenario')
    })

  });

  describe('3.2 Controllo salvataggio semplici modifiche', () => {
    it('cambio id (con errore gestito) -> diventa S4', () => {
      cy.get('#scenario-id-input').clear().type('S1').blur();
      cy.get('.vex-dialog-button-primary').click()
      cy.get('#scenario-id-input').should('have.value', 'NuovoScenario').clear().type('S4').should('have.value', 'S4').blur();
    })

    it('cambio scenario e ritorno al precedente per controllare modifica esistente', () => {
      cy.get('#scenario-picker').select('S1')
      cy.get('#scenario-id-input').should('have.value', 'S1')
      cy.get('#scenario-picker').select('S4');
      cy.get('#scenario-id-input').should('have.value', 'S4')
    })

  });

  describe('3.3 Eliminazione di uno Scenario', () => {
    it('eliminazione dello scenario S1', () => {
      cy.get('#scenario-picker').select('S1');
      cy.get('#delete-scenario').trigger('click')
      
    })
    it('controllo cambio valori a picker',()=>{
      cy.get('#scenario-picker').should('have.text', 'S2S3S4').should('have.value', '1');
      cy.get('#scenario-inherits-picker').should('have.text', 'S3S4').should('have.value', null);
    })

  });

  describe('3.4 Creazione scenario esistente', () => {
    it('creazione dello scenario con ID non disponibile, con rettifica su ID (S5)', () => {
      cy.get('#create-scenario').trigger('click')
      cy.get('.vex-dialog-input > input').type('C1')
      cy.get('.vex-dialog-button-primary').trigger('click')
      cy.get('.vex-dialog-input > input').clear().type('S5')
      cy.get('.vex-dialog-button-primary').click()
      cy.get('#scenario-picker').should('have.text', 'S2S3S4S5').should('have.value', '4');
      cy.get('#scenario-id-input').should('have.value', 'S5')
    })

  });

});

describe('TEST_4 Manipolazione di Calendars', () => {

  describe('4.1 Creazione di un nuovo Calendar', () => {
    it('inserimento id corretto per un nuovo calendar', () => {
      cy.get('#scenario-picker').select('S2');
      cy.get('#calendar-btn').click();
      cy.get('#create-calendar-btn').click();
      cy.get('.vex-dialog-input > input').type('C9')
      cy.get('.vex-dialog-button-primary').click()
      cy.get('#calendar-C9-id-input').should('have.value', 'C9');

    });
    it('controllo che il validFor contenga C9', () => {
      cy.get('#scen-par-btn').click()
      cy.get('#start-value-validFor-picker-1').should('have.text', "C9");
    });
  })

  describe('4.2 Controllo salvataggio semplici modifiche', () => {
    it('cambio id (con errore gestito) -> diventa C10', () => {
      cy.get('#calendar-C9-id-input').clear().type('C1').blur();
      cy.get('.vex-dialog-button-primary').click();
      cy.get('#calendar-C9-id-input').should('have.value', 'C9').clear().type('C10').blur().should('have.value', 'C10');
    })

    it('cambio scenario e ritorno al precedente per controllare modifica esistente', () => {
      cy.get('#scenario-picker').select('S3')
      cy.get('#calendar-C10-id-input').should('not.exist')
      cy.get('#scenario-picker').select('S2');
      cy.get('#calendar-btn').click();
      cy.get('#calendar-C10-id-input').should('have.value', 'C10')
    })
  });

  describe('4.3 Eliminazione di un Calendar', () => {
    it('eliminazione del calendar C10', () => {
      cy.get('#btn-delete-calendarC10').trigger('click')
      cy.get('#btn-delete-calendarC10').should('not.exist')
    })
    it('controllo che il validFor non contenga C10', () => {
      cy.get('#scen-par-btn').click()
      cy.get('#start-value-validFor-picker-1').should('have.text', '');
    });

  });
});

describe('TEST_5 Manipolazione parametri di Scenario', () => {
  describe('5.1 Manipolazione parametri di tipo date e select di Scenario', () => {
    it('inserimento valore nel campo created', () => {
      cy.get('#scenario-created-input').click().then(input => {
        input[0].dispatchEvent(new Event('input', { bubbles: true }))
        input.val('2017-04-30T13:00:00')
      }).trigger('change');
    });

    it('controllo inserimento corretto della data in created', () => {
      cy.get('#scenario-created-input').should('have.value', '2017-04-30T13:00:00');
    });

    it('controllo salvataggio corretto di created post cambio scenario', () => {
      cy.get('#scenario-picker').select('S3')
      cy.get('#scenario-created-input').should('not.have.value', '2017-04-30T13:00:00');
      cy.get('#scenario-picker').select('S2')
      cy.get('#scenario-created-input').should('have.value', '2017-04-30T13:00:00');
    });


    it('inserimento valore nel campo inherits', () => {
      cy.get('#scenario-inherits-picker').select('S5')
    });

    it('controllo inserimento corretto di inherits', () => {
      cy.get('#scenario-inherits-picker').should('have.value', 'S5');
    });

    it('controllo salvataggio corretto di inherits post cambio scenario', () => {
      cy.get('#scenario-picker').select('S3')
      cy.get('#scenario-inherits-picker').should('not.have.value', 'S5');
      cy.get('#scenario-picker').select('S2')
      cy.get('#scenario-inherits-picker').should('have.value', 'S5');
    });

  });

  describe('5.2 Manipolazione ScenarioParameters', () => {

    describe('5.2.1 Manipolazione parameters', () => {
      it('apertura element parameter section', () => {
        cy.get('#scen-par-btn').click()
      })

      it('cambio di value a start', () => {
        cy.get('#start-value-picker-1').select('NumericParameter');
        cy.get('#start-value-timeUnit-picker-1').select('hours');
      })

      it('crezione nuovo value a start con errore già usato', () => {
        cy.get('#btn-create-start-value').click();
        cy.get('#start-value-picker-18').select('NumericParameter');
        cy.get('.vex-dialog-button-primary').click()
      })
      it('creazione nuovo valore non esistente', ()=>{
        cy.get('#start-value-picker-18').select('EnumParameter');
        cy.get('#btn-create-start-value-enumParameter-values-18').click();
        cy.get('#btn-create-start-value-enumParameter-values-18').click();
        cy.get('#btn-create-start-value-enumParameter-values-18').click();

        cy.get('#start-value-enum-values-picker-19').select('FloatingParameter');
        cy.get('#enumParameter-start-value-floatingParameterValue-input-18-19').type("2.5");
        cy.get('#enumParameter-value-timeUnit-floatingParameter-picker-18-19').select("days");

        cy.get('#start-value-enum-values-picker-20').select('StringParameter');
        cy.get('#enumParameter-start-value-stringParameterValue-input-18-20').type("Ciao");

        cy.get('#btn-deleteValue-start-value-18-21').click();
      })

      it('cambio resultRequest di start', () => {
        cy.get('#start-resultRequest-picker-0').select('max');
      })

      it('eliminazione parameter values di warmup', () => {
        cy.get('#btn-deleteParameter-warmup-value-4').click();
        cy.get('#warmup-value-div-4').should('not.exist');
      });

      it('aggiunta di parameter (UserDistribution con 1 point) a duration', () => {
        cy.get('#btn-create-duration-value').click();
        cy.get('#duration-value-picker-22').select('UserDistribution');
        cy.get('#duration-value-result-picker-22').select('max');
        cy.get('#btn-create-duration-points-userDistribution-22').click();
        cy.get('#btn-create-point1-value').click();
        cy.get('#point1-value-picker-24').select("BooleanParameter");
        cy.get('#point1-value-content-div-24 > .onoffswitch > .onoffswitch-label > .onoffswitch-switch').click();
      });

      it('controllo salvataggio modifiche al cambio di scenario', () => {
        cy.get('#scenario-picker').select('S3').select('S2');
        cy.get('#scen-par-btn').click()

        cy.get('#start-value-picker-1').should('have.value', 'NumericParameter');
        cy.get('#start-value-timeUnit-picker-1').should('have.value', 'hours');

        cy.get('#start-value-picker-2').should('have.value', 'EnumParameter');
        cy.get('#start-value-enum-values-picker-3').should('have.value', 'FloatingParameter');
        cy.get('#enumParameter-start-value-floatingParameterValue-input-2-3').should('have.value', "2.5");
        cy.get('#enumParameter-value-timeUnit-floatingParameter-picker-2-3').should('have.value', "days");

        cy.get('#start-value-enum-values-picker-4').should('have.value', 'StringParameter');
        cy.get('#enumParameter-start-value-stringParameterValue-input-2-4').should('have.value', "Ciao");

        cy.get('#warmup-value-div-5').should('not.exist');
        cy.get('#duration-value-div-5').should('exist');
        cy.get('#duration-value-picker-5').should('have.value', 'UserDistribution');
        cy.get('#duration-value-result-picker-5').should('have.value', 'max');
        cy.get('#point1-value-picker-7').should('have.value', "BooleanParameter");
        cy.get('#point1-value-value-booleanParameter-input-7').should('have.value', 'on');
      })


    });

    describe('5.2.2 Manipolazione tipi semplici Scenario Parameter', () => {
      it('cambio valori semplici scenario parameter', () => {
        cy.get('#scenarioParametersAttribute-seed-input').type(1);
        cy.get('#scenarioParameters-baseTimeUnit-picker').select('year');
        cy.get(':nth-child(17) > .onoffswitch-label > .onoffswitch-switch').click();
      });

      it("controllo salvataggio modifiche al cambio di scenario", () => {
        cy.get('#scenarioParametersAttribute-seed-input').should('have.value', '1');
        cy.get('#scenarioParameters-baseTimeUnit-picker').should('have.value', 'year')
        cy.get('#scenarioParametersAttribute-traceOutput-input').should('have.value', 'on');

      });
    });

    describe('5.2.3 Manipolazione property parameters', () => {
      it('aggiunta di più property e queueLength', () => {
        cy.get('#btn-create-property').click()
        cy.get('#btn-create-property').click()

        cy.get('#btn-create-property1-value').click()
        cy.get('#btn-create-property1-value').click()

        cy.get('#property1-value-picker-24').select('ExpressionParameter')
        cy.get('#propertyType-scenarioParameters-picker-21').select('long')

        cy.get('#propertyType-scenarioParameters-picker-22').select('double')

        cy.get('#btn-create-queueLength-value').click()
        cy.get('#queueLength-resultRequest-picker-0').select('mean')
      })

      it('controllo modifiche corrette a cambio scenario', () => {
        cy.get('#scenario-picker').select('S3').select('S2')
        cy.get('#scen-par-btn').click()
        cy.get('#property1-value-picker-9').should('have.value', 'ExpressionParameter')
        cy.get('#propertyType-scenarioParameters-picker-8').should('have.value', 'long')

        cy.get('#propertyType-scenarioParameters-picker-10').should('have.value', 'double')

        cy.get('#queueLength-resultRequest-picker-0').should('have.value', 'min')
      })
    });

  });
});

describe('TEST_6 Manipolazione parametri per Activities', () => {
  let elementRef = "_10-235";

  it('click di un\'activity dell\'svg e check del focus su di esso', () => {
    cy.get('[data-element-id="' + elementRef + '"]').trigger('click')
    cy.get('input[id*="$$' + elementRef + '$$"]').should('have.focus')
  });
  it('cambio activity parameter già esitente ', () => {
    cy.get('#activity-id-input\\$\\$' + elementRef + '\\$\\$').type('S2').blur()
    cy.get('.vex-dialog-button-primary').click()
    cy.get('#activity-id-input\\$\\$' + elementRef + '\\$\\$').type('el1').blur()
    cy.get('#parameter1-value-picker-11').select('ErlangDistribution')
  })
  it('controllo salvataggio', () => {
    cy.get('#scenario-picker').select('S3').select('S2');
    cy.get('[data-element-id="' + elementRef + '"]').trigger('click')
    cy.get('#activity-id-input\\$\\$' + elementRef + '\\$\\$').should('have.value', 'el1')
    cy.get('#parameter1-value-picker-11').should('have.value', 'ErlangDistribution')
  })

});

describe('TEST_7 Manipolazione parametri per Events', () => {
  let elementRef = "_10-42";
  it('click di un\'event dell\'svg e check del focus su di esso', () => {
    cy.get('[data-element-id="' + elementRef + '"]').trigger('click')
    cy.get('input[id*="$$' + elementRef + '$$"]').should('have.focus')
  });
  it('creazione nuovo parametro con 3 value + test dei rispettivi resultRequest ', () => {
    cy.get('button[id = btn-create-elementParameter-\\$\\$' + elementRef + '\\$\\$]').click()
    cy.get('button[id = btn-create-elementParameter-\\$\\$' + elementRef + '\\$\\$]').click()
    cy.get('button[id = btn-create-elementParameter-\\$\\$' + elementRef + '\\$\\$]').click()
    cy.get('#select-parameter14-\\$\\$' + elementRef + '\\$\\$').should('have.text', 'Inter Trigger TimerTrigger CountProbabilityConditionProperty')

    cy.get('#select-parameter14-\\$\\$' + elementRef + '\\$\\$').select('InterTriggerTimer')
    cy.get('#parameter14-resultRequest-picker-23').should('have.text', 'minmaxmeansum')

    cy.get('#select-parameter15-\\$\\$' + elementRef + '\\$\\$').select('TriggerCount')
    cy.get('#parameter15-resultRequest-picker-23').should('have.text', 'count')

    cy.get('#select-parameter16-\\$\\$' + elementRef + '\\$\\$').select('Probability')
    cy.get('#parameter16-resultRequest-picker-23').should('not.exist')
  })

  it('controllo salvataggio', () => {
    cy.get('#scenario-picker').select('S3').select('S2');
    cy.get('[data-element-id="' + elementRef + '"]').trigger('click')

    cy.get('#select-parameter14-\\$\\$' + elementRef + '\\$\\$').should('not.exist')
  })

});

describe('TEST_8 Manipolazione parametri per Gateways', () => {
  let elementRef0 = "_10-593";
  it('click di un\'event dell\'svg e check del focus su di esso e check che non si può aggiungere parameter', () => {
    cy.get('[data-element-id="' + elementRef0 + '"]').trigger('click')
    cy.get('input[id*="$$' + elementRef0 + '$$"]').should('have.focus')
    cy.get('button[id = btn-create-elementParameter-\\$\\$' + elementRef0 + '\\$\\$]').should('not.exist')
  });

  let elementRef = "_10-114";
  it('click di un gateway dell\'svg e check del focus su di esso', () => {
    cy.get('[data-element-id="' + elementRef + '"]').trigger('click')
    cy.get('input[id*="$$' + elementRef + '$$"]').should('have.focus')
  });
  it('creazione nuovo parametro con 2 value, 1 solo valido + test dei rispettivi resultRequest ', () => {
    cy.get('button[id = btn-create-elementParameter-\\$\\$' + elementRef + '\\$\\$]').click()
    cy.get('button[id = btn-create-elementParameter-\\$\\$' + elementRef + '\\$\\$]').click()

    cy.get('#select-parameter14-\\$\\$' + elementRef + '\\$\\$').should('have.text', 'Inter Trigger TimerTrigger Count')
    cy.get('#select-parameter14-\\$\\$' + elementRef + '\\$\\$').select('InterTriggerTimer')

    cy.get('#btn-create-parameter14-value').click()

    cy.get('#parameter14-value-picker-24').select('StringParameter')

    cy.get('#parameter14-value-instance-input-24').type(12)
    cy.get('#parameter14-value-result-picker-24').select('count')

    cy.get('#parameter14-resultRequest-picker-23').select('sum')
  })

  it('controllo salvataggio', () => {
    cy.get('#scenario-picker').select('S3').select('S2');
    cy.get('[data-element-id="' + elementRef + '"]').trigger('click')

    cy.get('#select-parameter13-\\$\\$' + elementRef + '\\$\\$').should('have.value', 'InterTriggerTimer');

    cy.get('#parameter13-value-picker-23').should('have.value', 'StringParameter')

    cy.get('#parameter13-value-instance-input-23').should('have.value', '12')
    cy.get('#parameter13-value-result-picker-23').should('have.value', 'count')

    cy.get('#parameter13-resultRequest-picker-22').should('have.value', 'sum')
  })

});

describe('TEST_9 Manipolazione parametri per Connecting Objects', () => {

  let elementRef = "_10-740";

  it('click di un connecting object dell\'svg e check del focus su di esso', () => {
    cy.get('[data-element-id="' + elementRef + '"]').trigger('click')
    cy.get('input[id*="$$' + elementRef + '$$"]').should('have.focus')
  });
  it('creazione nuovo parametro con 2 value, 1 solo valido property + test dei rispettivi resultRequest ', () => {
    cy.get('button[id = btn-create-elementParameter-\\$\\$' + elementRef + '\\$\\$]').click()
    cy.get('button[id = btn-create-elementParameter-\\$\\$' + elementRef + '\\$\\$]').click()

    cy.get('#select-parameter15-\\$\\$' + elementRef + '\\$\\$').should('have.text', 'ProbabilityConditionProperty')

    cy.get('#select-parameter15-\\$\\$' + elementRef + '\\$\\$').select('Probability')
    cy.get('#select-parameter16-\\$\\$' + elementRef + '\\$\\$').select('Property')

    cy.get('#divType-parameter16-\\$\\$' + elementRef + '\\$\\$ > .btn').click()

    cy.get('#btn-create-property3-value').click()

    cy.get('#property3-value-picker-26').select('EnumParameter')

    cy.get('#property3-value-result-picker-26').select('mean')
  })

  it('controllo salvataggio', () => {
    cy.get('#scenario-picker').select('S3').select('S2');
    cy.get('[data-element-id="' + elementRef + '"]').trigger('click')

    cy.get('#select-parameter14-\\$\\$' + elementRef + '\\$\\$').should('have.value', 'Property')

    cy.get('#property3-value-picker-25').should('have.value', 'EnumParameter')

    cy.get('#property3-value-result-picker-25').should('have.value', 'mean')

  })
});

describe('TEST_10 Manipolazione parametri per Resources', () => {
  it('creazione nuovo parametro in resourcescon 2 value, 1 solo valido property + test dei rispettivi resultRequest ', () => {
    cy.get('#button-resources').click()

    cy.get('#resource-id-input\\$\\$resource_Front_Office\\$\\$').type('nuovoID')

    cy.get('button[id=btn-deleteParameter15-\\$\\$resource_Front_Office\\$\\$]').click()

    cy.get('button[id=btn-create-elementParameter-\\$\\$resource_Front_Office\\$\\$]').click()

    cy.get('#select-parameter16-\\$\\$resource_Front_Office\\$\\$').should('have.text', 'AvailabilityQuantityRoleSelectionFixed CostUnit Cost')

    cy.get('#select-parameter16-\\$\\$resource_Front_Office\\$\\$').select('Role')

    cy.get('#btn-create-role').click()

    cy.get('#btn-create-role1-value').click()

    cy.get('#role1-value-picker-28').select('BooleanParameter')

    cy.get('#role1-value-result-picker-28').select('mean')

    cy.get('#role1-resultRequest-picker-27').select('max')
  })

  it('controllo salvataggio', () => {
    cy.get('#scenario-picker').select('S4').select('S2')

    cy.get('#elem-par-btn').click()

    cy.get('#button-resources').click()

    cy.get('#resource-id-input\\$\\$resource_Front_Office\\$\\$').should('have.value', 'nuovoID')

    cy.get('#select-parameter15-\\$\\$resource_Front_Office\\$\\$').should('have.value', 'Role')

    cy.get('#role1-value-picker-27').should('have.value', 'BooleanParameter')

    cy.get('#role1-value-result-picker-27').select('mean')

    cy.get('#role1-resultRequest-picker-26').select('max')

  })
});

describe('TEST_11 Generazione del file finale', () => {

  it('Test click corretto del tasto di generazione file .bpmn', () => {
    cy.get('#generate-bpsim').click();
  });

});

describe('TEST_12 Controllare diagramma con la decomposition con diagramma senza BPSim', () => {

  it('apertura file .html', () => {
    cy.visit('./../../../dist/index.html')
  })

  it('aggiunta del file con decomposition e senza BPSim e apertura al drop', function () {

    const fileName = '../../resources/DecompositionWithoutBPSim.bpmn';

    cy.fixture(fileName).then(fileContent => {
      cy.get('#js-drop-zone').upload(
        { fileContent, fileName, mimeType: 'text/xml', encoding: 'utf-8' },
        { subjectType: 'drag-n-drop' },
      );
    });

  })

  it('controllo picker vuoto e funzionalità disabilitate (Diagramma senza BPSim)', function () {
    cy.get('#scenario-picker').should('have.value', null);
    cy.get('#generate-bpsim').should('be.disabled');
    cy.get('#delete-scenario').should('be.disabled');
    cy.get('#scenario-displayed').should('have.css', 'display', 'none');

  })

  it('creazione scenario con element parameter con decomposition', () => {
    cy.get('#create-scenario').trigger('click')
    cy.get('.vex-dialog-input > input').type('NuovoScenario')
    cy.get('.vex-dialog-button-primary').click()

  });

  let elementRef
  it('click di un\'activity dell\'svg (con decomposizione), check del focus su di essa e check che deve avere meno cose per incoming', () => {
    elementRef = "Task_19rd0am";
    cy.get('[data-element-id="' + elementRef + '"]').trigger('click')
    cy.get('input[id*="$$' + elementRef + '$$"]').should('have.focus')
    cy.get('button[id=btn-create-elementParameter-\\$\\$' + elementRef + '\\$\\$]').click();
    cy.get('#select-parameter1-\\$\\$' + elementRef + '\\$\\$').should('have.text', 'Fixed CostUnit CostProperty');
  });

  it('click di un\'activity dell\'svg (con decomposizione), check del focus su di essa e check che deve avere meno cose per incoming e decomposition', () => {
    elementRef = 'Task_07b3goa';
    cy.get('[data-element-id="' + elementRef + '"]').trigger('click')
    cy.get('input[id*="$$' + elementRef + '$$"]').should('have.focus')
    cy.get('button[id=btn-create-elementParameter-\\$\\$' + elementRef + '\\$\\$]').click();
    cy.get('#select-parameter2-\\$\\$' + elementRef + '\\$\\$').should('have.text', 'Fixed CostUnit CostProperty');
  });

  it('click di un\'activity dell\'svg, check del focus su di essa e check che deve avere tutto', () => {
    elementRef = 'SubProcess_1h4kdmv';
    cy.get('[data-element-id="' + elementRef + '"]').trigger('click')
    cy.get('input[id*="$$' + elementRef + '$$"]').should('have.focus')
    cy.get('button[id=btn-create-elementParameter-\\$\\$' + elementRef + '\\$\\$]').click();
    cy.get('#select-parameter3-\\$\\$' + elementRef + '\\$\\$').should('have.text', 'Transfer TimeQueue TimeWait TimeSetup TimeProcessing TimeValidation TimeRework TimeInter Trigger TimerTrigger CountFixed CostUnit CostPropertyQueue LengthInterruptiblePriority');
  });

  it('click di un\'activity dell\'svg (con decomposizione), check del focus su di essa e check che deve avere meno cose per decomposition', () => {
    elementRef = 'SubProcess_0p2q579';
    cy.get('[data-element-id="' + elementRef + '"]').trigger('click')
    cy.get('input[id*="$$' + elementRef + '$$"]').should('have.focus')
    cy.get('button[id=btn-create-elementParameter-\\$\\$' + elementRef + '\\$\\$]').click();
    cy.get('#select-parameter4-\\$\\$' + elementRef + '\\$\\$').should('have.text', 'Fixed CostUnit CostProperty');
  });



});



