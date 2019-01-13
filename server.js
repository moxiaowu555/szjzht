const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
// 导入svg-captcha
const svgCaptcha = require('svg-captcha');

const conn = mysql.createConnection({
    localhost: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'szjzht_001',
    // 开启执行多条sql语句的功能
    multipleStatements: true
});

// 注册解析表单数据的中间件
app.use(bodyParser.urlencoded({ extended: false }));

// 启用session中间件
app.use(session({
    secret: '这是加密的密钥',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 10000},
}));

// 设置模板引擎
app.engine('html', require('express-art-template'));
app.set('view engine', 'html');
app.set('views', './views');

// 托管静态资源
app.use('/node_modules/', express.static('./node_modules/'));
app.use('/lib', express.static('./lib'));
app.use('/css', express.static('./css'));
app.use('/images', express.static('./images'));

// 展示登录界面
app.get('/', (req, res) => {
    res.render('szjzht-login1.html');
});
// 请求图形验证码
app.get('/get-img-verify', (req, res) => {
    let option = req.query;
    
    // 验证码有2个属性：1.text 是字符， 2.data 是svg代码
    let code =svgCaptcha.createMathExpr(option);
    // 保存到session ,忽略大小写
    // req.session['randomcode'] = code.text.toLowerCase();
    req.session.randomcode = code.text.toLowerCase();
    // 返回数据直接放入页面元素展示
    res.send({
        img: code.data
    });
});

// 请求登录
app.post('/login', (req, res) => {
    // 获取表单提交的数据
    const body = req.body;
    console.log(req.body);
    console.log(req.session)
    // 执行sql语句，查询用户是否存在
    const sql1 = 'select * from jzht_user where uname=? and password=?';
    conn.query(sql1, [body.username, body.password], (err, result) => {
        // 如果查询期间，执行Sql语句失败，则认为登录失败！
        if(err) return res.send({msg: '登录失败！ ', status: 501 });
        console.log(result);
        // 如果查询的结果，记录条数不为 1， 则证明查询失败
        if(result.length !== 1) return res.send({msg: '账号或密码错误', status: 502});
        // 密码不匹配，返回密码错误
        // if(body.password !== result[0].password) return res.send({msg: '密码错误', status: 503});
        // 验证码不匹配，返回验证码错误
        if(body.code !== req.session.randomcode) return res.send({msg: '验证码错误', status: 504});
        // 没有报错，则查询成功，可以登录
        // res.render({ msg: '登录成功', status: 200 });
        res.send({msg: '登录成功', status: 200});
    })

})


app.listen(5000, () => {
    console.log('server running at http://127.0.0.1:5000');
})