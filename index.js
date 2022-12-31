const config = require('./config/key')

const express = require('express')
const app = express()
const port = 5000

const {User} = require('./models/User');
const bodyParser = require('body-parser'); // client에서 보내는 정보를 서버에서 분석해서 가져올 수 있도록 함.

// application/x-www-form-urlencoded 타입을 분석해서 가져올 수 있게 함.
app.use(bodyParser.urlencoded({extended: true}));
// application/json 타입을 분석해서 가져올 수 있게 함.
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.set('strictQuery',true)
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send("Hello World!"))

// Register router
app.post('/register', (req, res) => {
  // 회원가입 시 필요한 정보들을 client에서 가져와서
  // 데이터베이스에 넣음.
  const user = new User(req.body) // body-parser을 이용해서 client에서 보내는 정보를 req.body로 받아줌.

  user.save((err, userInfo) => { // mongodb의 method (정보들이 user model에 저장됨.)
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  }) 
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))