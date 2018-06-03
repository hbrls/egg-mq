'use strict';
const amqp = require('amqplib');

module.exports = agent => {
  agent.messenger.on('egg-ready', async () => {
    const config = agent.config.mq;
    // console.log(config);

    const conn = await amqp.connect(config.rabbitmq); // amqp.connect(endpoint, function (err, conn) { ... });

    const { producers, consumers } = config;

    for (let i = 0; i < producers.length; i += 1) {
      const channel = await conn.createChannel(); // conn.createChannel(function (err, channel) { ... });

      const { exchange } = producers[i];
      // console.log(exchange);
      agent.messenger.on(exchange, ({ type, payload }) => {
        // console.log(type, payload);
        channel.publish(exchange, type, new Buffer(JSON.stringify(payload)));
      });
    }

    for (let i = 0; i < consumers.length; i += 1) {
        const channel = await conn.createChannel(); // conn.createChannel(function (err, channel) { ... });

        const { exchange, exchangeType, queue, topic, service } = consumers[i];
        // console.log(exchange, exchangeType, queue, topic, service);

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        const ok = await channel.assertQueue(queue, topic, { exclusive: false });
        // console.log(ok);

        await channel.bindQueue(queue, exchange, topic);

        await channel.consume(ok.queue, (msg) => {
          agent.messenger.sendRandom(`@@egg-mg/queue`, { type: service, payload: msg.content.toString() });
        });
    }
  });
};
