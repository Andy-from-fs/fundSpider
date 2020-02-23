const path = require("path");
const events = require("events"); //事件监听
const request = require("request"); //发送请求
const iconv = require("iconv-lite"); //网页解码
const cheerio = require("cheerio"); //网页解析
const $db = require("../db/db");
const MongoClient = require("mongodb").MongoClient; //数据库
const Event = new events.EventEmitter(); //事件监听实例
const dbUrl = "mongodb://localhost:27017/"; //数据库连接地址

// class ConcurrentCtrl {
//   // 调用者上下文环境，并发分段数量（建议不要超过1000），调用函数，总参数数组，数据库表名
//   constructor(parent, splitNum, fn, dataArray = [], collection) {
//     this.parent = parent;
//     this.splitNum = splitNum;
//     this.fn = fn;
//     this.dataArray = dataArray;
//     this.length = dataArray.length; // 总次数
//     this.itemNum = Math.ceil(this.length / splitNum); // 分段段数
//     this.restNum = this.length % splitNum === 0 ? splitNum : this.length % splitNum; // 最后一次分段的余下次数
//     this.collection = collection;
//   }
//   // go(0)启动调用，循环计数中达到分段数量便进行下一次片段并发
//   go(index) {
//     if (index % this.splitNum === 0) {
//       if (index / this.splitNum !== this.itemNum - 1) {
//         this.fn.call(
//           this.parent,
//           this.collection,
//           this.dataArray.slice(index, index + this.splitNum)
//         );
//       } else {
//         this.fn.call(
//           this.parent,
//           this.collection,
//           this.dataArray.slice(index, index + this.restNum)
//         );
//       }
//     }
//   }
// }

// 基金爬虫
class FundSpider {
  // 数据库名，表名，并发片段数量
  constructor(dbName = "fund", collectionName = "fundData", fragmentSize = 1000) {
    this.dbUrl = dbUrl;
    this.dbName = dbName;
    this.collectionName = collectionName;
    this.fragmentSize = fragmentSize;
  }

  // 获取url对应网址内容，除utf-8外，需指定网页编码
  $fetch(url, coding, callback) {
    request({ url, encoding: null }, (error, response, body) => {
      let _body = coding === "utf-8" ? body : iconv.decode(body, coding);
      if (!error && response.statusCode === 200) {
        // 将请求到的网页装载到jquery选择器中
        callback(null, _body);
      } else {
        callback(error);
      }
    });
  }

  $fetchPro(url, coding) {
    return new Promise(($resolve, $reject) => {
      request({ url, encoding: null }, (error, response, body) => {
        let _body = coding === "utf-8" ? body : iconv.decode(body, coding);
        if (!error && response.statusCode === 200) {
          // 将请求到的网页装载到jquery选择器中
          // callback(null, cheerio.load('<body>' + _body + '</body>'));
          $resolve(_body);
        } else {
          // callback(error, cheerio.load('<body></body>'));
          $reject(error);
        }
      });
    });
  }

  // 批量获取所有的基金代码
  async fetchFundCodes() {
    const url = "http://fund.eastmoney.com/allfund.html";
    const res = await this.$fetchPro(url, "gb2312").catch(err => {
      throw err;
    });
    // console.log(res);
    const $ = cheerio.load("<body>" + res + "</body>");
    let fundCodesArray = [];
    $("body")
      .find(".num_right")
      .find("li")
      .each((i, item) => {
        let codeItem = $(item);
        let codeAndName = $(codeItem.find("a")[0]).text();
        let codeAndNameArr = codeAndName.split("）");
        let code = codeAndNameArr[0].substr(1);
        let fundName = codeAndNameArr[1];
        if (code) {
          fundCodesArray.push(code);
        }
      });
    // callback(null, fundCodesArray);
    // })
    console.log(fundCodesArray);
    return fundCodesArray;
  }

