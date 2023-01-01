const {User} = require('../models/User');

let auth = (req, res, next) => {

  // 인증 처리

  // client cookie에서 token을 가져옴.
  let token = req.cookies.x_auth;

  // token 복호화 후, 유저를 찾음.
  User.findByToken(token, (err, user) => {
    if(err) throw err;

    // 유저가 없으면 인증 No
    if(!user) return res.json({isAuth: false, error: true});

    // 유저가 있으면 인증 Okay
    req.token = token;
    req.user = user;
    next();
  })  
}

module.exports = {auth};