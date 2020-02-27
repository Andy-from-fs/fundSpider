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
  .get("/fundDetailLast", controller.fetchFundDetailLast)
  .post("/fundDetailLast", controller.fetchFundDetailLast)
  .get("/fundFetchSave", controller.fundFetchSave)
  .post("/fundFetchSave", controller.fundFetchSave)
  .get("test1", controller.test)
  .post("test1", controller.test);

module.exports = router;
