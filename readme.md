# npm
```
npm install 
``` 

# mongo启动 
```
mongod -dbpath /data/db
```

# node服务启动
```
node index
```



# 爬取接口
http://localhost:3000/page/spider?token=111&cookie=ssss  
- cookie
- token:(微信公众号后台登陆后URl里的查询字段token)
# 查询爬取状态
http://localhost:3000/page/spider_watch

# 清洗数据
http://localhost:3000/page/qingxi

# 查询学校
http://localhost:3000/page/school




### index.html  前端掉接口页面

### index.js   node服务启动文件

### app.js    爬虫js文件

### ce.js      清洗数据及学校查询js文件

### data/db/     数据库文件位置


* 使用KOA框架，未做跨域配置，详情请访问KOA官方文档

