const region = 'us-east-1';

export default {
    apiGateway: {
      REGION: region,
      URL:  'https://xmti7wo0fc.execute-api.us-east-1.amazonaws.com/dev/',
    },
    cognito: {
      REGION: region,
      USER_POOL_ID: "us-east-1_pmH9qLijt",
      APP_CLIENT_ID: "3o4gle8nki344etojhho7ebrve",
      IDENTITY_POOL_ID: "us-east-1:94a9620e-47df-4820-9281-5b5b5d9bcd46"
    }
  };