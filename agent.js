'use strict';
const amqp = require('amqplib');

module.exports = agent => {
  agent.messenger.on('egg-ready', async () => {
    const config = agent.config.mq;
    // console.log(config);
    const { rabbitmq, producers, consumers } = config;

    const { address, port, username, password } = rabbitmq;
    const endpoint = `amqp://${username}:${encodeURIComponent(password)}@${address}:${port}`;
    const conn = await amqp.connect(endpoint); // amqp.connect(endpoint, function (err, conn) { ... });

    for (let i = 0; i < producers.length; i += 1) {
      const channel = await conn.createChannel(); // conn.createChannel(function (err, channel) { ... });

      const { exchange, exchangeType } = producers[i];

      await channel.assertExchange(exchange, exchangeType, { durable: true });
      agent.logger.info('[egg-mq producer register]', exchange);

      agent.messenger.on(`@@egg-mq/producer/${exchange}`, ({ topic, payload }) => {
        const msg = JSON.stringify(payload);
        agent.logger.info('[egg-mq producer out]', topic, msg);
        channel.publish(exchange, topic, new Buffer(msg));
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
          agent.messenger.sendRandom(`@@egg-mg/consumer`, {
            topic: routingKey,
            consumer: consumer,
            payload: JSON.parse(content),
          });

          channel.ack(msg);
        });
    }
  });
};
