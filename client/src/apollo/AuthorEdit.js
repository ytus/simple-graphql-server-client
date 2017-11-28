import React, { Component } from "react";
import gql from "graphql-tag";

export class AuthorEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: [],
      author: {
        id: "",
        firstName: "",
        firstNameErrors: [],
        lastName: "",
        lastNameErrors: []
      }
    };
  }

  componentDidMount() {
    this.props.entityProvider
      .runQuery({
        query: AuthorEdit.queries.authorsQ,
        params: {}
      })
      .then(data => this.setState({ ...this.state, authors: data.authors }));
    this.props.entityProvider.watchQuery({
      query: AuthorEdit.queries.authorsQ,
      params: {},
      next: data => this.setState({ ...this.state, authors: data.authors })
    });
  }

  static queries = {
    authorsQ: gql`
      query Authors {
        authors {
          id
          firstName
          lastName
        }
      }
    `,
    authorQ: gql`
      query Author($id: Int!) {
        author(id: $id) {
          id
          firstName
          lastName
        }
      }
    `
  };

  static mutations = {
    changeAuthorM: gql`
      mutation ChangeAuthor($id: Int!, $firstName: String, $lastName: String) {
        changeAuthor(id: $id, firstName: $firstName, lastName: $lastName) {
          author {
            id
            firstName
            lastName
          }
          errors
        }
      }
    `
  };

  render() {
    // console.log("AuthorEdit.render()", this.props, this.state);
    return (
      <div>
        <h2>Edit author</h2>
        <form className="pure-form pure-form-aligned">
          <fieldset>
            <div className="pure-control-group">
              <label htmlFor="id">id</label>
              <select
                id="id"
                name="select"
                value={this.state.author.id}
                onChange={e => {
                  this.props.entityProvider
                    .runQuery({
                      query: AuthorEdit.queries.authorQ,
                      params: { id: e.target.value }
                    })
                    .then(data =>
                      this.setState({
                        ...this.state,
                        author: { ...this.state.author, ...data.author }
                      })
                    );
                }}
              >
                <option value={""} />
                {this.state.authors.map(a => (
                  <option value={a.id} key={a.id}>
                    {a.firstName} {a.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="pure-control-group">
              <label htmlFor="firstName">firstName</label>
              <input
                id="firstName"
                value={this.state.author.firstName}
                onChange={e =>
                  this.setState({
                    ...this.state,
                    author: { ...this.state.author, firstName: e.target.value }
                  })
                }
              />
              <span
                className="pure-form-message-inline"
                style={{ color: "red" }}
              >
                {this.state.author.firstNameErrors.join(", ")}
              </span>
            </div>

            <div className="pure-control-group">
              <label htmlFor="lastName">lastName</label>
              <input
                id="lastName"
                value={this.state.author.lastName}
                onChange={e =>
                  this.setState({
                    ...this.state,
                    author: { ...this.state.author, lastName: e.target.value }
                  })
                }
              />
            </div>

            <div className="pure-controls">
              <button
                className="pure-button pure-button-primary"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.props.entityProvider
                    .saveAuthor(AuthorEdit.mutations.changeAuthorM, {
                      id: this.state.author.id,
                      firstName: this.state.author.firstName,
                      lastName: this.state.author.lastName
                    })
                    .then(author => {
                      this.setState({
                        ...this.state,
                        author: { ...this.state.author, ...author }
                      });
                    });
                }}
              >
                save
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}
