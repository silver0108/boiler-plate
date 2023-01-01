const config = require('./config/key')

const express = require('express')
const app = express()
const port = 5000

const {User} = require('./models/User');
const bodyParser = require('body-parser'); // client에서 보내는 정보를 서버에서 분석해서 가져올 수 있도록 함.

const cookieParser = require('cookie-parser');

const {auth} = require('./middleware/auth');

// application/x-www-form-urlencoded 타입을 분석해서 가져올 수 있게 함.
app.use(bodyParser.urlencoded({extended: true}));
// application/json 타입을 분석해서 가져올 수 있게 함.
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.set('strictQuery',true)
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send("Hello World!"))


// Register router
app.post('/api/users/register', (req, res) => {

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


// Login router
app.post('/api/users/login', (req, res) => {

  // 요청된 email을 데이터베이스에서 찾음.
  User.findOne({email: req.body.email}, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    // 요청된 email이 데이터베이스에 있으면 비밀번호가 일치하는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) return res.json({
        loginSuccess: false, 
        message: "비밀번호가 틀렸습니다."
      })

      // 비밀번호가 일치하면 토큰 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        
        // client쪽에도 토큰 저장 (쿠키, 로컬스토리지 등등 여러가지) => 쿠키에 저장할 것임.
        res.cookie("x_auth", user.token)
          .status(200)
          .json({loginSuccess: true, userID: user._id})
      })
    })
  })
})


// Auth router
app.get('/api/users/auth', auth, (req, res) => {

  // next로 middleware 통과 == Authenticatoin "true"
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))