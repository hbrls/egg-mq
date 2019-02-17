const Controller = require('egg').Controller;


module.exports = class ViewController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.status = 200;
    ctx.body = {
      code: 0,
      message: 'egg-mq ok',
    };
  }

  async producer() {
    const { ctx } = this;
    const topic = ctx.query.topic || 'text.a';
    const payload = { from: ctx.query.name || 'none' };
    this.service.mq.producer('eggmqproducer.exchange.message', topic, payload);

    ctx.status = 201;
    ctx.body = {
      code: 0,
      message: 'egg-mq producer ok',
    };
  }
};
