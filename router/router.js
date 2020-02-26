const router = require("koa-router")();
const controller = require("../controller/controller");

router
  .get("/", async ctx => {
    ctx.body = "hello world";
  })
  .get("/fundCodes", controller.fetchFundCodes)
  .post("/fundCodes", controller.fetchFundCodes)
  .get("/fundInfo", controller.fetchFundInfo)
  .post("/fundInfo", controller.fetchFundInfo)
  .get("/fundDetail", controller.fetchFundDetail)
  .post("/fundDetail", controller.fetchFundDetail)
  .get("/fundSave", controller.fundSave)
  .post("/fundSave", controller.fundSave)
  .get("test1", controller.test)
  .post("test1", controller.test);

module.exports = router;
