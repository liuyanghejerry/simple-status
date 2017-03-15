import path from 'path';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import serve from 'koa-static';
import debugFun from 'debug';

const debug = debugFun('simple-status:web');

import config from '../config';
const {web} = config;

const app = new Koa();
const webPath = path.resolve(__dirname, './front-end/dist');
debug(`About to serve path ${webPath}`);

app.use(serve(webPath, {
  maxage: 3600,
  gzip: true
}));

debug(`Opening web port ${web.port}...`);
app.listen(web.port);
