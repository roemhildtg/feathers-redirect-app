// Initializes the `app-redirect` service on path `/app-redirect`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { AppRedirect } from './app-redirect.class';
import createModel from '../../models/app-redirect.model';
import hooks from './app-redirect.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'app-redirect': AppRedirect & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/app-redirect', new AppRedirect(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('app-redirect');

  service.hooks(hooks);
}
