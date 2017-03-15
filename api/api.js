import Koa from 'koa';
import KoaRouter from 'koa-router';
import debugFun from 'debug';
const debug = debugFun('simple-status:api');

import config from '../config';
const {services, stories} = config;

import freshRequire from './fresh-require';

const app = new Koa();
const router = new KoaRouter();

router.get('/service/:service', (ctx) => {
  const serviceName = ctx.params.service;
  const allServiceNames = services.map(service => service.serviceName);
  debug(`Accessing "${serviceName}" among [${allServiceNames}]`);
  if (!allServiceNames.includes(serviceName)) {
    ctx.throw(404, `Service "${serviceName}" does not exist.`);
  }

  const {service} = freshRequire('../stat.json');
  debug(`Service data in db: "${JSON.stringify(service)}"`);

  const serviceConfig = services.find(service => service.serviceName === serviceName) || null;
  if (serviceConfig) {
    delete serviceConfig.auth;
  }

  ctx.response.body = {
    data: service[serviceName],
    config: serviceConfig
  };
});

router.get('/service/', (ctx) => {
  debug('Listing service...');
  const {service} = freshRequire('../stat.json');
  debug(`Service data in db: "${JSON.stringify(service)}"`);

  ctx.response.body = {
    data: service,
    config: services.map((service) => {
      delete service.auth;
      return service;
    })
  };
});

app.use(router.routes());
app.use(router.allowedMethods());
debug(`Opening API port ${config.api.port}...`);
app.listen(config.api.port);
