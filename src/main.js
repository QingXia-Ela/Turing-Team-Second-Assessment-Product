const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
// const bodyParser = require('body-parser')

// 初始化
// router.use(express.json());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// 主页静态资源
router.use(express.static(path.join(__dirname, '../public')));

// 全局数组
var moneyData = [];
var eventData = [];

const readLocalFile = (req, res, next) => {
  fs.readFile(path.join(__dirname, '../data/moneyData.json'), 'utf-8', (err, dataStr) => {
    f1 = 1;
    if (err) return res.sendStatus(500);
    moneyData = JSON.parse(dataStr);
  })
  fs.readFile(path.join(__dirname, '../data/eventData.json'), 'utf-8', (err, dataStr) => {
    if (err) return res.sendStatus(500);
    eventData = JSON.parse(dataStr);
    next();
  })
}

// 获取数据端口
router.get('/content', readLocalFile, function (req, res) {
  res.send({ moneyData, eventData, status: 200 });
})

// 接受数据接口
router.post('/api/:classChoose', (req, res) => {

  let content = req.body;
  content = JSON.stringify(content);
  content = JSON.parse(content);

  if (req.params.classChoose === "moneyBooking" && content.moneyData) {
    let fileData = JSON.parse(content.moneyData);
    fs.writeFile(path.join(__dirname, '../data/moneyData.json'), JSON.stringify(fileData), 'utf-8', function (err) {
      if (err) res.send(500);
      res.send({ status: 201 });
    })
  }
  else if (req.params.classChoose === "eventBooking" && content.eventData) {
    let fileData = JSON.parse(content.eventData);
    fs.writeFile(path.join(__dirname, '../data/eventData.json'), JSON.stringify(fileData), 'utf-8', function (err) {
      if (err) res.sendStatus(500);
      res.send({ status: 201 });
    })
  }
  else res.send({ status: 501 });
})

// 错误中间件
router.use((err, req, res, next) => {
  console.log(err.message);
})


module.exports = router;