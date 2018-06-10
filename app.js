module.exports = app => {
  const ctx = app.createAnonymousContext({});

  app.messenger.on('@@egg-mg/queue', async ({ topic, consumer, content }) => {
    const [service, method] = consumer.split('.');
    ctx.runInBackground(async () => {
      ctx.service[service][method](topic, content);
    });
  });
};
