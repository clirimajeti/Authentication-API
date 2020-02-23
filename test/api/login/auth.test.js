const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const app = require('../../../app.js');

describe('POST /signup', () => {
  // Create User
  it('should return Message and status 201', done => {
      let randomUsername = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
      chai.request(app).post('/signup').send({
        "user_name": randomUsername,
        "password": "test1234",
        "email": "test@test.com"
      }).end((error, res) => {
        expect(res.body).to.contain.property('message');
        expect(res).to.have.status(201);
        done();
      })
  });
  // User exists
  it('Should return message and status 406', done => {
    chai.request(app).post('/signup').send({
      "user_name": "test",
      "password": "test1234",
      "email": "_test@test.com"
    }).end((error, res) => {
      expect(res.body).to.contain.property('message');
      expect(res).to.have.status(406);
      done();
    })
  });
});

describe('POST /login', () => {
  // Login returns  jsonwebtoken
  it('should return token and status 200', done => {
      chai.request(app).post('/login').send({
        "user_name": "clirim",
        "password": "kosova123"
      }).end((error, res) => {
        expect(res).to.be.json;
        expect(res.body).to.be.an.instanceof(Object)
        .and.to.have.property('token');
        expect(res).to.have.status(200);
        done();
      })
  });
  // Username or password incorrect
  it('should return message and status 403', done => {
      chai.request(app).post('/login').send({
        "user_name": "clirim",
        "password": "test123412"
      }).end((error, res) => {
        expect(res).to.be.json;
        expect(res).to.have.status(403);
        done();
      })
  });
});
