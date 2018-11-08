const Koa = require('koa')
const fs = require('fs')

const Router = require('koa-router');
const spiderCe = require('./ce.js');
const spiderFn = require('./app').spiderFn;
const spiderWatch = require('./app').spiderWatch;
const app = new Koa()
let home = new Router()

// 子路由1
home.get('/', async ( ctx )=>{
  let html = `
    <ul>
      <li><a href="/page/helloworld">/page/helloworld</a></li>
      <li><a href="/page/404">/page/404</a></li>
    </ul>
  `
  ctx.body = html
})

// 子路由2
let page = new Router()
page.get('/404', async ( ctx )=>{
  ctx.body = '404 page!'
}).get('/qingxi', async ( ctx )=>{
  let data =   await spiderCe.qingxi();  
  ctx.body = data;

}).get('/spider',async(ctx)=>{
  let request = ctx.request;
  let req_query = request.query;
  if(req_query && req_query.cookie&& req_query.token){
    spiderFn(req_query.cookie,req_query.token);
    ctx.body = '正在爬取。。。';
  }else{
    ctx.body = '参数错误';
  }
}).get('/school',async ( ctx) =>{
  let data =  await spiderCe.get_school();
  ctx.body = {
    data
  };
}).get('/spider_watch',async ( ctx) =>{
  let data =  spiderWatch();
  ctx.body = data;
})

// 装载所有子路由
let router = new Router()
router.use('/', home.routes(), home.allowedMethods())
router.use('/page', page.routes(), page.allowedMethods())

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
  console.log('[demo] route-use-middleware is starting at port 3000')
})