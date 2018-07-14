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
// 注册页面
accountRouter.get('/register',loginControl.getRegisterPage)
// 注册用户
accountRouter.post('/register',loginControl.register)
// 登录请求
accountRouter.post('/login',loginControl.login)
// 点击退出登录
accountRouter.get('/logout',loginControl.logout)

// 暴露出去
module.exports = accountRouter