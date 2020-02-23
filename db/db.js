const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://localhost:27017/", { useNewUrlParser: true }, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connection success!");
  }
});
const Schema = mongoose.Schema;

// 用户
let fundInfoSchema = new Schema({
  _id: String,
  code: String,
  name: String, //基金全称
  name_shore: String, //基金简称
  type: String, //基金类型
  release_date: String, //发行日期
  build_date: String, //成立日期/规模
  asset_scale: String, //资产规模
  share_scale: String, //份额规模
  administrator: String, //基金管理人
  custodian: String, //基金托管人
  manager: String, //基金经理人
  bonus: String, //分红
  management_rate: String, //管理费率
  trusteeship_rate: String, //托管费率
  saleService_rate: String, //销售服务费率
  subscription_rate: String, //最高认购费率
  buy_rate: String, //最高申购手续费率
  sale_rate: String, //最高赎回手续费率
});

// 留言
let fundChangeDetailSchema = new Schema({});

// // 验证码
// let checkcodeSchema = new Schema({
//   token: String,
//   code: String,
// });

exports.fundInfo = mongoose.model("fundInfo", fundInfoSchema);
exports.fundChangeDetail = mongoose.model("fundChangeDetail", fundChangeDetailSchema);
