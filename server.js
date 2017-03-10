// 引入定时任务模块
var schedule = require('node-schedule');


// 设置定时任务规则
var rule = new schedule.RecurrenceRule();

// 每小时执行一次
// rule.minute = 0;

// 每分钟执行一次
rule.second = 0;


// 需要截屏的URL
var url = 'http://aos.ldci.com.cn/landpage/pc/channelId=3&source=1&planId=8&ideaId=79';

// ========
// 多个URL的情况
// var urls = ['http://aos.ldci.com.cn/1', 'http://aos.ldci.com.cn/2', 'http://aos.ldci.com.cn/3'];
// var count = 0;
// ========

// 开启定时任务
var j = schedule.scheduleJob(rule, function() {
  capture(url);
});

// 生成图片文件名
function createName(url) {
  url = url || '';
  var oDate = new Date();
  var str = oDate.getFullYear()+'/'+(oDate.getMonth()+1)+'/'+oDate.getDate()+'__'+oDate.getHours()+':'+oDate.getMinutes();
  var pwd = url+'--'+str;
  return pwd;
}

// 截屏任务
function capture(url) {
  var picName = createName(url).replace(/\//g, '\\');
  var pathName = './pictures/';
  var spawn = require('child_process').spawn;
  var process = spawn('phantomjs', ['capture.js', url, picName, pathName]);
  process.stdout.setEncoding('utf8');


  process.stdout.on('data',function(data){
    console.log(data);
    console.log('spawnSTDOUT:'+JSON.stringify(data));
  });
  process.stderr.on('data',function(data){
    console.log('stderr'+data);
  });
  process.on('close',function(code){
    if (code == 1) {
      console.log('child process异常结束。目标：' + url);
    }
  });
  process.on('exit',function(code){
    console.log('child process exited with code ' + code);
    // count++;
    // if(count!=urls.length){
    //   capture(urls[count]);
    // }
  });
}
