const fs = require('fs');
const path = require('path');

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
// const jwt = require('jsonwebtoken')
// const expressJWT = require('express-jwt')
const session = require('express-session');

const app = express();

// 文件配置
const config = require('./readConfig');
// app.use(expressJWT({ secret: config.secretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api/, /^\/login/, /^\/lib/] }))

// sql连接
const db = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '030201mysql',
  database: 'notedata'
})
// json转换
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 跨域
app.use(cors());

app.use(express.static('../public/login'));

app.post('/:select', (req, res) => {
  // 登陆验证
  if (req.params.select === "submit") {
    const userinfo = req.body;
    let sqlCommand = `select * from notedata.userlist where username='${userinfo.username}'`
    db.query(sqlCommand, (err, sqlRes) => {
      if (err) {
        console.log(err);
        return res.send({
          status: 500,
          message: "用户名错误或服务器内部错误!"
        });
      }
      else {
        // 登陆成功
        if (sqlRes[0].password === userinfo.password && sqlRes[0].status == 0) {
          req.session.user = userinfo.username;
          req.session.islogin = true;
          res.send({
            status: 200,
            message: '登陆成功',
          })
        }
        // 出错
        else {
          return res.send({
            status: 400,
            message: "用户名或密码错误!"
          })
        }
      }
    })
  }

  else return res.sendStatus(501);
})

module.exports = app;