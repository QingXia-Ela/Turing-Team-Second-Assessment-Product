# Turing-Team-Second-Assessment-Product
图灵团队二轮考核作品

这里是对接了 MySQL 的成品

**node 环境**

```
npm i express
npm i mysql
```

**sql 连接配置**

位于 src 文件夹下的 main.js 中 ， 使用 db 作为常量

```js
const db = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'notedata'
})
```

**sql 存储表头**

记账结构：

| id   | year | month | day  | moneySpend    | moneyGet      | moneyInfo |
| ---- | ---- | ----- | ---- | ------------- | ------------- | --------- |
| INT  | INT  | INT   | INT  | DECIMAL(10,2) | DECIMAL(10,2) | CHAR(200) |

记事结构：

| id   | year | month | day  | eventTitle | eventInfo | eventFinish |
| ---- | ---- | ----- | ---- | ---------- | --------- | ----------- |
| INT  | INT  | INT   | INT  | CHAR(200)  | CHAR(200) | TINYINT     |

其中 eventFinish 还没有在主 html 结构进行使用
