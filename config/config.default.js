'use strict';
const fs = require('fs');
const path = require('path');
const envfile = fs.readFileSync(path.resolve(__dirname, './envfile'), 'utf-8').split('\n');


module.exports = appInfo => {
  const config = {};

  config.keys = 'egg-mq-local-key';

  const props = {};
  envfile.forEach(p => {
    if (p) {
      const idx = p.indexOf('=');
      const k = p.substring(0, idx);
      const v = p.substring(idx + 1);
      if (k && v) {
        props[k] = v;
      }
    }
  });
  config.props = props;

  config.mq = {
    rabbitmq: `amqp://${props['rabbitmq.username']}:${encodeURIComponent(props['rabbitmq.password'])}@${props['rabbitmq.address']}:${props['rabbitmq.port']}`,
    producers: [
      {
        exchange: 'eggmqproducer.exchange.message',
        exchangeType: 'topic',
      },
    ],
    consumers: [
      {
        exchange: 'eggmqproducer.exchange.message',
        exchangeType: 'topic',
        queue: 'eggmqconsumer.queue.textMessage',
        topic: 'text.*',
        service: 'foo.bar',
      },
    ],
  };

  return config;
};
