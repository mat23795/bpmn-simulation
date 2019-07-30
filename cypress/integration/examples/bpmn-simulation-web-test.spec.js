
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('TEST_0 Avvio', () => {

  it('apertura file .html', () => {
    cy.visit('./../../../dist/index.html')
  })

})

describe('TEST_1 Drag-n-Drop', function () {


  it('esistenza dropzone con dicitura', function () {
    cy.get('#js-drop-zone')
      .should('contain', 'Drop your BPMN diagram here')
  })

  describe('1.1 Fase eventi drag-n-drop', function () {
    it('cambio colore dropzone quando si passa sopra', function () {
      cy.get('#js-drop-zone')
        .trigger('dragover')
        .should('have.css', 'background-color', 'rgb(240, 248, 255)')
        .trigger('dragleave')
        .should('have.css', 'background-color', 'rgb(255, 255, 255)')
    })

    it('aggiunta del file e apertura al drop', function () {

      // const fileName = '../../resources/firstDiagram.bpmn';
      // const fileName = '../../resources/2_CarRepairProcessV2.bpmn';
      // const fileName = '../../resources/1_CarRepairProcessV1.bpmn';
      // const fileName = '../../resources/3_LoanProcessV1.bpmn';
      // const fileName = '../../resources/4_LoanProcessV2.bpmn';
      // const fileName = '../../resources/5_TechnicalSupportProcessV1.bpmn';
      // const fileName = '../../resources/6_TechnicalSupportProcessV1_1.bpmn';
      const fileName = '../../resources/7_TechnicalSupportProcessV2.bpmn';

      cy.fixture(fileName).then(fileContent => {
        cy.get('#js-drop-zone').upload(
          { fileContent, fileName, mimeType: 'text/xml', encoding: 'utf-8' },
          { subjectType: 'drag-n-drop' },
        );
      });

    })

  })
})

// describe('TEST_2 Eventi al click degli elementi nell\'svg', () => {
//   let elementRef;

//   it('click di un\'activity dell\'svg e check del focus su di esso', () => {
//     elementRef = "_10-235";
//     cy.get('[data-element-id="'+elementRef+'"]').trigger('click')
//     cy.get('input[id*="$$'+elementRef+'$$"]').should('have.focus')
//   });

//   it('click di un event dell\'svg e check del focus su di esso',() =>{
//     elementRef = "_10-42";
//     cy.get('[data-element-id="'+elementRef+'"]').trigger('click')
//     cy.get('input[id*="$$'+elementRef+'$$"]').should('have.focus')
//   });

//   it('click di un gateway dell\'svg e check del focus su di esso',() =>{
//     elementRef = "_10-593";
//     cy.get('[data-element-id="'+elementRef+'"]').trigger('click')
//     cy.get('input[id*="$$'+elementRef+'$$"]').should('have.focus')
//   });

//   it('click di un connecting object dell\'svg e check del focus su di esso',() =>{
//     elementRef = "_10-740";
//     cy.get('[data-element-id="'+elementRef+'"]').trigger('click')
//     cy.get('input[id*="$$'+elementRef+'$$"]').should('have.focus')
//   });

// })

describe('TEST_3 Manipolazione di Scenarios', () => {
  it('elementi del picker corretti', () => {
    // cy.get('#scenario-picker')
    cy.get('#scenario-picker').should('have.text', 'S1S2S3').should('have.value', '1');


  });

  describe('3.1 Creazione di un nuovo Scenario', () => {
    it('inserimento id corretto per il nuovo scenario', () => {
      cy.get('#create-scenario').trigger('click')
      cy.get('.vex-dialog-input > input').type('NuovoScenario')
      cy.get('.vex-dialog-button-primary').click()

      cy.get('#scenario-picker').should('have.text', 'S1S2S3NuovoScenario').should('have.value', '4');
      // cy.get('#scenario-picker').find(':selected').contains('S4')

      cy.get('#scenario-id-input').should('have.value', 'NuovoScenario')

    });

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
  describe('5.1 Manipolazione parametro di tipo date di Scenario', () => {
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

      it('crezione nuovo value a start ed errore già usato', () => {
        cy.get('#btn-create-start-value').click();
        cy.get('#start-value-picker-18').select('EnumParameter');
        cy.get('#btn-create-start-value-enumParameter-values-18').click();
      })

      it('cambio resultRequest di start', () => {
        cy.get('#start-resultRequest-picker-0').select('max');
      })

      it('eliminazione parameter values di warmup', () => {
        cy.get('#btn-deleteParameter-warmup-value-4').click();
        cy.get('#warmup-value-div-4').should('not.exist');
      });

      // it('aggiunta di parameter (UserDistribution con 1 point) a duration', () => {
      //   cy.get('#btn-create-duration-value').click();
      //   cy.get('#duration-value-picker-18').select('UserDistribution');
      //   cy.get('#duration-value-result-picker-18').select('max');
      //   cy.get('#btn-create-duration-points-userDistribution-18').click();
      //   cy.get('#btn-create-point1-value').click();
      //   cy.get('#point1-value-picker-20').select("BooleanParameter");
      //   cy.get('#point1-value-content-div-20 > .onoffswitch > .onoffswitch-label > .onoffswitch-switch').click();
      // });

      // it('controllo salvataggio modifiche al cambio di scenario', () => {
      //   cy.get('#scenario-picker').select('S3').select('S2');
      //   cy.get('#scen-par-btn').click()

      //   cy.get('#warmup-value-div-4').should('not.exist');
      //   cy.get('#duration-value-div-4').should('exist');
      //   cy.get('#duration-value-picker-4').should('have.value','UserDistribution');
      //   cy.get('#duration-value-result-picker-4').should('have.value','max');
      //   cy.get('#point1-value-picker-6').should('have.value',"BooleanParameter");
      //   cy.get('#point1-value-value-booleanParameter-input-6').should('have.value', 'on');
      // })


    });

    describe('5.2.2 Manipolazione parameters', () => {

    });

  });
});

// describe('TEST_6 Manipolazione parametri per Activities', () => {

// });

// describe('TEST_7 Manipolazione parametri per Events', () => {

// });

// describe('TEST_8 Manipolazione parametri per Gateways', () => {

// });

// describe('TEST_9 Manipolazione parametri per Connecting Objects', () => {

// });

// describe('TEST_10 Manipolazione parametri per Resources', () => {

// });

// describe('TEST_11 Controllare diagramma con la decomposition', () => {

// });

// describe('TEST_12 Gestione di un diagramma senza notazione BPSim', () => {

// });

// describe('TEST_13 Generazione del file finale', () => {

// });

// describe('TEST_', () => {

// });



