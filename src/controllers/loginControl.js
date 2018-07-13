const path = require('path')
const captchapng = require('captchapng');

// 引入mongodb 
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'first';

// 使用MVC分层实现 每一个中间件都有一个对应的控制文件
exports.getLoginPage = (req,res)=>{
        res.sendFile(path.join(__dirname,'../views/login.html'))
        // res.send('Holle Word')
}
// 暴露图片验证码 
exports.getVcode = (req,res)=>{
        // 保存生成的图片验证码
        const random = parseInt(Math.random()*9000+1000);
        // 使用session保存图片中的验证码
        req.session.vcode = random;
        var p = new captchapng(80,30,random); // width,height,numeric captcha
        p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
        p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

        var img = p.getBase64();
        var imgbase64 = new Buffer(img,'base64');
        res.writeHead(200, {
                'Content-Type': 'image/png'
        });
        res.end(imgbase64);
       
           
}
// 暴露注册页面出去
exports.getRegisterPage = (req,res)=>{
        res.sendFile(path.join(__dirname,'../views/register.html'))
}

// 注册用户名
exports.register = (req,res)=>{
        // 在这里注意一点 不能在直接写res.json  不然后面输出req.body读取不出来
        const result1 ={status:0,message:'注册成功'};
        // console.log(req.body);
        const {username,password} = req.body;
        // console.log(username);
        // console.log(password);
        // Use connect method to connect to the server  连接数据库
        MongoClient.connect(url,{useNewUrlParser: true},function(err, client) {
        
        const db = client.db(dbName);

        // Get the documents collection 连接到集合
        const collection = db.collection('accountInfo')
        // 首先查询所有看看有没有
        collection.findOne({username},function(err,doc){
                console.log(doc);
                // 判断一下当doc等于null 的时候 
                if(doc !=null){
                   // 说明当前的用户名存在
                   result1.status =1;
                   result1.message = "该用户名已存在!!";
                   client.close();
                   res.json(result1)
                }else{
                   // 说明用户名不存在 那就直接新增到数据库
                   collection.insertOne({username,password},function(err,result){
                        console.log(result);
                        // 判断当前是否存在
                        if(result ==null){
                           // 已存在就不添加进去 注册失败 去登录页面
                           result1.status =2;
                           result1.message = "注册失败"; 
                          
                        }
                        res.json(result1);
                        client.close();
                        
                   })
                }
        })
        
        // client.close();
      });
//       res.json(result1)
} 

//验证登录
exports.login = (req,res)=>{
        const result2 = {status: 0,message:"登陆成功"}
        //    console.log(req.body)
        // 获取发送过来的数据
        const {username,password,vcode} = req.body;

        // 判断发送过来的验证码与之前使用session保存是否一致 不一致就提示用户
        if(vcode !=req.session.vcode){
            // 进来到这里说明验证码不正确
            result2.status = 1;
            result2.message = "验证码不正确"
            res.json(result2)
            return
        }
        // 验证用户名跟密码  首先去数据库查询是否有 
        MongoClient.connect(url,{useNewUrlParser: true},function(err, client) {
                const db = client.db(dbName);
                // Get the documents collection 连接到集合
                const collection = db.collection('accountInfo')
                // 查询用户名跟密码
                collection.findOne({username,password},(err,doc)=>{
                     // 判断用户名密码是否正确
                     if(doc == null){
                        // 说明不成功
                        result2.status = 2;
                        result2.message ="用户名或者密码错误";
                        res.json(result2);
                        client.close();
                     }else{
                        // 说明成功
                        res.json(result2);
                        client.close();
                     }
                })
        })
        
}
      