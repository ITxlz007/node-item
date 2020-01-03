
const db = require('../db');

// 1. 加载express
const express = require('express');
const router = express.Router();

// 存放和user表相关的操作，这些接口不需要登录就能够访问
router.get('/login.html', (req, res) => {
    // console.log(__dirname.replace('/router', ''));
    // res.sendFile(__dirname.replace('\\router', '') + '/manager/login.html');
    res.sendFile(rootPath + '/manager/login.html');
});

router.get('/register.html', (req, res) => {
    res.sendFile(rootPath + '/manager/register.html');
});

// 6. 注册接口
router.post('/reg', (req, res) => {
    console.log(req.body);
    // 写SQL，将账号和密码添加入库
    let sql = 'insert into user set ?';
    // let values = {
    //     username: '',
    //     password: ''
    // }
    db(sql, req.body, (err, result) => {
        if (err) {
            // throw err;
            res.send({code: 201, message: '注册失败'});
        } else {
            res.send({code: 200, message: '注册成功'});
        }
    });
});

// 7. 登录接口
router.post('/login', (req, res) => {
    // console.log(req.body);
    // req.body 就是提交过来的数据
    // 首先应该判断验证码是否正确
    // 下面的判断，判断是是 用户提交的验证码  和   session中保存的验证 是否相等
    if (req.body.vcode.toUpperCase() !== req.session.captcha.toUpperCase()) {
        res.send({code: 202, message: '验证码错误'});
        return;
    }

    // 验证码通过了，则判断账号和密码是否正确
    let sql = 'select * from user where username = ? and password = ?';
    db(sql, [req.body.username, req.body.password], (err, result) => {
        if (err) throw err;
        // console.log(result); // 账号密码错误，得到空数组；否则得到非空数组
        if (result.length > 0) {
            // 将登陆过的状态记录一下，方便其他接口判断使用
            req.session.isLogin = true;
            res.send({code: 200, message: '登录成功'});
        } else {
            res.send({code: 201, message: '登录失败'});
        }
    });
});


// 8. 验证码接口
var svgCaptcha = require('svg-captcha');

router.get('/captcha', function (req, res) {
    var options = {
        background: 'pink',
        noise: 3
    };
	var captcha = svgCaptcha.create(options);
	// var captcha = svgCaptcha.createMathExpr(options);
    req.session.captcha = captcha.text;  // 这行注释，否则报错。配置好了session，则可以打开注释了
    
    // console.log(captcha.text); // captcha.text 是验证码上的文字或计算结果
	
	res.type('svg');
	res.status(200).send(captcha.data);
});


// 导出router
module.exports = router;