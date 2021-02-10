// OAuth1 library required: https://github.com/googleworkspace/apps-script-oauth1/
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
  const apiKey = PropertiesService.getScriptProperties().getProperty(
    settings.apiKeyProperty
  );
  const apiSecret = PropertiesService.getScriptProperties().getProperty(
    settings.apiSecretProperty
  );

  return OAuth1.createService('trello')
    .setAccessTokenUrl(settings.trelloGetTokenURL)
    .setRequestTokenUrl(settings.trelloRequestTokenURL)
    .setAuthorizationUrl(settings.trelloAuthorizeTokenURL)
    .setConsumerKey(apiKey)
    .setConsumerSecret(apiSecret)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties());
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
