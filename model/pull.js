import got from 'got';
import debugFun from 'debug';
const debug = debugFun('simple-status:model:pull');

import config from '../config';
const {services, stories} = config;

const utils = require('./utils');
import MODEL from './constant';

const waitTimeout = (duration) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

export default async function handlePullModel({serviceName, endPoint, accept, interval, slow, timeout, maxRecord, manualState}) {
  const paramsValid = [serviceName, endPoint, accept, interval, slow, maxRecord].every(val => !!val);
  if (!paramsValid) {
    throw new Error('Params are not correct for pull model');
  }

  let rows = utils.prepareServiceInDb(serviceName, maxRecord);

  debug(`Try to request "${endPoint}"...`);
  const startTime = Date.now();

  let newRow = {
    serviceName,
    model: MODEL.PULL,
    insertTime: Date.now(),
    startTime: startTime,
    endTime: null,
    statusCode: null,
    manualState,
  };

  try {
    const response = await got(endPoint, {
      timeout,
      retries: 0,
      followRedirect: false,
    });
    const endTime = Date.now();
    debug(`Request done for "${endPoint}", status: ${response.statusCode}.`);
    newRow = {
      ...newRow,
      endTime,
      insertTime: Date.now(),
      statusCode: response.statusCode
    };

  } catch (err) {
    debug(`Error occurred for "${endPoint}", status: ${err.statusCode}.
    Error message: ${err.message}`);
    newRow = {
      ...newRow,
      insertTime: Date.now(),
      statusCode: err.statusCode || null
    };
  }

  rows.push(newRow);
  utils.writeServiceStatToDb(serviceName, rows);
  debug(`Stat written for ${serviceName}. About to sleep for ${interval}ms...`);

  setTimeout(() => handlePullModel(...Array.from(arguments)), interval);
}
