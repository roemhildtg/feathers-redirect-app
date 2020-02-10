import app from '../../src/app';

describe('\'app-redirect\' service', () => {
  it('registered the service', () => {
    const service = app.service('app-redirect');
    expect(service).toBeTruthy();
  });
});
