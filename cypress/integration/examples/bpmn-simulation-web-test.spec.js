// import firstdiagramXML from '../../../resources/firstDiagram.bpmn';

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('TEST_0 Avvio', () => {

  it('apertura file .html', () => {
    // cy.viewport(50,50)
    cy.visit('./../../../dist/index.html')
  })

})

describe('TEST_1 Drag-n-Drop', function () {

  it('esistenza dropzone con dicitura', function () {
    cy.get('#js-drop-zone')
      .should('contain', 'Drop your BPMN diagram here')
  })

  describe('fase eventi drag-n-drop', function () {
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