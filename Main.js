let settings = {};
let formData = {};

function onSubmit(e) {
  settings = initializeSettings();
  formData = getAnswers(e.response);
  checkTrelloAccess();
  const templateBoard = getTemplateBoard();
  const clientBoard = createBoard(templateBoard.id, formData.COMPANY_NAME);
  customizeBoardTemplate(clientBoard.id);
}

function initializeSettings() {
  return {
    apiBaseURL: 'https://api.trello.com/1/',
    templateBoardName: 'Web Design Project Management (Template)',
    clientsRootFolderID: '1Ud11i2VojMCujQx6fugC3VVwGne0T1Rc',
    apiKeyProperty: 'TRELLO_API_KEY',
    apiSecretProperty: 'TRELLO_API_SECRET',
    trelloGetTokenURL: 'https://trello.com/1/OAuthGetAccessToken',
    trelloRequestTokenURL: 'https://trello.com/1/OAuthGetRequestToken',
    trelloAuthorizeTokenURL:
      'https://trello.com/1/OAuthAuthorizeToken?scope=read,write',
  };
}
