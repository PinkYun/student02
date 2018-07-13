const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
// 引入session中间件
var session = require('express-session')

const app = express()
// 使用内置中间件来读取文档下的所有静态资源
app.use(express.static(path.join(__dirname,"statics")));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// Use the session middleware 使用session中间件
app.use(session({ secret: 'keyboard cat',resave: false, saveUninitialized: true, cookie: { maxAge:10* 60000 }}))


// 引入路由中间件
const accountRouter = require(path.join(__dirname,'./routers/accountRouter.js')) 
const studentRouter = require(path.join(__dirname,'./routers/studentRouter'))

// 请求  响应 处理
app.use('/account',accountRouter)
app.use('/student',studentRouter)

// 开启服务
app.listen(3000,'127.0.0.1',err=>{
    if(err){
        console.log(err)
    }

    console.log('success')
})