'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.view.index);
  router.get('/producer', controller.view.producer);
};
