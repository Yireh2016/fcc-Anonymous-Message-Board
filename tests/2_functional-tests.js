/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function(done) {
    suite("POST", function() {
      test("Test api/threads POST text and passwd", done => {
        chai
          .request(server)
          .post("/api/threads/test2")
          .send({
            text: "test",
            delete_password: "321654987"
          })
          .end((err, res) => {
            if (err) {
              done();
              return;
            }
            console.log("res ", res.redirects);
            assert.match(res.redirects[0], /^http.*test2$/, "regex match");
            done();
          });
      });
    });

    //     suite('GET', function() {

    //     });

    suite("DELETE", function() {
      test("Delete thearad success", done => {
        const date = new Date();

        chai
          .request(server)
          .post("/api/threads/test2")
          .send({
            text: "test",
            delete_password: "321654987",
            id: date.getTime().toString()
          })
          .end((err, res) => {
            chai
              .request(server)
              .delete("/api/threads/test2")
              .send({
                thread_id: date.getTime().toString(),
                delete_password: "321654987"
              })
              .end((err, res) => {
                if (err) {
                  done();
                  return;
                }
                assert.equal(res.text, "success");
                done();
              });
          });
      });

      test("Delete thearad incorrect password", done => {
        const date = new Date();

        chai
          .request(server)
          .post("/api/threads/test2")
          .send({
            text: "test",
            delete_password: "321654987",
            id: date.getTime().toString()
          })
          .end((err, res) => {
            chai
              .request(server)
              .delete("/api/threads/test2")
              .send({
                thread_id: date.getTime().toString(),
                delete_password: "jhkjjdhs"
              })
              .end((err, res) => {
                if (err) {
                  done();
                  return;
                }
                assert.equal(res.text, "incorrect password");
                done();
              });
          });
      });
    });

    //     suite('PUT', function() {

    //     });
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    suite("POST", function() {
      test("Test api/replies POST text and passwd", done => {
        const date = new Date();
        chai
          .request(server)
          .post("/api/threads/test2")
          .send({
            text: "test",
            delete_password: "123rewerq",
            id: date.getTime().toString()
          })
          .end((err, res) => {
            chai
              .request(server)
              .post("/api/replies/test2")
              .send({
                text: "test",
                delete_password: "321654987",
                thread_id: date.getTime().toString()
              })
              .end((err, res) => {
                if (err) {
                  done();
                  return;
                }
                console.log("res ", res.redirects);
                const regEx = new RegExp(
                  `^http.*${date.getTime().toString()}$`
                );
                assert.match(res.redirects[0], regEx, "regex match");
                done();
              });
          });
      });
    });

    suite("GET", function() {
      test("Test api/replies GET array of the most recent 10 bumped threads and 3 replies", done => {
        chai
          .request(server)
          .get("/api/threads/test2")
          .send()
          .end((err, res) => {
            if (err) {
              done();
            }
            const resArr = res.body;
            assert.isTrue(resArr.length <= 10, "most recent 10 bumped theards");
            assert.isTrue(resArr[0].replies.length <= 3, "max 3 replies");
            done();
          });
      });
    });

    //     suite('PUT', function() {

    //     });

    suite("DELETE", function() {
            test('DELETE repli /api/replies/:board ',(done)=>{
                const date = new Date();
   chai
          .request(server)
          .post("/api/threads/test2")
          .send({
            text: "test",
            delete_password: "321654987",
            id: date.getTime().toString()
          })
      .end((err,res)=>{
        if(err){
          done()
        }
        
          chai
          .request(server)
          .post("/api/replies/test2")
          .send({
            text: "test",
            delete_password: "321654987",
            thread_id: date.getTime().toString(),
            _id:date.getTime().toString()
          })
          .end((err, res) => {
            chai
              .request(server)
              .delete("/api/replies/test2")
              .send({
                thread_id: date.getTime().toString(),
                delete_password: "jhkjjdhs"
              })
              .end((err, res) => {
                if (err) {
                  done();
                  return;
                }
                assert.equal(res.text, "incorrect password");
                done();
              });
          });
        
        
      })
              
              
            })
    });
  });
});
