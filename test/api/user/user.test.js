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

describe('GET /user/:id', () => {
  // Get user data
  it('should return User data and status 200', done => {
    chai.request(app).get('/user/5e4e32f4cdfc5e6c5c02644e')
      .end((error, res) => {
        expect(res.body).to.be.an.instanceof(Object)
        .to.have.nested.property("user")
        .and.to.have.all.keys([ '_id', 'user_name', 'email', 'likes', 'like_count' ])
        expect(res).to.have.status(200);
        done();
      })
  });
});

describe('GET /me', () => {
  // GET data of the actuale login user
  it('Should return actuale user data and status 200', done => {
   chai.request(app).get('/me').set("Authorization", 'Bearer ' + token)
   .end((error, res) => {
     expect(res.body).to.be.an.instanceof(Object)
     .to.have.nested.property("user")
     .and.to.have.all.keys([ '_id', 'user_name', 'email', 'likes', 'like_count' ])
     expect(res).to.have.status(200);
     done();
   })
 });
});

describe('PUT /me/update-password', () => {
  // Update user password
  it('Should return message for changed password and status 200', done => {
   chai.request(app).put('/me/update-password').set("Authorization", 'Bearer ' + token)
   .send({old_password: "kosova123", new_password: "kosova555"})
   .end((error, res) => {
     expect(res).to.be.json;
     expect(res.body).to.be.an.instanceof(Object)
     expect(res).to.have.status(200);
     done();
   })
 });
  // Incorrect old password
  it('Should return message for incorrect password and status 403', done => {
    chai.request(app).put('/me/update-password').set("Authorization", 'Bearer ' + token)
    .send({old_password: "testPassword", new_password: "kosova555"})
    .end((error, res) => {
      expect(res).to.be.json;
      expect(res.body).to.be.an.instanceof(Object)
      expect(res).to.have.status(403);
      done();
    })
  })
  // Return the password to the old one
  it('Should return acctual user data and status 200', done => {
    chai.request(app).put('/me/update-password').set("Authorization", 'Bearer ' + token)
    .send({old_password: "kosova555", new_password: "kosova123"})
    .end((error, res) => {
      expect(res).to.be.json;
      expect(res.body).to.be.an.instanceof(Object)
      expect(res).to.have.status(200);
      done();
    })
  });
});

