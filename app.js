import Koa from 'koa';
import KoaRouter from 'koa-router';
import debugFun from 'debug';
const debug = debugFun('simple-status:app');

import MODEL from './model/constant';
import handlePushModel from './model/push';
import handlePullModel from './model/pull';

import config from './config';
const {services, stories} = config;

const MODEL_HANDLER = {
  PUSH: handlePushModel,
  PULL: handlePullModel,
};

services.forEach((service) => {
  const model = service.model.toUpperCase();
  debug(`Appending model "${model}"`);
  const handler = MODEL_HANDLER[model];
  try {
    handler(service).catch((err) => {
      debug('Error while handling services', err.message, err.stack);
    });
  } catch (err) {
    debug('Error while handling services', err.message, err.stack);
  }
});

debug(`Simple Status is up and running now.`);
