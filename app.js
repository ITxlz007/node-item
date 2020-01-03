// 创建web服务器
const express = require('express');
const app = express();
app.listen(3000, () => console.log('服务器启动了'));

// 使用中间件，处理文件资源
// app.use(express.static('manager')); // 处理manager下面的所有内容（包括html、包含css...）
// app.use(请求的url的开头,  express.static(去哪里找这些静态资源));
app.use('/lib', express.static(__dirname + '/manager/lib'));
app.use('/images', express.static(__dirname + '/manager/images'));
app.use('/uploads', express.static(__dirname + '/uploads'));

// 处理 ‘x-www-form-urlencoded’ 编码格式的POST请求体 （把浏览器提交的数据放到 req.body中）
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));


const session = require('express-session');
// 使用session中间件
app.use(session({ 
    secret: 'asre23s2323',  // 加密串，随便写
    cookie: { maxAge: 60000 }, // 过期时间，目前设置为 1分钟
    resave: false, // 重新保存
    saveUninitialized: false, // 即使未初始化也要保存
    // store: 保存位置 （文件、数据库中、memcache中......，保存到其他位置，还需要其他中间件）
}));

// 定义一个项目根目录
global.rootPath = __dirname;

///////////////////////////// 下面是接口 ////////////////////////////////////////
///////////////////////// 不需要登录的接口 ///////////////////////
app.use(require(__dirname + '/router/login.js'));
///////////////////////////////////////////////////////////////////////////
app.use((req, res, next) => {
    if (req.session.isLogin === true) {
        // 登录了
        next();
    } else {
        res.send('<script>alert("请先登录"); location.href="login.html";</script>');
        return;
    }
});
//////////////////////////  需要登录的接口
// const h = require(__dirname + '/router/hero.js');
// app.use(h);
app.use(require(__dirname + '/router/hero.js'));


