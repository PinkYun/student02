// 引入express模块
const express = require('express')
const path = require('path')

// 创建路由中间件
const studentRouter = express.Router()

// 引入路由中间件所控制的对应的文件
const studentControl = require(path.join(__dirname,'../controllers/studentManageControl.js'))


// 去学生管理系统列表页面
studentRouter.get('/list',studentControl.list)

// 去新增学生信息
studentRouter.get('/add',studentControl.getAddPage)
// 点击保存新增学生信息
studentRouter.post('/add',studentControl.addStudent)
// 去到修改学生信息页面
studentRouter.get('/edit/:studentId',studentControl.getEditPage)
// 修改学生信息
studentRouter.post('/edit/:studentId',studentControl.editStudent)
// 点击删除
studentRouter.get('/delete/:studentId',studentControl.deletePage)


// 暴露出去
module.exports = studentRouter