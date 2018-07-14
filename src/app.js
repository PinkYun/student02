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

// 权限控制 如果没有登录就不要进入到页面去操作  app.all可以拦截到所有的请求
app.all('*',(req,res,next)=>{
    // console.log(req.url)  判断当请求带有account就通过 
    if(req.url.includes('/account')){
        next()
    }else{
        // console.log(req.session.loginName)
        // // 如果有登录过的话 就通过  没有就先去登录
        if(!req.session.loginName){
            // 进到这里说明没有登录过
            res.send('<script>alert("您还没登录,请先登录");window.location.href="/account/login"</script>')
            return
        }
        next()
    }
    /*next函数主要负责将控制权交给下一个中间件，如果当前中间件没有终结请求，
    并且next没有被调用，那么请求将被挂起，后边定义的中间件将得不到被执行的机会。
    */
    
})

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