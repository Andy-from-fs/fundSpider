require('core-js');

const express = require('express'); //搭建服务
const app = express();

const FundSpider = require('./fundSpider');

// 所有基金代码查询接口
app.get('/fetchFundCodes', (req, res) => {
  let fundSpider = new FundSpider();
  res.header('Access-Control-Allow-Origin', '*');
  res.set('Content-Type', 'text/html');
  fundSpider.fetchFundCodes((err, data) => {
    res.send(data.join('<br/>'));
  });
});
// 根据代码查询基金档案接口
app.get('/fetchFundInfo/:code', (req, res) => {
  let fundSpider = new FundSpider();
  res.header('Access-Control-Allow-Origin', '*');
  fundSpider.fetchFundInfo(req.params.code, (err, data) => {
    res.send(JSON.stringify(data));
  });
});
// 基金净值变动情况数据接口
app.get('/fetchFundData/:code/:sdate/:edata', (req, res) => {
  console.log(req);
  if (!req.params.code) {
    res.err('请输入基金代码。');
    return;
  }

  let fundSpider = new FundSpider();
  res.header('Access-Control-Allow-Origin', '*');
  fundSpider.fetchFundData(
    req.params.code,
    req.params.sdata,
    req.params.edata,
    (err, data) => {
      if (err) console.log(err);
      res.status(200).json(data);
    }
  );
});

app.get('/fundToSave/:codes', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const fundSpider = new FundSpider('fund', 'fundData', 1000);
  console.log('fundToSave:', req.params.codes);
  const arr = req.params.codes.split(',');
  if (arr.length <= 0)
    // 更新保存全部基金基本信息
    fundSpider.fundSave();
  // 更新保存代码为000001和040008的基金的基本信息
  else fundSpider.fundSave(arr);
  res.send('成功');
});

app.listen(1234, () => {
  console.log('service start on port 1234');
});
