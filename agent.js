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

      const { exchange, exchangeType } = producers[i];

      await channel.assertExchange(exchange, exchangeType, { durable: true });
      agent.logger.info('[egg-mq producer register]', exchange);

      agent.messenger.on(exchange, ({ type, payload }) => {
        const msg = JSON.stringify(payload);
        agent.logger.info('[egg-mq producer out]', type, msg);
        channel.publish(exchange, type, new Buffer(msg));
      });
    }

    for (let i = 0; i < consumers.length; i += 1) {
        const channel = await conn.createChannel(); // conn.createChannel(function (err, channel) { ... });

        const { exchange, exchangeType, queue, topic, consumer } = consumers[i];
        // console.log(exchange, exchangeType, queue, topic, consumer);

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        const ok = await channel.assertQueue(queue, topic, { exclusive: false });
        // console.log(ok);

        await channel.bindQueue(queue, exchange, topic);
        agent.logger.info('[egg-mq consumer register]', exchange, queue);

        await channel.consume(ok.queue, (msg) => {
          const { fields: { routingKey } } = msg;
          const content = msg.content.toString();
          agent.logger.info('[egg-mq consumer in]', routingKey, content);
          agent.messenger.sendRandom(`@@egg-mg/queue`, {
            topic: routingKey,
            consumer: consumer,
            content: content,
          });

          channel.ack(msg);
        });
    }
  });
};