  // 根据基金代码获取对应基本信息
  async fetchFundInfo(code, callback) {
    let fundUrl = "http://fund.eastmoney.com/f10/" + code + ".html";
    let fundData = { fundCode: code };
    console.log(fundUrl);

    const body = await this.$fetchPro(fundUrl, "utf-8").catch(err => {
      console.log(err);
      throw err;
    });
    const $ = cheerio.load("<body>" + body + "</body>");
    let dataRow = $("body")
      .find(".detail .box")
      .find("tr");
    fundData.code = code;
    fundData.name = $($(dataRow[0]).find("td")[0]).text(); //基金全称
    fundData.name_short = $($(dataRow[0]).find("td")[1]).text(); //基金简称
    fundData.type = $($(dataRow[1]).find("td")[1]).text(); //基金类型
    fundData.release_date = $($(dataRow[2]).find("td")[0]).text(); //发行日期
    fundData.build_date = $($(dataRow[2]).find("td")[1]).text(); //成立日期/规模
    fundData.asset_scale = $($(dataRow[3]).find("td")[0]).text(); //资产规模
    fundData.share_scale = $($(dataRow[3]).find("td")[1]).text(); //份额规模
    fundData.administrator = $($(dataRow[4]).find("td")[0]).text(); //基金管理人
    fundData.custodian = $($(dataRow[4]).find("td")[1]).text(); //基金托管人
    fundData.manager = $($(dataRow[5]).find("td")[0]).text(); //基金经理人
    fundData.bonus = $($(dataRow[5]).find("td")[1]).text(); //分红
    fundData.management_rate = $($(dataRow[6]).find("td")[0]).text(); //管理费率
    fundData.trusteeship_rate = $($(dataRow[6]).find("td")[1]).text(); //托管费率
    fundData.saleService__rate = $($(dataRow[7]).find("td")[0]).text(); //销售服务费率
    fundData.subscription_rate = $($(dataRow[7]).find("td")[1]).text(); //最高认购费率
    const buyRate = $($(dataRow[8]).find("td")[0])
      .text()
      .match(/(\d+%)|(\d+\.\d+%)/g); //最高申购购费率
    console.log(buyRate);
    fundData.buy_rate = buyRate[buyRate.length - 1];
    const saleRate = $($(dataRow[8]).find("td")[1])
      .text()
      .match(/(\d+%)|(\d+\.\d+%)/g); //最高申购购费率
    console.log(saleRate);
    fundData.sale_rate = saleRate[saleRate.length - 1];

    return fundData;
    // callback(err, fundData);
  }

  // // 并发获取的基金信息片段保存到数据库指定的表
  // async fundFragmentSave(collection, codesArray) {
  //   for (let i = 0; i < codesArray.length; i++) {
  //     const fundData = await this.$fetchFundInfo(codesArray[i]).catch(err => {
  //       throw error;
  //       Event.emit("error_fundItem", codesArray[i]);
  //       Event.emit("fundItem", codesArray[i]);
  //     });
  //     // 指定每条数据的唯一标志是基金代码，便于查询与排序
  //     fundData["_id"] = fundData.fundCode;
  //     collection.save(fundData, (err, res) => {
  //       Event.emit("correct_fundItem", codesArray[i]);
  //       Event.emit("fundItem", codesArray[i]);
  //       if (err) throw err;
  //     });
  //   }
  // }

