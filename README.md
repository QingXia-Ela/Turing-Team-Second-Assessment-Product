# Turing-Team-Second-Assessment-Product
图灵团队二轮考核作品

这里是对接了 MySQL 的成品

**node 环境**

```
npm install
```

有关配置都在 data / config 下面

```json
{
    "port": 80, // 服务器启动端口
    "secretKey": "Shiinafan", // cookie加密字符串
    "cookieAge": 604800000 // cookie有效期
}
```

**sql 连接配置**

位于 src 文件夹下的 main.js 和 loginModule 中 ， 使用 db 作为常量

```js
const db = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: '',
  password: '',
  database: 'notedata'
})
```

**sql 存储表头**

记账结构：

database名字：moneydata
| id   | year | month | day  | moneySpend    | moneyGet      | moneyInfo |
| ---- | ---- | ----- | ---- | ------------- | ------------- | --------- |
| INT  | INT  | INT   | INT  | DECIMAL(10,2) | DECIMAL(10,2) | CHAR(200) |

记事结构：

database名字：eventdata
| id   | year | month | day  | eventTitle | eventInfo | eventFinish |
| ---- | ---- | ----- | ---- | ---------- | --------- | ----------- |
| INT  | INT  | INT   | INT  | CHAR(200)  | CHAR(200) | TINYINT     |

用户登陆结构：

database名字：userlist

| id   | username | password | status  |
| ---- | -------- | -------- | ------- |
| INT  | CHAR(15) | CHAR(30) | TINYINT |

其中 eventFinish 还没有在主 html 结构进行使用

status 用来允许用户是否可以登陆
