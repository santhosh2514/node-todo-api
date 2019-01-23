const {ObjectId} =require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo}=require('./../server/models/todo')
const {User}=require('./../server/models/user')

// Todo.remove({}).then((result)=>{
//   console.log(result);
// });
Todo.findOneAndDelete('_id:5c42198b4485f01b40f3022c').then.((result)=>{
  console.log(result);
});

Todo.findByIdAndDelete('5c42198b4485f01b40f3022c').then((result)=>{
  console.log(result);
});
// var id = "5c3a0685b0509e0dc86ca9ed"
//
// if(!ObjectId.isValid(id)){
//   console.log("id not valid");
// }
// // Todo.find({
// //   _id: id
// // }).then((todos)=>{
// //   console.log('todos',todos);
// // })
// // Todo.findOne({
// //   _id: id
// // }).then((todo)=>{
// //   console.log('todo',todo);
// // })
// // Todo.findById(id).then((todo)=>{
// //   if(!todo){
// //     console.log("Id not found");
// //   }
// //   console.log('todo',todo);
// // }).catch((e)=>{
// //   console.log(e);
// // })
// User.findById(id).then((user)=>{
//   if(!user){
//     console.log("Id not found");
//   }
//   console.log('User',user);
// },(e)=>{
//   console.log(e);
// })
