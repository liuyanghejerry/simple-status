import lowdb from 'lowdb';
import debugFun from 'debug';

const debug = debugFun('simple-status:model:utils');

const db = lowdb('stat.json');

export const prepareServiceInDb = function (serviceName, maxRecord) {
  db.defaults({ service: {} }).write();

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

  return rows;
}

export const writeServiceStatToDb = function (serviceName, serviceStat) {
  db.defaults({ service: {} }).set(`service.${serviceName}`, serviceStat).write();
}
