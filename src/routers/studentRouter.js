// 引入express模块
const express = require('express')
const path = require('path')

// 创建路由中间件
const studentRouter = express.Router()

// 引入路由中间件所控制的对应的文件
const studentControl = require(path.join(__dirname,'../controllers/studentManageControl'))


// 去学生管理系统列表页面
studentRouter.get('/list',studentControl.list)



// 暴露出去
module.exports = studentRouter