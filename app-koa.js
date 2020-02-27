require("core-js");
const Koa = require("koa");
const app = new Koa();
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const $router = require(__dirname + "/router/router");

// error handler
onerror(app);

app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  // console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  ctx.set("x-response-time", ms);
  ctx.set("Access-Control-Allow-Origin", "*");
});
app.use($router.routes(), $router.allowedMethods());

app.listen(1234);
