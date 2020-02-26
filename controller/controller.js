const FundSpider = require("../model/fundSpider");

const fetchFundCodes = async (ctx, next) => {
  let fundSpider = new FundSpider();
  ctx.set("Access-Control-Allow-Origin", "*");
  const data = await fundSpider.fetchFundCodes().catch(err => {
    ctx.throw(400, "name required");
  });
  ctx.body = {
    statusCode: "200",
    msg: "查询成功",
    data,
  };
};

const fetchFundInfo = async (ctx, next) => {
  if (!ctx.query.code) {
    ctx.throw(300, "请输入code");
    return;
  }
  let fundSpider = new FundSpider();
  ctx.set("Access-Control-Allow-Origin", "*");
  const data = await fundSpider.fetchFundInfo(ctx.query.code).catch(err => {
    ctx.throw(300, err);
  });
  ctx.body = {
    statusCode: "200",
    msg: "查询成功",
    data,
  };
};

const fundSave = async (ctx, next) => {
  let fundSpider = new FundSpider(2);
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

const fetchFundDetail = async (ctx, next) => {
  if (!ctx.query.code) {
    ctx.throw(300, "请输入code");
    return;
  }
  let fundSpider = new FundSpider(2);
  const data = await fundSpider.fetchFundDetail(ctx.query.code).catch(err => {
    ctx.throw(300, err);
  });
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.body = {
    statusCode: "200",
    msg: "操作完成",
    data,
  };
};

const test = async (ctx, next) => {
  let fundSpider = new FundSpider();
  ctx.set("Access-Control-Allow-Origin", "*");
  const data = await fundSpider.fetchFundInfo(000002).catch(err => {
    console.log(err);
    ctx.throw(400, err);
  });
  ctx.body = {
    statusCode: "200",
    msg: "操作完成",
    data,
  };
};

module.exports = {
  fetchFundCodes,
  fetchFundInfo,
  fundSave,
  fetchFundDetail,
  test,
};
