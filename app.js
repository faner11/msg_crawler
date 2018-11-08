var Crawler = require("crawler");
var MongoClient = require('mongodb').MongoClient;
var MongoUrl = "mongodb://localhost:27017/runoob";

var offset_num = 0;  // 当前页数
var out_id = 0;
var cx_cookie = '';
var cx_token = '';
var spider_watch = '未爬取';


var c = new Crawler({
  rateLimit: 1000,
  maxConnections: 1,
  // This will be called for each crawled page
  callback: function (error, res, done) {
    if (error) {
      spider_watch = '爬取失败';
      console.log(error);
    } else {
      var $ = res.$;
      let secText = $('script').eq(-3).text();
      let dengyuNum = secText.indexOf('=');
      let kuohaoNum = secText.lastIndexOf('}');
      let jsonObjText = secText.slice(dengyuNum + 1, kuohaoNum + 1);
      let JsonObj = eval('(' + jsonObjText + ')');
      let total_count = JsonObj.total_count;
      MongoClient.connect(MongoUrl, function (err, db) {
        if (err) throw err;
        var dbo = db.db("runoob");
        for (let i = 0, len = JsonObj.list.length; i < len; i++) {
     
          if (JsonObj.list[i].id <= out_id) {
            JsonObj.list = JsonObj.list.slice(0,i);
            break;
          }
        };
        if(JsonObj.list.length == 0){
          console.log('无数据');
          return;
        }
        dbo.collection("site").insertMany(JsonObj.list, function (err, res) {
          if (err) throw err;
          console.log("文档插入成功", offset_num,JsonObj.list.length );
    
          if (JsonObj.list.length >= 50) {
            offset_num += 50;
            spiderWeChat(offset_num);
          }else{
            spider_watch = '爬取完毕';
            setTimeout(() => {
              spider_watch = '未爬取';
            }, 300000);
          };
          // db.close();
          JsonObj = null;
        });
      });
    }
    done();
  }
});





// Queue URLs with custom callbacks & parameters



function spiderWeChat(num) {
  spider_watch = '正在爬取';
  let weChartUlr = `https://mp.weixin.qq.com/cgi-bin/message?t=message/lis&offset=${num}&count=50&day=7&token=${cx_token}`;
  c.queue([{
    headers: {
      Cookie: cx_cookie,
      Host: 'mp.weixin.qq.com',
    },
    uri: weChartUlr,
  }]);
};


function spiderFn(cookie,token){
  cx_cookie = decodeURIComponent(cookie);
  cx_token =  token;
  offset_num = 0;
  MongoClient.connect(MongoUrl, function (err, db) {
    if (err) throw err;
    let dbo = db.db("runoob");
    dbo.collection("site").find().sort({id:-1}).limit(1).toArray( function(err,result){
        if (err) throw err;
      if (result) {
        out_id = result[0].id;
      };
      spiderWeChat();
    } );
  });

}
function spiderWatch(){
  return spider_watch;
}
exports.spiderFn = spiderFn;
exports.spiderWatch = spiderWatch;