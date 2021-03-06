const fs = require('fs');
const path = require('path');

const express = require('express');

const router = express.Router();

// 主页模块
router.use(express.static(path.join(__dirname, '../public')));

// 获取数据端口
router.get('/content', function (req, res) {
  let moneyData = [];
  let eventData = [];
  fs.readFile(path.join(__dirname, '../data/moneyData.json'), 'utf-8', (err, data) => {
    if (err) return res.send({ status: 500 });
    moneyData = JSON.parse(data);
  })
  fs.readFile(path.join(__dirname, '../data/eventData.json'), 'utf-8', (err, data) => {
    if (err) return res.send({ status: 500 });
    eventData = JSON.parse(data);
  })
  res.send({ moneyData, eventData, status: 200 });
})

// 接受数据接口
router.post('/api/:classChoose', (req, res) => {
  if (req.params.classChoose === "moneyBooking") {
    let content = req.body;
    fs.writeFile(path.join(__dirname, '../data/moneyData.json'), content, 'utf-8', function (err) {
      if (err) return res.send({ status: 500 });
      return res.send({ status: 201 });
    })
  }
  else if (req.params.classChoose === "eventBooking") {
    fs.writeFile(path.join(__dirname, '../data/eventData.json'), content, 'utf-8', function (err) {
      if (err) return res.send({ status: 500 });
      return res.send({ status: 201 });
    })
  }
  else return res.send({ status: 501 });
})




module.exports = router;