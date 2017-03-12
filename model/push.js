import Koa from 'koa';
import KoaRouter from 'koa-router';
import debugFun from 'debug';
import got from 'got';

const debug = debugFun('simple-status:model:push');

import config from '../config';
const {services, stories} = config;

const utils = require('./utils');
import MODEL from './constant';

const app = new Koa();

debug(`Opening push end point port ${config.pushEndPoint.port}`);
app.listen(config.pushEndPoint.port);

export default async function handlePushModel({serviceName, auth: {tokenName, tokenValue}, interval, slow, maxRecord, manualState}) {
  const paramsValid = [serviceName, tokenName, tokenValue, interval, slow, maxRecord].every(val => !!val);
  if (!paramsValid) {
    throw new Error('Params are not correct for push model');
  }

  const router = new KoaRouter();
  debug(`Registering new route for "${serviceName}"`);

  router.post(`/service/${serviceName}`, (ctx) => {
    debug(`"serviceName" is getting a ping...`);
    const gotTokenValue = ctx.headers[tokenName];
    if (ctx.headers[tokenName] !== tokenValue) {
      debug(`Header "${tokenName}" is not expected value "${tokenValue}", but "${gotTokenValue}" instead.`);
      ctx.throw(401, 'Unexpected token and value.');
      return;
    }

    let rows = utils.prepareServiceInDb(serviceName, maxRecord);

    const newRow = {
      serviceName,
      model: MODEL.PUSH,
      insertTime: Date.now(),
      manualState,
    };

    rows.push(newRow);
    utils.writeServiceStatToDb(serviceName, rows);
    debug(`Stat written for ${serviceName}.`);

    ctx.body = newRow;
    ctx.status = 200;
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
