import express from "express";
import graphqlHTTP from "express-graphql";
import cors from "cors";
import DataLoader from "dataloader";

import { initDB } from "./db/db.js";
import { schema } from "./schema.js";

const db = initDB();
db.on("trace", sql => console.log(sql));

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
  getPost(loaders, postId) {
    console.log("dao.getPost", postId);
    return allToPromise("SELECT * FROM posts WHERE id = ?;", [postId]);
  },
  getAllPosts(loaders) {
    console.log("dao.getAllPosts");
    return allToPromise("SELECT * FROM posts", []);
  },
  getPosts(loaders, authorId, titleStarts) {
    console.log("dao.getPosts", authorId, titleStarts);
    return loaders.postForAuthorsLoader.load(authorId);
  },
  getAuthor(loaders, authorId) {
    console.log("dao.getAuthor", authorId);
    return getToPromise("SELECT * FROM authors WHERE id = ?;", [authorId]);
  },
  getAllAuthors(loaders) {
    console.log("dao.getAllAuthors");
    return allToPromise("SELECT * FROM authors", []);
  },
  getAuthors(loaders, authorId, titleStarts) {
    console.log("dao.getAuthors", authorId, titleStarts);
    if (authorId == null && titleStarts == null) {
      return this.getAllAuthors();
    }

    return allToPromise("SELECT * FROM authors WHERE id = ?;", [authorId]);
  },
  changeAuthor(loaders, id, firstName, lastName) {
    console.log("dao.changeAuthor", id, firstName, lastName);
    return updateToPromise(
      "UPDATE authors SET firstName = ?, lastName = ? WHERE id = ?;",
      [firstName, lastName, id]
    )
      .then(_ => this.getAuthor(loaders, id))
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

// fuser -k 4000/tcp

const app = express();

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    context: {
      dao,
      loaders: {
        postForAuthorsLoader: new DataLoader(authorIds => {
          console.log("postForAuthorsLoader", authorIds);
          return allToPromise(
            `SELECT * FROM posts WHERE author IN (${authorIds
              .map(id => "?")
              .join(", ")});`,
            authorIds
          ).then(posts => {
            return authorIds.map(id => {
              return posts.filter(p => p.author === id);
            });
          });
        })
      }
    },
    formatResponse: resp => {
      console.log("formatResponse", resp);
    },
    rootValue: root,
    graphiql: true
  })
);

app.listen(4000);

console.log("server started");
