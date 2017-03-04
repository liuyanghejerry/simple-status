import got from 'got';
import lowdb from 'lowdb';
import debugFun from 'debug';
const debug = debugFun('simple-status:model:pull');

import config from '../config';
const {services, stories} = config;

import MODEL from './constant';

const db = lowdb('stat.json');
db.defaults({ service: {} }).write();

const waitTimeout = (duration) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

export default async function handlePullModel({serviceName, endPoint, accept, interval, slow, timeout, maxRecord, manualState}) {
  const paramsValid = [serviceName, endPoint, accept, interval, slow].every(val => !!val);
  if (!paramsValid) {
    throw new Error('Params are not correct for pull model');
  }

  const isServiceCreated = db.has(`service.${serviceName}`).value();

  if (!isServiceCreated) {
    debug(`New service is created in db: "${serviceName}"`);
    db.set(`service.${serviceName}`, []).write();
  }

  let rows = db.get(`service.${serviceName}`).cloneDeep().value();
  const rowCount = rows.length;

  if (rowCount >= maxRecord) {
    const droppedCount = rowCount - maxRecord + 1;
    debug(`Too many rows(${rowCount}) for "${serviceName}", dropped ${droppedCount}.`);
    rows = db._.drop(rows, droppedCount);
  }

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
  db.set(`service.${serviceName}`, rows).write();
  debug(`Stat written for ${serviceName}. About to sleep for ${interval}ms...`);

  await waitTimeout(interval);
  process.nextTick(handlePullModel.bind(this, ...Array.from(arguments)));
}
