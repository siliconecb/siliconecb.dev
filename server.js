import Koa from 'koa';
import dotenv from 'dotenv';
import { handler } from './build/handler.js';

dotenv.config();

const app = new Koa();
const port = process.env.PORT || 5173;
const host = process.env.HOST || '0.0.0.0';

app.use(async (ctx) => {
	ctx.set('Via', 'varnish (Varnish/7.6.0)');
	ctx.set('X-Powered-By', 'late nights and coffee');
	ctx.set('X-Made-With', '<3 from siliconecb_');
	ctx.set('Alt-Svc', 'h3');
	ctx.set('Strict-Transport-Security', 'max-age=604800;');

	await handler(ctx.req, ctx.res);
	ctx.respond = false;
});

app.listen(port, host, () => {
	console.log('siliconecb.dev PRODUCTION');
	console.log('');
	console.log('hey there! :)');
	console.log(`listening on ${host}:${port}`);
});
