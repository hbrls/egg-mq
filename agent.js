'use strict';
const amqp = require('amqplib');

module.exports = agent => {
  agent.messenger.on('egg-ready', async () => {
    const config = agent.config.mq;
    console.log(config);

    const conn = await amqp.connect(config.rabbitmq);

    const channel = await conn.createChannel();

    await channel.assertExchange(config.exchange, config.exchangeType, { durable:true });

    const ok = await channel.assertQueue(config.queue, { exclusive: false });

    await channel.bindQueue(ok.queue, config.exchange, 'top.*');

    console.log('consume');

    await channel.consume(ok.queue, (msg) => {
      console.log(msg);
      console.log(msg.content.toString());

      // agent.messenger.sendRandom('xxx_action', JSON.parse(msg.content.toString()))

      // console.log(`[Key: ${msg.fields.routingKey}] ${msg.content.toString()}`);

      // channel.ack(msg);
    });
  });

  // agent.beforeStart(async () => {
  //
  // });
};
