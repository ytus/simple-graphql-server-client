import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  buildSchema
} from "graphql";

const authorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLInt },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    posts: {
      type: new GraphQLList(postType),
      args: {
        titleStarts: {
          description: "beginning of the title",
          type: GraphQLString
        }
      },
      resolve: (author, args, context) => {
        return context.dao.getPosts(
          context.loaders,
          author.id,
          args.titleStarts
        );
      }
    }
  })
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
        return context.dao.getAuthor(context.loaders, post.author);
      }
    }
  })
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    posts: {
      type: new GraphQLList(postType),
      args: {},
      resolve: function(root, args, context) {
        return context.dao.getAllPosts(context.loaders);
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
        return context.dao.getAuthor(context.loaders, args.id);
      }
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
      return context.dao.getAuthors(context.loaders, args.id, args.titleStarts);
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
      return context.dao.getPost(context.loaders, args.id);
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
    changeAuthor: {
      type: changeAuthorResultType,
      args: {
        id: { type: GraphQLInt },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString }
      },
      resolve: (root, args, context) => {
        return context.dao.changeAuthor(
          context.loaders,
          args.id,
          args.firstName,
          args.lastName
        );
      }
    }
  })
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
