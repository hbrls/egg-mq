const Service = require('egg').Service;


module.exports = class Foo extends Service {
  async bar(topic, payload) {
    this.ctx.logger.info(topic, payload);
  }
}
