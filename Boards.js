function getTemplateBoard() {
  const searchResult = makeRequest({
    method: 'GET',
    endpoint: `/search`,
    params: {
      modelTypes: 'boards',
      query: `name:"${settings.templateBoardName}"`,
    },
    errorMessage: 'Failed to get template board ID.',
  });

  return searchResult.boards[0];
}

function createBoard(templateBoardID, boardName) {
  return makeRequest({
    method: 'POST',
    endpoint: `/boards`,
    payload: {
      name: boardName,
      idBoardSource: templateBoardID,
      keepFromSource: 'cards',
    },
    errorMessage: 'Failed to create board based on template.',
  });
}

function getBoardLists(boardID) {
  return makeRequest({
    method: 'GET',
    endpoint: `/boards/${boardID}/lists`,
    errorMessage: 'Failed to get board lists.',
  });
}

function getBoardCards(boardID) {
  return makeRequest({
    method: 'GET',
    endpoint: `/boards/${boardID}/cards`,
    errorMessage: 'Failed to get board cards.',
  });
}

function invitePersonToBoard(boardID) {
  return makeRequest({
    method: 'PUT',
    endpoint: `/boards/${boardID}/members`,
    payload: {
      email: formData.EMAIL,
      fullName: formData.CONTACT_PERSON,
    },
    errorMessage: 'Failed to invite person to board.',
  });
}

function customizeBoard(boardID) {
  // Update cards
  const boardCards = getBoardCards(boardID);
  for (const card of boardCards) {
    switch (card.name) {
      case 'Welcome! - START HERE':
        updateCardDescription(card, {
          CONTACT_PERSON: formData.CONTACT_PERSON,
          COMPANY_NAME: formData.COMPANY_NAME,
        });
        break;
      case 'Sharing Files':
      case 'Your Logo and Branding Materials':
        updateCardDescription(card, {
          CLIENT_FOLDER_URL: formData.CLIENT_FOLDER_URL,
        });
        break;
      case 'Viewing the Work In Progress':
        updateCardDescription(card, {
          WEBSITE_DEVELOPMENT_URL: formData.WEBSITE_DEVELOPMENT_URL,
        });
        break;
      case 'Questionnaire':
        updateCardDescription(card, {
          QUESTIONNAIRE_ANSWERS: formData.QUESTIONNAIRE_ANSWERS,
        });
        break;
      case 'Customer Avatar':
        updateCardDescription(card, {
          TARGET_AUDIENCE: formData.TARGET_AUDIENCE,
        });
        break;
      case 'Website Design Inspiration':
        updateCardDescription(card, {
          LIKED_WEBSITES: formData.LIKED_WEBSITES,
          DONT_LIKE: formData.DONT_LIKE,
        });
        break;
      case 'Potential Themes':
        updateCardDescription(card, {
          COLOR_SCHEME: formData.COLOR_SCHEME,
          FONTS: formData.FONTS,
        });
        break;
      case 'Functionality':
        createFunctionalitiesChecklist(card.id, formData.FUNCTIONALITIES);
        break;
      default:
        break;
    }
  }

  // Update client's To Do list name
  const boardLists = getBoardLists(boardID);
  for (const list of boardLists) {
    if (list.name === '{{CONTACT_PERSON}} To Do') {
      const listNewName = list.name.replace(
        '{{CONTACT_PERSON}}',
        formData.CONTACT_PERSON
      );
      updateListName(list.id, listNewName);
    }
  }

  // Invite client to board
  invitePersonToBoard(boardID);
}
