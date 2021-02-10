function updateCardDescription(card, updateFields) {
  let description = card.desc;
  for (const [key, value] of Object.entries(updateFields)) {
    description = description.replace(`{{${key}}}`, value);
  }

  return makeRequest({
    method: 'PUT',
    endpoint: `/cards/${card.id}`,
    payload: {
      desc: description,
    },
    errorMessage: "Failed to update card's description.",
  });
}

function createFunctionalitiesChecklist(cardID, functionalities) {
  const checklistName = 'What the website needs';
  const checklist = createCardChecklist(cardID, checklistName);
  for (const functionality of functionalities) {
    createChecklistItem(checklist.id, functionality);
  }
}

function createCardChecklist(cardID, checklistName) {
  return makeRequest({
    method: 'POST',
    endpoint: '/checklists',
    payload: {
      idCard: cardID,
      name: checklistName,
    },
    errorMessage: 'Failed to create Functionalities checklist.',
  });
}

function createChecklistItem(checklistID, itemDescription) {
  return makeRequest({
    method: 'POST',
    endpoint: `/checklists/${checklistID}/checkItems`,
    payload: {
      name: itemDescription,
    },
    errorMessage: 'Failed to add item to checklist.',
  });
}
