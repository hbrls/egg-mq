'use strict';
const fs = require('fs');
const path = require('path');
const envfile = fs.readFileSync(path.resolve(__dirname, './envfile'), 'utf-8').split('\n');
const mq = require('./mq.json');


module.exports = app => {
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
    rabbitmq: {
      address: props['rabbitmq.address'],
      port: props['rabbitmq.port'],
      username: props['rabbitmq.username'],
      password: props['rabbitmq.password'],
    },
    ...mq,
  };

  return config;
};
