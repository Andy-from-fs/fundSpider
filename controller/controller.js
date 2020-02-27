const FundSpider = require("../model/fundSpider");
const util = require("../util");

const fetchFundCodes = async (ctx, next) => {
  let fundSpider = new FundSpider();
  const data = await fundSpider.fetchFundCodes().catch(err => {
    ctx.throw(300, "name required");
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
  const data = await fundSpider.fetchFundInfo(ctx.query.code).catch(err => {
    ctx.throw(300, err);
  });
  ctx.body = {
    statusCode: "200",
    msg: "查询成功",
    data,
  };
};

const fundFetchSave = async (ctx, next) => {
  let fundSpider = new FundSpider(50);
  ctx.set("Access-Control-Allow-Origin", "*");
  const data = await fundSpider.fundSave().catch(err => {
    console.log(err);
    ctx.throw(300, err);
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
  let option = [ctx.query.code];
  if (ctx.query.sdate) option.push(ctx.query.sdate);
  else option.push(null);
  if (ctx.query.edate) option.push(ctx.query.edate);

  let fundSpider = new FundSpider();
  const data = await fundSpider.fetchFundDetail(...option).catch(err => {
    ctx.throw(300, err);
  });
  ctx.body = {
    statusCode: "200",
    msg: "操作完成",
    data,
  };
};

const fetchFundDetailLast = async (ctx, next) => {
  if (!ctx.query.code) {
    ctx.throw(300, "请输入code");
    return;
  }
  let fundSpider = new FundSpider();

  const data = await fundSpider
    .fetchFundDetail(
      ctx.query.code,
      util.getDateStr(new Date(new Date().setDate(new Date().getDate() - 1)))
    )
    .catch(err => {
      ctx.throw(300, err);
    });
  if (data.length < 1) {
    ctx.throw(300, "没有数据");
    return;
  } else if (data.length > 1) {
    const lastDate = Math.max(...data.map(e => new Date(e.date)));
    ctx.body = {
      statusCode: "200",
      msg: "操作完成",
      data: data.find(e => new Date(e.date) === lastDate),
    };
  } else
    ctx.body = {
      statusCode: "200",
      msg: "操作完成",
      data: data[0],
    };
};

const test = async (ctx, next) => {
  let fundSpider = new FundSpider();
  const data = await fundSpider.fetchFundInfo(000002).catch(err => {
    console.log(err);
    ctx.throw(300, err);
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
  fundFetchSave,
  fetchFundDetail,
  fetchFundDetailLast,
  test,
};
