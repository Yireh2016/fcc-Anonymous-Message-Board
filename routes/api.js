/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;

module.exports = function(app, db) {
  app
    .route("/api/threads/:board")
    .post((req, res) => {
      var { board } = req.params;
      var { text, delete_password, id } = req.body;

      let dbTest = db.db("fcc");
      const date = new Date();
      const data = {
        text,
        board,
        created_on: date,
        bumped_on: date,
        reported: false,
        replies: [],
        delete_password,
        _id: id ? id : date.getTime().toString()
      };
      dbTest.collection("msgBoard").insertOne(data, (err, doc) => {
        if (err) {
          console.error("error on post threads ", err);
          res.json({ error: "error on post threads" });
          return;
        }
        // res.send('ok')
        res.redirect("/b/" + board);
      });
    })

    .get((req, res) => {
      var board = req.params;
      let dbTest = db.db("fcc");
      dbTest
        .collection("msgBoard")
        .find({}, { reported: false, delete_password: false })
        .sort("bumped_on", -1)
        .limit(10)
        .toArray((err, docs) => {
          if (err) {
            res.json({ error: "error on post threads" });
            return;
          }

          res.json(docs);
        });
    })

    .delete((req, res) => {
      const { board } = req.params;
      const { thread_id, delete_password } = req.body;

      console.log("{ board }", { board });
      console.log("{ thread_id, delete_password } ", {
        thread_id,
        delete_password
      });

      let dbTest = db.db("fcc");
      dbTest
        .collection("msgBoard")
        .deleteOne({ _id: thread_id, delete_password }, (err, doc) => {
          if (err) {
            res.json({ error: "error on delete threads" });
            return;
          }
          console.log("deletedCount", doc.deletedCount);
          if (doc.deletedCount > 0) {
            //borro
            res.send("success");
            return;
          }
          //no borro nada
          res.send("incorrect password");
        });
    });

  app
    .route("/api/replies/:board")
    .post((req, res) => {
      var { board } = req.params;
      var { text, delete_password, thread_id, reply_id } = req.body;
      const bumped_on = new Date();
      const repliesObj = {
        thread_id: thread_id,
        _id: reply_id ? reply_id : bumped_on.getTime().toString(),
        text,
        created_on: bumped_on,
        delete_password,
        reported: true
      };

      let dbTest = db.db("fcc");
      dbTest
        .collection("msgBoard")
        .updateOne(
          { _id: thread_id },
          { $set: { bumped_on }, $push: { replies: repliesObj } },
          (err, docs) => {
            if (err) {
              console.error("error on post replies", err);
              res.json({ error: "error on post replies" });
              return;
            }
            // res.send('ok')
            if (docs.modifiedCount > 0) {
              res.redirect("/b/" + board + "/" + thread_id);
            }
          }
        );
    })

    .get((req, res) => {
      var board = req.params;
      var { thread_id } = req.query;

      let dbTest = db.db("fcc");
      dbTest
        .collection("msgBoard")
        .find({ _id: thread_id }, { reported: false, delete_password: false })
        .toArray((err, docs) => {
          if (err) {
            res.json({ error: "error on post threads" });
            return;
          }
          console.log("docs", docs);
          res.json(docs);
        });
    })
  
   .delete((req, res) => {
      const { board } = req.params;
      const { thread_id, delete_password ,reply_id} = req.body;

      console.log("{ board }", { board });
      console.log("{ thread_id, delete_password } ", {
        thread_id,
        delete_password
      });

      let dbTest = db.db("fcc");
      dbTest
        .collection("msgBoard")
        .update({ _id: thread_id, delete_password }, (err, doc) => {
          if (err) {
            res.json({ error: "error on delete threads" });
            return;
          }
          console.log("deletedCount", doc.deletedCount);
          if (doc.deletedCount > 0) {
            //borro
            res.send("success");
            return;
          }
          //no borro nada
          res.send("incorrect password");
        });
    });
;
};
