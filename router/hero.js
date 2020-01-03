const db = require('../db');

// 存放所有和heroes表相关的操作，这些接口也是必须登录才能访问的

// 使用路由文件的步骤：
// 1. 加载express
// 2. 创建对象
// 3. 将接口全部挂载到router上
// 4. 导出router对象
// 5. (app.js) 加载router对象，并将它注册成中间件

const express = require('express');
const router = express.Router();


router.get('/index.html', (req, res) => {
    res.sendFile(rootPath + '/manager/index.html');
});

router.get('/add.html', (req, res) => {
    res.sendFile(rootPath + '/manager/add.html');
});

router.get('/edit.html', (req, res) => {
    res.sendFile(rootPath + '/manager/edit.html');
});
// 1. 完成获取英雄的接口
router.get('/getHeroes', (req, res) => {
    // 接收前端传递过来的page
    let page = req.query.page || 1; // page表示页码

    // 判断，如果有搜索的内容，则设置一个where条件
    let keywords = req.query.keywords;
    let w = '';
    if (keywords) {
        w = ' where name like "%'+keywords+'%" or nickname like "%'+keywords+'%" ';
    }

    let pageNum = 5; // 表示每页显示多少条
    let sql = 'select * from heroes ' + w + ' limit ' + (page-1) * pageNum + ',' + pageNum;
    sql += ';select count(*) c from heroes' + w;
    db(sql, null, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({
            data: result[0],
            pageTotal: Math.ceil(result[1][0].c / pageNum)
        });
        // res.send(result);
    });
});


// 2. 完成添加英雄的接口
// 加载multer
const multer = require('multer');
// 配置multer
const upload = multer({ dest: 'uploads/'});

router.post('/addHero', upload.single('heroIcon'), (req, res) => {
    // console.log(req.body); // { heroName: '拉克丝', heroNickName: '光辉女郎', skillName: '动感光波' }
    // console.log(req.file);
    // 写SQL，完成添加入库
    let sql = 'insert into heroes set ?';
    let values = {
        // 字段： 值
        name: req.body.heroName,
        nickname: req.body.heroNickName,
        skill: req.body.skillName,
        file: req.file.path
    };
    db(sql, values, (err, result) => {
        if (err) {
            // send方法，它会将对象自动转成json格式并响应
            res.send({code: 201, message: '添加失败'});
        } else {
            res.send({code: 200, message: '添加成功'});
        }
    });
});


// 3. 根据id，获取一个英雄
router.get('/getHeroById', (req, res) => {
    // 获取url上的id参数
    // req.query -- 可以获取到url上所有的参数。这是express提供的一个属性
    let id = req.query.id;
    if (id == '' || isNaN(id)) {
        res.send('参数错误');
        return;
    }
    db('select * from heroes where id=?', id, (err, result) => {
        if (err) throw err;
        res.send(result[0]);
    });
});

// 4. 更新的接口
router.post('/updateHero', upload.single('heroIcon'), (req, res) => {
    // console.log(req.body); // { heroName: '拉克丝', heroNickName: '光辉女郎', skillName: '动感光波' }
    // console.log(req.file);
    // 写SQL，完成添加入库
    let sql = 'update heroes set ? where id = ?';
    let values = {
        // 字段： 值
        name: req.body.heroName,
        nickname: req.body.heroNickName,
        skill: req.body.skillName
    };
    // 单独设置文件
    // console.log(req.file); // 如果没有选择图片，req.file为undefined
    if (req.file !== undefined) {
        // 说明此次更新了头像
        values.file = req.file.path;
    }
    // return;
    db(sql, [values, req.body.id], (err, result) => {
        if (err) {
            // send方法，它会将对象自动转成json格式并响应
            res.send({code: 201, message: '更新失败'});
        } else {
            res.send({code: 200, message: '更新成功'});
        }
    });
});


// 5. 删除英雄的接口
router.get('/deleteHero', (req, res) => {
    // 获取url上的id
    // console.log(req.query);
    let id = req.query.id;
    if (id == '' || isNaN(id)) {
        res.send('参数错误');
        return;
    }
    // 完成删除
    db('delete from heroes where id = ?', id, (err, result) => {
        if (err) {
            res.send({code: 201, message: '删除失败'});
        } else {
            res.send({code: 200, message: '删除成功'});
        }
    });
});

// 导出router对象
module.exports = router;
