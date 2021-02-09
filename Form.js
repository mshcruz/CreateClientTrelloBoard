function onSubmit(e) {
  settings = initializeSettings();
  formData = getAnswers(e.response);
  checkTrelloAccess();
  const templateBoard = getTemplateBoard();
  const clientBoard = createBoard(templateBoard.id, formData.COMPANY_NAME);
  customizeBoardTemplate(clientBoard.id);
}

function getAnswers(response) {
  const responses = response.getItemResponses();
  return {
    COMPANY_NAME: responses[0].getResponse(),
    CONTACT_PERSON: responses[1].getResponse(),
    WEBSITE_URL: responses[2].getResponse(),
    SLOGAN_TAGLINE: responses[3].getResponse(),
    ORGANIZATION_SUMMARY: responses[4].getResponse(),
    TARGET_AUDIENCE: responses[5].getResponse(),
    LIKED_WEBSITES: responses[6].getResponse(),
    DONT_LIKE: responses[7].getResponse(),
    KEYWORDS: responses[8].getResponse(),
    FUNCTIONALITIES: responses[9].getResponse(),
    COLOR_SCHEME: responses[10].getResponse(),
    FONTS: responses[11].getResponse(),
    CONTACT_FREQUENCY: responses[12].getResponse(),
    CONTACT_METHOD: responses[13].getResponse(),
    PROJECT_MANAGEMENT: responses[14].getResponse(),
    EMAIL: response.getRespondentEmail(),
    CLIENT_FOLDER_URL: createClientFolder(responses[0].getResponse()).getUrl(),
    WEBSITE_DEVELOPMENT_URL: getWebsiteDevelopmentURL(
      responses[0].getResponse()
    ),
    QUESTIONNAIRE_ANSWERS: formatQuestionsAndAnswers(responses),
  };
}

function createClientFolder(companyName) {
  if (!companyName) {
    throw new Error(
      'Failed to create client folder: Company name not specified.'
    );
  }
  return DriveApp.getFolderById(settings.clientsRootFolderID).createFolder(
    companyName
  );
}

function getWebsiteDevelopmentURL(companyName) {
  if (!companyName) {
    throw new Error(
      'Failed to create development URL: Company name not specified.'
    );
  }

  return `${encodeURIComponent(
    companyName.toLowerCase().replace(/[^\x00-\x7F\s]/g, '')
  )}.greatwebsites.com/dev`;
}

function formatQuestionsAndAnswers(responses) {
  let formattedQuestionsAndAnswers = [];
  for (let i = 0; i < responses.length; i++) {
    formattedQuestionsAndAnswers.push(
      `**Q: ${responses[i].getItem().getHelpText()}**
      A: ${responses[i].getResponse()}`
    );
  }
  return formattedQuestionsAndAnswers.join('\r\n\r\n');
}
