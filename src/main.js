const fs = require('fs');
const path = require('path');

const express = require('express');
const mysql = require('mysql');
// const { urlencoded } = require('body-parser');

const router = express.Router();
const db = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '030201mysql',
  database: 'notedata'
})

const moneySql = "notedata.moneyData";
const eventSql = "notedata.eventData";

// 主页模块
router.use(express.static(path.join(__dirname, '../public')));

// json转换
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// mysql链接自检
router.use((req, res, next) => {
  db.query('select 1', (err, res) => {
    if (err) res.send(500);
    else next();
  })
})

// 全局对象
let moneyData = [];
let eventData = [];

// 局部中间件
// 读取数据
const readData = (req, res, next) => {
  // 查询 
  db.query('select * from notedata.moneydata', (err, sqlRes) => {
    if (err) {
      console.log(err.message);
      res.send(500);
    }
    else moneyData = sqlRes;
  })
  db.query('select * from notedata.eventdata', (err, sqlRes) => {
    if (err) {
      console.log(err.message);
      res.send(500);
    }
    else eventData = sqlRes;
    next();
  })
}

// 获取数据端口
router.get('/content', readData, function (req, res) {
  res.send({ moneyData, eventData, status: 200 });
})

// 接受数据接口
router.post('/api/:classChoose', (req, res) => {

  let content = req.body;
  content = JSON.stringify(content);
  content = JSON.parse(content);

  if (req.params.classChoose === "moneyBooking" && content.moneyData) {
    let sqlCommand = 'insert into notedata.moneydata set ?'
    let fileData = JSON.parse(content.moneyData);
    db.query(sqlCommand, fileData, (err, sqlRes) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      return res.sendStatus(201);
    })
  }
  else if (req.params.classChoose === "eventBooking" && content.eventData) {
    let sqlCommand = 'insert into notedata.eventdata set ?'
    let fileData = JSON.parse(content.eventData);
    db.query(sqlCommand, fileData, (err, sqlRes) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      return res.sendStatus(201);
    })
  }
  else return res.sendStatus(500);
})

// 删除数据接口
router.get('/delete', (req, res) => {
  let classChoose = req.query.classChoose;
  let deleteID = parseInt(req.query.deleteID);
  if (classChoose === "eventShowArea") {
    let sqlCommand = `delete from ${eventSql} where id=${deleteID}`;
    db.query(sqlCommand, (err, sqlRes) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
    })
  }
  else if (classChoose === "moneyShowArea") {
    let sqlCommand = `delete from ${moneySql} where id=${deleteID}`;
    db.query(sqlCommand, (err, sqlRes) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
    })
  }
  res.sendStatus(200);
})

// 错误中间件
router.use((err, req, res, next) => {
  console.log(err.message);
})


module.exports = router;