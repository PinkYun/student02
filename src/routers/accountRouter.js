const express = require('express')
const path = require('path')

// 创建路由中间件
const accountRouter = express.Router()

// 引入路由中间件对应的控制文件
const loginControl = require(path.join(__dirname,'../controllers/loginControl.js'))

// 写文档
accountRouter.get('/login',loginControl.getLoginPage)
// 图片验证码
accountRouter.get('/vcode',loginControl.getVcode)


// 暴露出去
module.exports = accountRouter