function updateListName(listID, newName) {
  return makeRequest({
    method: 'PUT',
    endpoint: `/lists/${listID}/name`,
    payload: {
      value: newName,
    },
    errorMessage: "Failed to update list's name.",
  });
}
