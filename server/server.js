import express from "express";
import graphqlHTTP from "express-graphql";
import cors from "cors";

import { initDB } from "./db/db.js";
import { schema } from "./schema.js";

const db = initDB();

const sqlToPromise = (dbFun, sql, params) => {
  return new Promise((res, rej) => {
    dbFun(sql, params, (err, row) => {
      if (err != null) {
        console.error(err);
        rej(err);
        return;
      }
      console.log("->", row);
      res(row);
    });
  });
};

const allToPromise = (sql, params) => {
  return sqlToPromise(db.all.bind(db), sql, params);
};

const getToPromise = (sql, params) => {
  return sqlToPromise(db.get.bind(db), sql, params);
};

const updateToPromise = (sql, params) => {
  return sqlToPromise(db.run.bind(db), sql, params);
};

const dao = {
  getPost(postId) {
    console.log("dao.getPost", postId);
    return allToPromise("SELECT * FROM posts WHERE id = ?;", [postId]);
  },
  getAllPosts() {
    console.log("dao.getAllPosts");
    return allToPromise("SELECT * FROM posts", []);
  },
  getPosts(authorId, titleStarts) {
    console.log("dao.getPosts", authorId, titleStarts);
    if (authorId == null && titleStarts == null) {
      return this.getAllPosts();
    }
    if (authorId != null && titleStarts == null) {
      return allToPromise("SELECT * FROM posts WHERE author = ?;", [authorId]);
    }
    if (authorId == null && titleStarts != null) {
      return allToPromise("SELECT * FROM posts WHERE title BEGINS ?;", [
        titleStarts
      ]);
    }

    return allToPromise(
      "SELECT * FROM posts WHERE author = ? AND title BEGINS ?;",
      [authorId, titleStarts]
    );
  },
  getAuthor(authorId) {
    console.log("dao.getAuthor", authorId);
    return getToPromise("SELECT * FROM authors WHERE id = ?;", [authorId]);
  },
  getAllAuthors() {
    console.log("dao.getAllAuthors");
    return allToPromise("SELECT * FROM authors", []);
  },
  getAuthors(authorId, titleStarts) {
    console.log("dao.getAuthors", authorId, titleStarts);
    if (authorId == null && titleStarts == null) {
      return this.getAllAuthors();
    }

    return allToPromise("SELECT * FROM authors WHERE id = ?;", [authorId]);
  },
  changeAuthor(id, firstName, lastName) {
    console.log("dao.changeAuthor", id, firstName, lastName);
    return updateToPromise(
      "UPDATE authors SET firstName = ?, lastName = ? WHERE id = ?;",
      [firstName, lastName, id]
    )
      .then(_ => this.getAuthor(id))
      .then(author => ({
        author,
        errors: []
      }))
      .catch(err => ({
        post: null,
        errors: [err]
      }));
  }
};

const app = express();

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    context: {
      dao
    },
    rootValue: root,
    graphiql: true
  })
);

app.listen(4000);

console.log("server started");
