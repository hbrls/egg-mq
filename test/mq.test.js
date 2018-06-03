'use strict';

const mock = require('egg-mock');

describe('test/mq.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/mq-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, mq')
      .expect(200);
  });
});
