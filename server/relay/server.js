import express from "express";
import graphqlHTTP from "express-graphql";
import cors from "cors";

import { schema } from "../apollo/schema.js";

// in `/server` run `npm start` and open GraphiQL:
// http://localhost:4000/graphql?query=%23%20Welcome%20to%20GraphiQL%0A%23%0A%23%20GraphiQL%20is%20an%20in-browser%20tool%20for%20writing%2C%20validating%2C%20and%0A%23%20testing%20GraphQL%20queries.%0A%23%0A%23%20Type%20queries%20into%20this%20side%20of%20the%20screen%2C%20and%20you%20will%20see%20intelligent%0A%23%20typeaheads%20aware%20of%20the%20current%20GraphQL%20type%20schema%20and%20live%20syntax%20and%0A%23%20validation%20errors%20highlighted%20within%20the%20text.%0A%23%0A%23%20GraphQL%20queries%20typically%20start%20with%20a%20%22%7B%22%20character.%20Lines%20that%20starts%0A%23%20with%20a%20%23%20are%20ignored.%0A%23%0A%23%20An%20example%20GraphQL%20query%20might%20look%20like%3A%0A%23%0A%23%20%20%20%20%20%7B%0A%23%20%20%20%20%20%20%20field(arg%3A%20%22value%22)%20%7B%0A%23%20%20%20%20%20%20%20%20%20subField%0A%23%20%20%20%20%20%20%20%7D%0A%23%20%20%20%20%20%7D%0A%23%0A%23%20Keyboard%20shortcuts%3A%0A%23%0A%23%20%20%20%20%20%20%20Run%20Query%3A%20%20Ctrl-Enter%20(or%20press%20the%20play%20button%20above)%0A%23%0A%23%20%20%20Auto%20Complete%3A%20%20Ctrl-Space%20(or%20just%20start%20typing)%0A%0A%0A%0A%23%20%7B%20posts%20%7B%20id%2C%20title%20%7D%7D%0A%0A%0A%0A%23%20%7B%20posts%20%7B%20id%2C%20title%2C%20author%20%7B%20firstName%2C%20lastName%20%7D%7D%20%7D%0A%0A%0A%0A%23%20%7B%20%0A%23%20%20%20author(id%3A%202)%20%7B%0A%23%20%20%20%20%20id%2C%0A%23%20%20%20%20%20firstName%2C%0A%23%20%20%20%20%20lastName%2C%0A%23%20%20%20%20%20posts(titleStarts%3A%20%22Welcome%22)%20%7B%0A%23%20%20%20%20%20%20%20id%2C%0A%23%20%20%20%20%20%20%20title%0A%23%20%20%20%20%20%7D%0A%23%20%20%20%7D%20%0A%23%20%7D%0A%0A%0Amutation%20%7B%0A%20%20upvotePost(postId%3A%207)%20%7B%0A%20%20%20%20post%20%7B%0A%20%20%20%20%20%20id%2C%0A%20%20%20%20%20%20title%2C%0A%20%20%20%20%20%20votes%0A%20%20%20%20%7D%2C%0A%20%20%20%20errors%0A%20%20%7D%0A%7D

// data
const authors = [
  { id: 1, firstName: "Tom", lastName: "Coleman" },
  { id: 2, firstName: "Sashko", lastName: "Stubailo" },
  { id: 3, firstName: "Mikhail", lastName: "Novikov" }
];
const posts = [
  { id: 1, author: 1, title: "Introduction to GraphQL", votes: 2 },
  { id: 2, author: 2, title: "Welcome to Meteor", votes: 3 },
  { id: 3, author: 2, title: "Advanced GraphQL", votes: 1 },
  { id: 4, author: 3, title: "Launchpad is Cool", votes: 7 }
];

const dao = {
  getPost(postId) {
    console.log("dao.getPost", postId);
    return posts.find(p => p.id === postId);
  },
  getAllPosts() {
    console.log("dao.getAllPosts");
    return posts;
  },
  getPosts(authorId, titleStarts) {
    console.log("dao.getPosts", authorId, titleStarts);
    return posts.filter(p => {
      if (authorId != null && p.author !== authorId) {
        return false;
      }
      if (titleStarts != null && !p.title.startsWith(titleStarts)) {
        return false;
      }
      return true;
    });
  },
  getAuthor(authorId) {
    console.log("dao.getAuthor", authorId);
    return authors.find(a => a.id === authorId);
  },
  getAllAuthors() {
    console.log("dao.getAllAuthors");
    return authors;
  },
  getAuthors(authorId, titleStarts) {
    console.log("dao.getAuthors", authorId, titleStarts);
    return authors.filter(a => {
      if (authorId != null && a.id !== authorId) {
        return false;
      }
      return true;
    });
  },
  changeAuthor(id, firstName, lastName) {
    console.log("dao.changeAuthor", id, firstName, lastName);
    const author = this.getAuthor(id);
    if (author == null) {
      return {
        post: null,
        errors: [`Couldn't find author with id ${postId}`]
      };
    }

    author.firstName = firstName;
    author.lastName = lastName;
    return {
      author,
      errors: []
    };
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
