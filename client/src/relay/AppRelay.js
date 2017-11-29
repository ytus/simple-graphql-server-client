import React, { Component } from "react";
import "../pure-min.css";

import Relay from "react-relay";
import { Environment, Network, RecordSource, Store } from "relay-runtime";

// import { AuthorEdit } from "./AuthorEdit.js";
import { AuthorSearch } from "./AuthorSearch.js";


// https://facebook.github.io/relay/docs/network-layer.html
function fetchQuery(
  operation,
  variables,
  cacheConfig,
  uploadables,
) {
  return fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      // Add authentication and other headers here
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  }).then(response => {
    return response.json();
  });
}

const source = new RecordSource();
const store = new Store(source);
const network = Network.create(fetchQuery);
const handlerProvider = null;

const environment = new Environment({
  handlerProvider, // Can omit.
  network,
  store
});

// const client = new ApolloClient({
//   link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
//   cache: new InMemoryCache(),
//   connectToDevTools: true
// });

const bl = {};

class LikeStoryMutation extends Relay.Mutation {
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        story: this.props.story.id,
      },
    }];
  }
}

const entityProvider = {
  runQuery({ query, params }) {
    // var onSuccess = () => {
    //   console.log('Mutation successful!');
    // };
    // var onFailure = (transaction) => {
    //   var error = transaction.getError() || new Error('Mutation failed.');
    //   console.error(error);
    // };
    // class Mutation extends Relay.Mutation {
    //
    // }
    // var mutation = new MyMutation({...});
    //
    // Relay.Store.commitUpdate(mutation, {onFailure, onSuccess});
  },
  watchQuery({ query, params, next }) {
    // const observableQuery = client.watchQuery({
    //   query,
    //   variables: params
    // });
    //
    // const subscription = observableQuery.subscribe({
    //   next: result => {
    //     console.log("subscription result", result);
    //     next(result.data);
    //   }
    // });
    //
    // return subscription;
  },
  runMutation({ mutation, params }) {
    // return client.mutate({ mutation, variables: params }).then(result => {
    //   console.log("mutation result", result);
    //   return result => result.data;
    // });
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
        {/*<AuthorEdit entityProvider={authorEntityProvider} />*/}
      </div>
    );
  }
}
