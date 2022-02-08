const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mainPage = require('./main');

// 初始化
mainPage.use(bodyParser.json());
mainPage.use(bodyParser.urlencoded({ extended: false }));

const app = express();

app.use('/', mainPage);

app.listen(80, () => {
  console.log('server start on http://127.0.0.1:80');
})
