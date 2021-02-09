function test_createClientTrelloBoard() {
  settings = initializeSettings();
  checkTrelloAccess();
  const allReponses = FormApp.getActiveForm().getResponses();
  const lastResponse = allReponses[allReponses.length - 1];
  formData = getAnswers(lastResponse);
  const templateBoard = getTemplateBoard();
  const clientBoard = createBoard(templateBoard.id, formData.COMPANY_NAME);
  customizeBoardTemplate(clientBoard.id);
}

function onOpen() {
  const menuName = 'Automation';
  const menuItemName = 'Create Trello board';
  FormApp.getUi()
    .createMenu(menuName)
    .addItem(menuItemName, 'test_createClientTrelloBoard')
    .addToUi();
}
