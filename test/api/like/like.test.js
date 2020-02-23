const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../../../app.js');
const request = require('supertest')(app);

chai.use(chaiHttp);
// token for the protected routers
let token;

const user = {
  user_name: 'clirim',
  password: 'kosova123'
}

before(async ()=>{
  // User sign to generate jsonwebtoken
  const res = await request.post('/login').send(user).expect(200);
  token = res.body.token;
})

describe('GET /most-liked', () => {
  // Get all users sorted by likes
  it('should return Array of Users and status 200', done => {
      chai.request(app).get('/most-liked')
        .end((error, res) => {
          // .and.to.have.property(users)
          expect(res.body).to.be.an.instanceof(Object)
          .to.have.nested.property("users[0]")
          .that.includes.all.keys([ '_id', 'user_name', 'email', 'likes', 'like_count' ])
          expect(res).to.have.status(200);
          done();
        })
  });
});

describe('POST /user/:id/like', () => {
   // Like User
   it('Should return message and status 200', done => {
    chai.request(app).post('/user/5e4e32f4cdfc5e6c5c02644e/like').set("Authorization", 'Bearer ' + token)
    .end((error, res) => {
      expect(res).to.be.json;
      expect(res.body).to.be.an.instanceof(Object)
      expect(res).to.have.status(200);
      done();
    })
  });
});

describe('POST /user/:id/unlike', () => {
  // Unlike User
  it('Should return message and status 200', done => {
    chai.request(app).post('/user/5e4e32f4cdfc5e6c5c02644e/unlike').set("Authorization", 'Bearer ' + token)
    .end((error, res) => {
    expect(res).to.be.json;
    expect(res.body).to.be.an.instanceof(Object)
    .and.to.have.property('message');
    expect(res).to.have.status(200);
    done();
   })
 });
});

