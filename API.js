function checkTrelloAccess() {
  const trelloService = getTrelloService();
  if (!trelloService.hasAccess()) {
    const authorizationUrl = trelloService.authorize();
    const template = HtmlService.createTemplate(
      '<a href="<?= authorizationUrl ?>" target="_blank">Authorize integration with Trello</a>. <br/><br/>Rerun the script after authorizing.'
    );
    template.authorizationUrl = authorizationUrl;
    const page = template.evaluate();
    FormApp.getUi().showModalDialog(page, 'Authorization');
  }
}

function getTrelloService() {
  // Create a new service with the given name. The name will be used when
  // persisting the authorized token, so ensure it is unique within the
  // scope of the property store.
  const apiKey = PropertiesService.getScriptProperties().getProperty(
    settings.apiKeyProperty
  );
  const apiSecret = PropertiesService.getScriptProperties().getProperty(
    settings.apiSecretProperty
  );
  return (
    OAuth1.createService('trello')
      // Set the endpoint URLs.
      .setAccessTokenUrl(settings.trelloGetTokenURL)
      .setRequestTokenUrl(settings.trelloRequestTokenURL)
      .setAuthorizationUrl(settings.trelloAuthorizeTokenURL)
      // Set the consumer key and secret.
      .setConsumerKey(apiKey)
      .setConsumerSecret(apiSecret)
      // Set the name of the callback function in the script referenced
      // above that should be invoked to complete the OAuth flow.
      .setCallbackFunction('authCallback')
      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties())
  );
}

function authCallback(request) {
  settings = initializeSettings();
  const trelloService = getTrelloService();
  const isAuthorized = trelloService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
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
