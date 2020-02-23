const router = require("koa-router")();
const controller = require("../controller/controller");

router
  .get("/", async ctx => {
    ctx.body = "hello world";
  })
  .get("/fetchFundCodes", controller.fetchFundCodes)
  .post("/fetchFundCodes", controller.fetchFundCodes)
  .get("/fetchFundData", controller.fetchFundData)
  .post("/fetchFundData", controller.fetchFundData)
  .get("/fundSave", controller.fundSave)
  .post("/fundSave", controller.fundSave)
  .get("test1", controller.test)
  .post("test1", controller.test);

module.exports = router;
