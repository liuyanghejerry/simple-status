import debugFun from 'debug';
import got from 'got';
import lowdb from 'lowdb';

import config from '../config';
const {services, stories} = config;

const debug = debugFun('simple-status:model:pull');

const db = lowdb('stat.json');
db.defaults({ service: {} }).write();

const waitTimeout = (duration) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

export default async function handlePushModel(service) {
  // TODO
}
