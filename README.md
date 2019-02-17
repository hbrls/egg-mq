egg-mq
==

## Install

```bash
$ npm i egg-mq --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.mq = {
  enable: true,
  package: 'egg-mq',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
const mq = require('./mq.json');

exports.mq = {
  rabbitmq: { address, port, username, password },
  ...mq
};
```

```json
// {app_root}/config/mq.json
{
  "producers": [
    {
      "exchange": "eggmqproducer.exchange.message",
      "exchangeType": "topic"
    }
  ],
  "consumers": [
    {
      "exchange": "eggmqproducer.exchange.message",
      "exchangeType": "topic",
      "queue": "eggmqconsumer.queue.textMessage",
      "topic": "text.*",
      "consumer": "foo.bar"
    }
  ]
}
```

## Example

```js
// producer
ctx.service.mq.producer('some.exchange', 'some.topic', payload);
// ctx.service.consumer
async consumer(topic, payload) {
  ctx.logger.info(payload);
}
```

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
