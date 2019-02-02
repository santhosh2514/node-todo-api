const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed')

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});
describe('GET/todos',()=>{
  it('Should get all todos',(done)=>{
    request(app)
    .get('/todos')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(1)
    })
    .end(done);
  })
})
describe('GET/todos/:id',()=>{
  it('Should return a todo doc',(done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text)
    })
    .end(done)
  })
  it('Should not return a todo doc created by other user',(done)=>{
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(404)
    .end(done)
  })
  it('Should return 404 if todo not found',(done)=>{
    var hexId = new ObjectId().toHexString();
    request(app)
    .get(`/todos/${hexId}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(404)
    .end(done)
  })
  it('Should return 404 for non-ObjectId',(done)=>{
    request(app)
    .get('/todos/12432')
    .set('x-auth',users[0].tokens[0].token)
    .expect(404)
    .end(done)
  })
  describe('DELETE/todos/:id',()=>{
    it('Should remove a todo',(done)=>{
      var hexId = todos[1]._id.toHexString();

      request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo._id).toBe(hexId);
        })
        .end((err,res)=>{
          if(err){
            return done(err);
          }
          Todo.findByIdAndDelete(hexId).then((todo)=>{
            expect(todo).toBeFalsy();
            done();
          }).catch((e) => done(e));
        });
    });
    it('Should remove a todo',(done)=>{
      var hexId = todos[0]._id.toHexString();

      request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(404)
        .end((err,res)=>{
          if(err){
            return done(err);
          }
          Todo.findByIdAndDelete(hexId).then((todo)=>{
            expect(todo).toBeTruthy();
            done();
          }).catch((e) => done(e));
        });
    });
    it('Should return 404 if todo not found',(done)=>{
      var hexId = new ObjectId().toHexString();
      request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end(done)
    })
    it('Should return 404 if ObjectId is invalid',(done)=>{
      var hexId = new ObjectId().toHexString();
      request(app)
      .delete(`/todos/12342`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end(done)
    })
})
})
describe('PATCH/todos/:id',()=>{
  it('Should update the todo',(done)=>{
    var hexId = todos[0]._id.toHexString();
    var text = 'A new Text';
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth',users[0].tokens[0].token)
      .send({
        completed:true,
        text:text
      })
      .expect(200)
      .expect((res)=>{
         expect(res.body.todo.text).toBe(text);
         expect(res.body.todo.completed).toBe(true);
         expect(typeof res.body.todo.completedAt).toBe('number');
      })
        .end(done);
  })
  it('Should not update the todo by other user',(done)=>{
    var hexId = todos[0]._id.toHexString();
    var text = 'A new Text';
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .send({
        completed:true,
        text:text
      })
      .expect(404)
      .end(done);
  })
  it('Should clear completedAt when todo is not completed',(done)=>{
    var hexId = todos[1]._id.toHexString();
    var text = 'A new Text'
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .send({
        completed:false,
        text:text
      })
      .expect(200)
      .expect((res)=>{
         expect(res.body.todo.text).toBe(text);
         expect(res.body.todo.completed).toBe(false);
         expect(res.body.todo.completedAt).toBeFalsy();
      })
        .end(done);

      })
  });

  describe('GET /users/me',()=>{
    it('should return user if authenticated',(done)=>{
      request(app)
      .get('/users/me')
      .set('x-auth',users[0].tokens[0].token)//header and header value
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done)

    });
    it('should return 401 if not authenticated',(done)=>{
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({})
    })
    .end(done)
  })
  })
  describe('POST /users',()=>{
    it('should create a user',(done)=>{
      var email = 'hey@examp.com'
      var password = 'asdf123'

      request(app)
      .post('/users')
      .send({email,password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err)=>{
        if(err){
          return done(err);
        }
        User.findOne({email}).then((user)=>{
          expect(user).toBeTruthy();
          expect(user.password).not.toMatch(password);
          done();
        }).catch((e)=>done(e))
      });
    });
    it('should return validation errors if request is invalid',(done)=>{
      request(app)
      .post('/users')
      .send({
        email:'adf',
        password:'fjvh'
      })
      .expect(400)
      .end(done);
    })
    it('should not create user if email is in use',(done)=>{
      request(app)
      .post('/users')
      .send({
        email:users[0].email,
        password:'ppaswsoe123'
      })
      .expect(400)
      .end(done);
    })
  })
  describe('POST /users/login',()=>{
    it('should login user and return auth token',(done)=>{
      request(app)
      .post('/users/login')
      .send({
        email:users[1].email,
        password:users[1].password
      })
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens[1]).toMatchObject({
            access:'auth',
            token:res.headers['x-auth']
          })
          done();
        }).catch((e)=>done(e));
      })
    })
    it('should reject invalid login',(done)=>{
      request(app)
      .post('/users/login')
      .send({
        email:users[1].email,
        password:'pokeeeemmm'
      })
      .expect(400)
      .expect((res)=>{
        expect(res.headers['x-auth']).not.toBeTruthy();
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e)=>done(e));
      })
  })
})
describe('DELETE /users/me/token',()=>{
  it('should remove auth token when logged out',(done)=>{
    request(app)
    .delete('/users/me/token')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      User.findById(users[0]._id).then((user)=>{
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e)=>done(e));
    })
  })
  })
