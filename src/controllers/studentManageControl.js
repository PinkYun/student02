// 引入模板
const path = require('path')
const xtpl = require('xtpl')
// 引入ObjectId
const ObjectId = require('mongodb').ObjectId;

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
                xtpl.renderFile(path.join(__dirname,'../views/list.html'),{studentList:docs,studentName,loginName:req.session.loginName},(err,content)=>{
                    res.send(content)
                })
            })
        })
        // console.log('--------------111----------------------')
    }else{
        //  Use connect method to connect to the server  连接数据库
        MongoClient.connect(url,{useNewUrlParser: true},function(err, client) {
            const db = client.db(dbName);
            // Get the documents collection 连接到集合
            const collection = db.collection('studentInfo')
            // 查询所有的数据
            collection.find({name:{$regex:studentName}}).toArray((err,docs)=>{
                console.log(docs)
                client.close();
                // 把查询到的结果 返回到页面上 
                xtpl.renderFile(path.join(__dirname,'../views/list.html'),{studentList:docs,studentName,loginName:req.session.loginName},(err,content)=>{
                    res.send(content)
                })
            })

        })
        // console.log('--------------222----------------------')
    }
}

// 显示新增
exports.getAddPage = (req,res)=>{
    xtpl.renderFile(path.join(__dirname,'../views/add.html'),{loginName:req.session.loginName},(err,content)=>{
        res.send(content)
    })
}
// 新增学生
exports.addStudent = (req,res)=>{
    // console.log(req.body)
    const result3 = {status: 0,message:"新增成功"}
     // Use connect method to connect to the server  连接数据库
     MongoClient.connect(url,{useNewUrlParser: true},function(err, client) {
        
        const db = client.db(dbName);

        // Get the documents collection 连接到集合
        const collection = db.collection('studentInfo')
        collection.insertOne(req.body,function(err,result){
            // console.log(result);
            // 判断当前是否存在
            if(result ==null){
               // 已存在就不添加进去 注册失败 去登录页面
               result3.status =1;
               result3.message = "新增失败"; 
              
            }
            res.send('<script>window.location.href ="/student/list"</script>');
            client.close();
            
       })
    })
}
// 修改学生信息页面
exports.getEditPage = (req,res)=>{
    // 获取传递过来的参数id
    const _id = ObjectId(req.params.studentId)
    console.log(_id)
    // 根据id查询数据
      // Use connect method to connect to the server  连接数据库
      MongoClient.connect(url,{useNewUrlParser: true},function(err, client) {
        
        const db = client.db(dbName);

        // Get the documents collection 连接到集合
        const collection = db.collection('studentInfo')
        collection.findOne({_id},(err,doc)=>{
            console.log(doc)
             xtpl.renderFile(path.join(__dirname,'../views/edit.html'),{studentList:doc,loginName:req.session.loginName},(err,content)=>{
                res.send(content)
                client.close();
            })
        })
      })
   
    // res.send('success')
}

// 修改学生信息
exports.editStudent = (req,res)=>{
    const result3 = {status: 0,message:"修改成功"}
    // 获取id
    const _id = ObjectId(req.params.studentId)
    console.log(req.body)
    // Use connect method to connect to the server  连接数据库
    MongoClient.connect(url,{useNewUrlParser: true},function(err, client) {
        const db = client.db(dbName);
        // Get the documents collection 连接到集合
        const collection = db.collection('studentInfo')
        collection.updateOne({_id},{$set:req.body},{loginName:req.session.loginName},(err,result)=>{
            if(result ==null){   
                result3.status =1;
                result3.message = "修改失败"; 
             }
             res.send('<script>window.location.href ="/student/list"</script>');
             client.close();
        })
    })
}

// 删除学生信息
exports.deletePage = (req,res)=>{
    const result3 = {status: 0,message:"修改成功"}
    const _id = ObjectId(req.params.studentId)
    MongoClient.connect(url,{useNewUrlParser: true},function(err, client) {
        
        const db = client.db(dbName);

        // Get the documents collection 连接到集合
        const collection = db.collection('studentInfo')
        collection.deleteOne({_id},(err,result)=>{
            if(result ==null){
                result3.status =1;
                result3.message = "删除失败"; 
             }
             res.send('<script>window.location.href ="/student/list"</script>');
             client.close();
        })
    })
}

