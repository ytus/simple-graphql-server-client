import React, { Component } from "react";
import "../pure-min.css";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import { AuthorEdit } from "./AuthorEdit.js";
import { AuthorSearch } from "./AuthorSearch.js";

// in `/client` run `npm start` and open:
// http://localhost:3000/

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
  cache: new InMemoryCache(),
  connectToDevTools: true
});

const bl = {};

const entityProvider = {
  runQuery({ query, params }) {
    return client
      .query({
        query,
        variables: params
      })
      .then(result => result.data);
  },
  // EntityChangedEvent?
  watchQuery({ query, params, next }) {
    const observableQuery = client.watchQuery({
      query,
      variables: params
    });

    const subscription = observableQuery.subscribe({
      next: result => {
        console.log("subscription result", result);
        next(result.data);
      }
    });

    return subscription;
  },
  runMutation({ mutation, params }) {
    return client.mutate({ mutation, variables: params }).then(result => {
      console.log("mutation result", result);
      return result => result.data;
    });
  }
};

const authorBL = {
  ...bl,
  validateAuthor(author) {
    if (author.firstName == null || author.firstName === "") {
      return {
        firstNameErrors: ["firstName is empty"]
      };
    }

    return author;
  },
  hasErrors(author) {
    return author.firstNameErrors && author.firstNameErrors.length > 0;
  }
};

const authorEntityProvider = {
  ...entityProvider,
  // TODO ?
  // loadAuthor() {
  //
  //},
  saveAuthor(mutation, author) {
    const validatedAuthor = authorBL.validateAuthor(author);
    if (authorBL.hasErrors(validatedAuthor)) {
      return Promise.resolve(validatedAuthor);
    }

    return this.runMutation({
      mutation,
      params: {
        id: author.id,
        firstName: author.firstName,
        lastName: author.lastName
      }
    });
  }
};

export class App extends Component {
  render() {
    return (
      <div>
        <AuthorSearch entityProvider={entityProvider} />
        <AuthorEdit entityProvider={authorEntityProvider} />
      </div>
    );
  }
}
