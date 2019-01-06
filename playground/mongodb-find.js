// const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
  if (err) {
    return console.log('Unable to connect to the MongoDB server');
  }
  console.log('Connected to mongodb successfully');
//   const db=client.db('TodoApp')
// db.collection('todo').find({
//   _id:new ObjectID('5c32464bb43c4d2c5bde4366')
// }).toArray().then((docs)=>{
//   console.log('todo');
//   console.log(JSON.stringify(docs,undefined,2));
// },(err)=>{
//   console.log('Unable to fetch todos',err);
// });
// const db=client.db('TodoApp')
// db.collection('todo').find().count().then((count)=>{
// console.log(`todo count: ${count}`);
// console.log(JSON.stringify(docs,undefined,2));
// },(err)=>{
// console.log('Unable to fetch todos',err);
// });
const db=client.db('TodoApp')
db.collection('users').find({name:'Mark'}).toArray().then((docs)=>{
console.log(JSON.stringify(docs,undefined,2));
},(err)=>{
console.log('Unable to fetch todos',err);
});
});
  // const db=client.db('TodoApp')

  // db.collection('todo').insertOne({
  //   text:'SOME random texts',
  //   completed:false
  // },(err,result)=>{
  //   if (err) {
  //     return console.log('Unable to insert todo');
  //   }
  //   console.log(JSON.stringify(result.ops,undefined,2));
  // })
//   db.collection('users').insertOne({
//     name:'Santhosh',
//     age:19,
//     location:'Coimbatore'
//   },(err,result)=>{
//     if (err) {
//       return console.log('Unable to connect to Users');
//     }
//     console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
//   })

// });
