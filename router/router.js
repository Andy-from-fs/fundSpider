const router = require("koa-router")();
const controller = require("../controller/controller");

router
  .get("/", async (ctx, next) => {
    ctx.body = "hello world";
  })
  .get("/fetchFundCodes", controller.fetchFundCodes)
  .post("/fetchFundCodes", controller.fetchFundCodes);

module.exports = router;
