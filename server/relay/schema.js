import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  buildSchema
} from "graphql";

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions
} from "graphql-relay";

const { nodeInterface, nodeField } = nodeDefinitions(
  globalId => {
    var { type, id } = fromGlobalId(globalId);
    if (type === "User") {
      return getUser(id);
    } else if (type === "Widget") {
      return getWidget(id);
    } else {
      return null;
    }
  },
  obj => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Widget) {
      return widgetType;
    } else {
      return null;
    }
  }
);

const { connectionType: postConnection } = connectionDefinitions({
  name: "Post",
  nodeType: postType
});

const authorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLInt },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    posts: {
      // type: new GraphQLList(postType),
      type: postConnection,
      args: {
        titleStarts: {
          description: "beginning of the title",
          type: GraphQLString
        }
      },
      resolve: (author, args, context) => {
        // return context.dao.getPosts(author.id, args.titleStarts);
        return connectionFromArray(
          context.dao.getPosts(author.id, args.titleStarts),
          args
        );
      }
    }
  }),
  interfaces: [nodeInterface]
});

const postType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    votes: { type: GraphQLInt },
    author: {
      type: authorType,
      resolve: (post, args, context) => {
        return context.dao.getAuthor(post.author);
      }
    }
  }),
  interfaces: [nodeInterface]
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    posts: {
      type: new GraphQLList(postType),
      args: {},
      resolve: function(root, args, context) {
        return context.dao.getAllPosts();
      }
    },
    author: {
      type: authorType,
      args: {
        id: {
          description: "id of author",
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve: (root, args, context) => {
        return context.dao.getAuthor(args.id);
      }
    },
    authors: {
      type: new GraphQLList(authorType),
      args: {
        id: {
          description: "id of author",
          type: GraphQLInt
        },
        titleStarts: {
          description: "beginning of the title",
          type: GraphQLString
        }
      },
      resolve: (root, args, context) => {
        return context.dao.getAuthors(args.id, args.titleStarts);
      }
    },
    post: {
      type: postType,
      args: {
        id: {
          description: "id of post",
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve: (root, args, context) => {
        return context.dao.getPost(args.id);
      }
    }
  }
});

const changeAuthorResultType = new GraphQLObjectType({
  name: "ChangeAuthorResultType",
  fields: () => ({
    author: {
      type: authorType
    },
    errors: {
      type: new GraphQLList(GraphQLString)
    }
  })
});

const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    // each field is mutation
    changeAuthor: {
      type: changeAuthorResultType,
      args: {
        id: { type: GraphQLInt },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString }
      },
      resolve: (root, args, context) => {
        return context.dao.changeAuthor(args.id, args.firstName, args.lastName);
      }
    }
  })
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
