const Service = require('egg').Service;

module.exports = class Mq extends Service {
  producer(exchange, topic, payload) {
    const action = { topic, payload };
    this.app.messenger.send(`@@egg-mq/producer/${exchange}`, action);
  }
}
