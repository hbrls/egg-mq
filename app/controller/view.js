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
  }

  return ViewController;
};
