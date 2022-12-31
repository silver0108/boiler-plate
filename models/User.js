const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // salt의 자릿수
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, // 스페이스를 없애주는 역할
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: { // 관리자와 일반유저 구분
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  }
})


// user model의 user 정보를 save 하기 전에 함수 수행 후 save 실행
userSchema.pre('save', function(next){
  var user = this;

  // password가 바뀔 때만 실행
  if(user.isModified('password')){
    // 비밀번호 암호화
    bcrypt.genSalt(saltRounds, function(err, salt){ // salt 생성
      if(err) return next(err)

      bcrypt.hash(user.password, salt, function(err, hash){
        if(err) return next(err)
        user.password = hash // hash: 암호화된 비밀번호
        next()
      });
    });
  }
  else{
    next()
  }
}) 


userSchema.methods.comparePassword = function(plainPassword, cb){
  bcrypt.compare(plainPassword, this.password, function(err, isMatch){ // 받은 plainPassword를 다시 암호화해서 비교하는 로직
    if(err) return cb(err);
    cb(null, isMatch)
  })
}


userSchema.methods.generateToken = function(cb){
  var user = this;

  // jsonwebtoken을 이용해서 token 생성
    // user._id + 'secretToken' = token
  var token = jwt.sign(user._id.toHexString(), 'secretToken') // _id: 데이터베이스에 있는 id
  
  user.token = token
  user.save(function(err, user){
    if(err) return cb(err)
    cb(null, user)
  })
  
}

const User = mongoose.model('User', userSchema)
module.exports = {User}