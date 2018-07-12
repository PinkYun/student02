const express = require('express')
const path = require('path')

const app = express()
// 使用内置中间件来读取文档下的所有静态资源
app.use(express.static(path.join(__dirname,"statics")));


// 引入路由中间件
const accountRouter = require(path.join(__dirname,'./routers/accountRouter.js')) 

// 请求  响应 处理
app.use('/account',accountRouter)

// 开启服务
app.listen(3000,'127.0.0.1',err=>{
    if(err){
        console.log(err)
    }

    console.log('success')
})