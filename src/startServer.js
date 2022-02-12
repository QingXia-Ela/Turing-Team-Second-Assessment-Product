const express = require('express');
const cors = require('cors');
// const expressJWT = require('express-jwt');
const session = require('express-session');

const app = express();

// 文件配置
const config = require('./readConfig');

// 跨域访问
app.use(cors());
// json转换
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cookie配置
app.use(
  session({
    secret: config.secretKey,
    cookie: { maxAge: config.cookie },
    resave: false,
    saveUninitialized: true,
  })
)
// app.use(expressJWT({ secret: config.secretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api/, /^\/login/, /^\/lib/] }))

// 设置权限接口
const mainPage = require('./main');
const loginSystem = require('./loginModule');

app.use('/', mainPage);
app.use('/login/', loginSystem);

// 定义错误级别的中间件
app.use((err, req, res, next) => {
  console.log(err);
  res.send({
    message: "Unknown error"
  })
})

app.listen(80, () => {
  console.log('server start on http://127.0.0.1');
})
