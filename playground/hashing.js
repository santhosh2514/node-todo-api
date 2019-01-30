const {SHA256} = require('crypto-js');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcryptjs')

var password = '123abc'

bcrypt.genSalt(10,(err,salt)=>{
  bcrypt.hash(password,salt,(err, hash)=>{
    // console.log(hash);
  })
})

var hashedPassword = '$2a$10$TMQDbUfzrMLnshGKkykMcu6f4mReB1CjY11BQojzj24JFtphPjLUG'

bcrypt.compare('123jhgf',hashedPassword,(err,res)=>{
  console.log(res);
});
 //10  is the number of rounds to make a salt.
// var data = {
// id:10
// }
// var token = jwt.sign(data,'123abc')
// console.log(token);
// var decoded = jwt.verify(token,'123abcc')
// console.log('decoded: ',decoded);;
//
// var message ="I am number 3";
// var hash=SHA256(message).toString();
// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);
