const FundSpider = require("../model/fundSpider");

module.exports = async (ctx, next) => {
  let fundSpider = new FundSpider();
  fundSpider.fragmentSize = 2;
  ctx.set("Access-Control-Allow-Origin", "*");
  const data = await fundSpider.fundSave().catch(err => {
    console.log(err);
    ctx.throw(400, err);
  });
  ctx.body = {
    statusCode: "200",
    msg: "操作完成",
    data,
  };
};
