const fs = require('fs');
const path = require('path');

const express = require('express');
const cors = require('cors');

// 文件配置
const config = {};
fs.readFile(path.join(__dirname, '../data/config.json'), function (res) {
  config = JSON.parse(res);
});
console.log(config);

const secretKey = config.secretKey;

const app = express();

app.use((req, res, next) => {
  // status 默认值为 1，表示失败的情况
  // err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})


// 设置权限接口
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] }))
// 跨域访问
app.use(cors());
// json转换
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const mainPage = require('./main');
const loginSystem = require('./loginModule');

app.use('/', mainPage);

// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 身份认证失败后的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知的错误
  res.cc(err)
})

app.listen(80, () => {
  console.log('server start on http://127.0.0.1');
})
