import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

// in `/client` run `npm start` and open:
// http://localhost:3000/

const send = body => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.open("POST", "http://localhost:4000/graphql");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.onload = function() {
    console.log("response:", xhr.response);
  };
  xhr.send(body);
};

const queryPosts = () =>
  send(
    JSON.stringify({
      query: `{ 
        posts { 
          id, 
          title,
          author {
            firstName,
              lastName
          }
        } 
      }`
    })
  );

const queryAuthor = () =>
  send(
    JSON.stringify({
      query: `{
       author(id: 2) {
         id,
         firstName,
         lastName,
         posts(titleStarts: "Welcome") {
           id,
           title
         }
       } 
      }`
    })
  );

const upvotePost = () =>
  send(
    JSON.stringify({
      query: `mutation UpvotePost($postId: Int!) {
        upvotePost(postId: $postId) {
          post {
            id, 
            title,
            votes,
            author {
              firstName,
              lastName
            }
          },
          errors
        }
      }`,
      variables: {
        postId: 4
      }
    })
  );

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={queryPosts}>queryPosts</button>
        <button onClick={queryAuthor}>queryAuthor</button>
        <button onClick={upvotePost}>upvotePost</button>
      </div>
    );
  }
}

export default App;
