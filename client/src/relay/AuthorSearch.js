import React, { Component } from "react";
import Relay from 'react-relay';

const renderAuthor = authorsAndPosts => {
  if (authorsAndPosts == null || authorsAndPosts.length === 0) {
    return (
      <table className="pure-table">
        <tbody>
          <tr>
            <td />
            <td />
            <td />
            <td />
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <table className="pure-table">
      <tbody>
        {authorsAndPosts.map(author => {
          return (
            <tr key={author.id}>
              <td>id: {author.id}</td>
              <td>{author.firstName}</td>
              <td>{author.lastName}</td>
              <td>
                <table className="pure-table">
                  <tbody>
                    {author.posts.map(post => {
                      return (
                        <tr key={post.id}>
                          <td>id: {post.id}</td>
                          <td>{post.title}</td>
                          <td>votes: {post.votes}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export class AuthorSearch extends Component {
  constructor(props) {
    super(props);
    this.watchAuthorsSubscription = null;
    this.state = {
      authorsPosts: []
    };
  }

  componentDidMount() {}

  queries = {
    authorsPostsQ: {
      query: Relay.QL`
        query AuthorsPosts($id: Int, $titleStarts: String) {
          authors(id: $id) {
            id
            firstName
            lastName
            posts(titleStarts: $titleStarts) {
              id
              title
              votes
            }
          }
        }
      `,
      handleData: data => {
        this.setState({
          ...this.state,
          authorsPosts: data.authors
        });
      }
    }
  };

  render() {
    // console.log("AuthorSearch.render()", this.props, this.state);
    return (
      <div>
        <h2>Search</h2>
        <form className="pure-form pure-form-aligned">
          <fieldset>
            <div className="pure-control-group">
              <label htmlFor="id">id</label>
              <input
                id="id"
                value={this.state.authorId}
                onChange={e =>
                  this.setState({ ...this.state, authorId: e.target.value })
                }
              />
            </div>

            <div className="pure-control-group">
              <label htmlFor="startsWith">posts starts</label>
              <input
                id="startsWith"
                value={this.state.titleStarts}
                onChange={e =>
                  this.setState({ ...this.state, titleStarts: e.target.value })
                }
              />
            </div>

            <div className="pure-controls">
              <button
                className="pure-button pure-button-primary"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();

                  // if (this.watchAuthorsSubscription != null) {
                  //   this.watchAuthorsSubscription.unsubscribe();
                  // }
                  this.props.entityProvider
                    .runQuery({
                      query: this.queries.authorsPostsQ.query,
                      params: {
                        id: this.state.authorId,
                        titleStarts: this.state.titleStarts
                      }
                    })
                    .then(this.queries.authorsPostsQ.handleData);

                  // this.watchAuthorsSubscription = this.props.entityProvider.watchQuery(
                  //   {
                  //     query: this.queries.authorsPostsQ.query,
                  //     params: {
                  //       id: this.state.authorId,
                  //       titleStarts: this.state.titleStarts
                  //     },
                  //     next: this.queries.authorsPostsQ.handleData
                  //   }
                  // );
                }}
              >
                query author
              </button>
            </div>
          </fieldset>
        </form>
        <h3>Result</h3>
        {renderAuthor(this.state.authorsPosts)}
      </div>
    );
  }
}
