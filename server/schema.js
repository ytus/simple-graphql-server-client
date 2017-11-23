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
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (author, args, context) => {
        return context.dao.getPosts(author.id, args.titleStarts);
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
        return context.dao.getAuthor(post.author);
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

const upvoteResultType = new GraphQLObjectType({
  name: "UpvoteResultType",
  fields: () => ({
    post: {
      type: postType
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
    upvotePost: {
      type: upvoteResultType, // return type of the mutation
      args: { postId: { type: GraphQLInt } },
      resolve: (root, args, context) => {
        return context.dao.upvotePost(args.postId);
      }
    }
  })
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
