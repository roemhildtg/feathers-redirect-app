import { ServiceAddons, Params } from '@feathersjs/feathers';
import { AuthenticationService, JWTStrategy, AuthenticationResult } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { expressOauth } from '@feathersjs/authentication-oauth';
import {OAuthStrategy} from '@feathersjs/authentication-oauth';
import querystring from 'querystring';

class Custom extends OAuthStrategy {

  async getEntityData(profile: any, existing: any, params: any) {
    // Include the `email` from the GitHub profile when creating
    // or updating a user that logged in with GitHub
    const baseData = await super.getEntityData(profile, existing, params);

    return {
      ...baseData,
      email: profile.email,
      name: profile.name,
    };
  }


  async getRedirect (data: AuthenticationResult|Error, params?: Params) {
    const queryRedirect = (params && params.redirect) || '';
    let redirectUrl;

    // use app redirect to look up app service by id and return a 
    // stored redirect uri
    if(queryRedirect){
      const service = this.app?.service('app-redirect');
      const app = await service.get(queryRedirect).catch(e => {
        console.warn(e)
        return null;
      });
      redirectUrl = app?.redirectUri;
    } 

    if(!redirectUrl) {
      redirectUrl = this.authentication.configuration.oauth.redirect;
    }

    if (!redirectUrl) {
      return null;
    }

    const separator = redirectUrl.endsWith('?') ? '' :
      (redirectUrl.indexOf('#') !== -1 ? '&' : '#');
    const authResult: AuthenticationResult = data;
    const query = authResult.accessToken ? {
      access_token: authResult.accessToken
    } : {
      error: data.message || 'OAuth Authentication not successful'
    };

    return redirectUrl + separator + querystring.stringify(query);
  }

}

import { Application } from './declarations';

declare module './declarations' {
  interface ServiceTypes {
    'authentication': AuthenticationService & ServiceAddons<any>;
  }
}

export default function(app: Application) {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  authentication.register('github', new Custom());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
}