  // 并发获取给定基金代码数组中对应的基金基本信息，并保存到数据库
  async fundToSave(codesArray = []) {
    let codesLength = codesArray.length;
    let resArr = [];
    for (let i = 0; i < codesArray.length; i++) {
      let res;
      let fundData = await this.fetchFundInfo(codesArray[i]).catch(err => {
        res = { statusCode: 300, msg: err, code: codesArray[i] };
        console.log(err);
      });
      if (fundData) {
        // 指定每条数据的唯一标志是基金代码，便于查询与排序
        fundData["_id"] = fundData.fundCode;
        console.log(fundData);

        const fundInfoDB = new $db.fundInfo({ ...fundData });
        const successMsg = await fundInfoDB.save().catch(err => {
          res = { statusCode: 300, msg: err, code: codesArray[i] };
          console.log(err);
        });
        res = { statusCode: 200, msg: successMsg, code: codesArray[i] };
      } else {
        res = { statusCode: 300, msg: "fundData null", code: codesArray[i] };
      }
      resArr.push(res);
    }
    if (resArr.every(e => e.statusCode === 200)) return { msg: "全部保存成功", codes: resArr };
    else throw { msg: "部分保存成功", errorCode: resArr.filter(e => e.statusCode === 300) };
  }

  // 未传参则获取所有基金基本信息，给定基金代码数组则获取对应信息，均更新到数据库
  async fundSave(_codesArray) {
    if (!_codesArray) {
      // 所有基金信息爬取保存
      const data = await this.fetchFundCodes().catch(err => {
        console.log(err);
        throw err;
      });
      await this.fundToSave(data);
      return;
    } else {
      // 过滤可能的非数组入参的情况
      _codesArray =
        Object.prototype.toString.call(_codesArray) === "[object Array]" ? _codesArray : [];
      if (_codesArray.length > 0) {
        // 部分基金信息爬取保存
        return await this.fundToSave(_codesArray);
      } else {
        console.log("not enough codes to fetch");
        throw "not enough codes to fetch";
      }
    }
  }

  // 日期转字符串
  getDateStr(dd) {
    let y = dd.getFullYear();
    let m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
    let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
    return y + "-" + m + "-" + d;
  }
  // 爬取并解析基金的单位净值，增长率等信息
  async fetchFundUrl(url, callback) {
    const pageRes = await this.$fetchPro(url, "gb2312").catch(err => {
      console.log(err);
      callback(err);
    });
    const fundData = [];

    const pages = parseInt(pageRes.match(/pages:(\d+),/g)[0].match(/\d+/g)[0]);
    for (var i = 1; i <= pages; i++) {
      // console.log(`${url}&page=${i}`);

      const pageItemRes = await this.$fetchPro(`${url}&page=${i}`, "gb2312").catch(err => {
        console.log(err);
        callback(err);
      });

      const $ = cheerio.load("<body>" + pageItemRes + "</body>");
      const table = $("body").find("table");
      const tbody = table.find("tbody");
      try {
        tbody.find("tr").each((i, trItem) => {
          let fundItem = {};
          let tdArray = $(trItem)
            .find("td")
            .map((j, tdItem) => $(tdItem));
          fundItem.date = tdArray[0].text(); // 净值日期
          fundItem.unitNet = tdArray[1].text(); // 单位净值
          fundItem.accumulatedNet = tdArray[2].text(); // 累计净值
          fundItem.changePercent = tdArray[3].text(); // 日增长率
          fundData.push(fundItem);
        });
      } catch (e) {
        console.log(e);
        callback(err);
      }
    }
    callback(null, fundData);
  }
  // 根据基金代码获取其选定日期范围内的基金变动数据
  // 基金代码，开始日期，截止日期，数据个数，回调函数
  fetchFundData(code, sdate, edate, callback) {
    let fundUrl = "http://fund.eastmoney.com/f10/F10DataApi.aspx?type=lsjz";
    let date = new Date();
    let dateNow = new Date();
    // 默认开始时间为当前日期的3年前
    sdate = sdate ? sdate : this.getDateStr(new Date(date.setFullYear(date.getFullYear() - 3)));
    edate = edate ? edate : this.getDateStr(dateNow);
    fundUrl += "&code=" + code + "&sdate=" + sdate + "&edate=" + edate + "&per=" + 20;
    console.log(fundUrl);
    this.fetchFundUrl(fundUrl, callback);
  }
}

module.exports = FundSpider;
