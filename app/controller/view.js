module.exports = app => {
  class ViewController extends app.Controller {
    async index() {
      const { ctx } = this;
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: 'egg-mq ok',
      };
    }

    async producer() {
      const { ctx, app: { messenger } } = this;

      const action = {
        type: ctx.query.topic || 'text.a',
        payload: { from: ctx.query.name || 'none' },
      };
      messenger.send('eggmqproducer.exchange.message', action);

      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: 'egg-mq producer ok',
      };
    }
  }

  return ViewController;
};
