import app from '../../src/app';

describe('\'app\' service', () => {
  it('registered the service', () => {
    const service = app.service('app');
    expect(service).toBeTruthy();
  });
});
