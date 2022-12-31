const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10 // salt의 자릿수


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

const User = mongoose.model('User', userSchema)
module.exports = {User}