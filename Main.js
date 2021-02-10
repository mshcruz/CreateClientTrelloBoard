let settings = {};
let formData = {};

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

function makeRequest(config) {
  const trelloService = getTrelloService();
  const requestOptions = {
    method: config.method,
  };
  if (config.payload) {
    requestOptions.payload = config.payload;
  }
  let url = settings.apiBaseURL + config.endpoint;
  if (config.params) {
    url = url + stringifyParameters(config.params);
  }
  const response = trelloService.fetch(url, requestOptions);
  if (response.getResponseCode() !== 200) {
    throw new Error(config.errorMessage);
  }

  return JSON.parse(response.getContentText());
}

// Create a query parameters string based on the received object
function stringifyParameters(params) {
  return (
    '?' +
    Object.keys(params)
      .map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      })
      .join('&')
  );
}
