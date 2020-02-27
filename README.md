# fundSpider

借鉴 <https://github.com/youngdro/fundSpider> 的基金信息爬虫，由掘金社区发现，[传送门](https://juejin.im/post/5af01d27f265da0b7f447ab6 "node基金爬虫，自导自演了解一下？")。

####修改地方

1.  改用 koa，增加 async
2.  弃用 request，改用 axios
3.  基于 async 与 promise，修改基金基本信息的爬虫机制，将所有基金分组，并发抓取整组数据，再逐条插入数据库，避免并发量过大，写入失败。
