let settings = {};
let formData = {};

function initializeSettings() {
  return {
    // Base URL of Trello's API, including its current version
    apiBaseURL: 'https://api.trello.com/1/',
    // Name of the board used as template for clients' boards
    templateBoardName: 'Web Design Project Management (Template)',
    // ID of the folder in Google Drive where a client's folder should be created
    clientsRootFolderID: '1Ud11i2VojMCujQx6fugC3VVwGne0T1Rc',
    // Base URL of the development version of the website created for the client
    devWebsiteBaseURL: '.greatwebsites.com/dev',
    // Name of the script property that holds the Trello API key
    apiKeyProperty: 'TRELLO_API_KEY',
    // Name of the script property that holds the Trello API secret
    apiSecretProperty: 'TRELLO_API_SECRET',
    // URLs used for OAuth (from: https://developer.atlassian.com/cloud/trello/guides/rest-api/authorization/#using-basic-oauth)
    trelloGetTokenURL: 'https://trello.com/1/OAuthGetAccessToken',
    trelloRequestTokenURL: 'https://trello.com/1/OAuthGetRequestToken',
    trelloAuthorizeTokenURL:
      'https://trello.com/1/OAuthAuthorizeToken?scope=read,write',
  };
}

// Prepare and execute a HTTP request
function makeRequest(config) {
  const requestOptions = {};
  if (config.hasOwnProperty('method')) {
    requestOptions.method = config.method;
  }
  if (config.hasOwnProperty('payload')) {
    requestOptions.payload = config.payload;
  }
  let url = settings.apiBaseURL + config.endpoint;
  if (config.hasOwnProperty('params')) {
    url = url + stringifyParameters(config.params);
  }
  const trelloService = getTrelloService();
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
