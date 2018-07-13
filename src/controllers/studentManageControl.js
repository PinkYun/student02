// 引入模板
const path = require('path')
const xtpl = require('xtpl')

// 引入mongodb 
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'first';

// 进入学生管理系统列表页面
exports.list = (req,res)=>{
    // 获取发送过来的请求  如果内容为空的话 就是空字符串
    const studentName = req.query.studentName
    // console.log(studentName)
   // 判断当
    if(studentName ==undefined){
            // Use connect method to connect to the server  连接数据库
        MongoClient.connect(url,{useNewUrlParser: true},function(err, client) {

            const db = client.db(dbName);

            // Get the documents collection 连接到集合
            const collection = db.collection('studentInfo')
            // 查询所有的数据
            collection.find({}).toArray((err,docs)=>{
                client.close();
                // 把查询到的结果 返回到页面上 
                xtpl.renderFile(path.join(__dirname,'../views/list.html'),{studentList:docs,studentName},(err,content)=>{
                    res.send(content)
                })
            })

        })
    }else{
        //  Use connect method to connect to the server  连接数据库
        MongoClient.connect(url,{useNewUrlParser: true},function(err, client) {

            const db = client.db(dbName);

            // Get the documents collection 连接到集合
            const collection = db.collection('studentInfo')
            // 查询所有的数据
            collection.find({username:{$regex:studentName}}).toArray((err,docs)=>{
                console.log(docs)
                client.close();
                // 把查询到的结果 返回到页面上 
                xtpl.renderFile(path.join(__dirname,'../views/list.html'),{studentList:docs,studentName},(err,content)=>{
                    res.send(content)
                })
            })

        })
    }
}