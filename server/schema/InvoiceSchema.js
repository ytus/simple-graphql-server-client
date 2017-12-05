import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} from "graphql";

const addressBookType = new GraphQLObjectType({
  name: "AddressBook",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    code: { type: GraphQLString },
    vatId: { type: GraphQLString },
    invoices: {
      type: new GraphQLList(invoiceType),
      args: {}, // TODO connection, filter, order, ...
      resolve: (addressBook, args, context) => {
        return context.dao.allInvoices([
          {
            field: "companyId",
            op: "=",
            value: addressBook.id
          }
        ]);
      }
    }
  })
});

const priceListType = new GraphQLObjectType({
  name: "PriceList",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    unitPrice: { type: new GraphQLNonNull(GraphQLInt) } // TODO Float?
  })
});

const invoiceItemType = new GraphQLObjectType({
  name: "InvoiceItem",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    sum: { type: new GraphQLNonNull(GraphQLInt) },
    unitQuantity: { type: GraphQLInt },
    priceList: {
      type: priceListType,
      resolve: (invoiceItem, args, context) => {
        console.log("invoiceItemType.priceList.resolve");
        return context.dataLoaders.singlePriceListLoader.load(
          invoiceItem.priceListId
        );
      }
    },
    invoice: {
      type: invoiceType,
      resolve: (invoiceItem, args, context) => {
        return context.dao.invoiceById(invoiceItem.invoiceId);
      }
    }
  })
});

const invoiceType = new GraphQLObjectType({
  name: "Invoice",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    issueDate: { type: GraphQLString }, // TODO Date
    sumTotal: { type: GraphQLInt },
    company: {
      type: addressBookType,
      resolve: (invoice, args, context) => {
        return context.dataLoaders.singleAddressBookLoader.load(
          invoice.companyId
        );
      }
    },
    items: {
      type: new GraphQLList(invoiceItemType),
      resolve: (invoice, args, context) => {
        return context.dataLoaders.invoiceItemsLoader.load(invoice.id);
      }
    }
  })
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    addressBooks: {
      // TODO connection
      type: new GraphQLList(addressBookType),
      args: {
        // TODO filter?
      },
      resolve: (root, args, context) => {
        return context.dao.allAddressBooks();
      }
    },
    addressBook: {
      type: addressBookType,
      args: {
        // TODO filter?
        id: {
          description: "id of address book",
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, args, context) => {
        return context.dao.addressBookById(id);
      }
    },
    invoices: {
      type: new GraphQLList(invoiceType),
      args: {
        // TODO filter?
      },
      resolve: function(root, args, context) {
        return context.dao.allInvoices();
      }
    },
    invoice: {
      type: invoiceType,
      args: {
        id: {
          description: "id of invoice",
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, args, context) => {
        return context.dao.invoiceById(id);
      }
    },
    invoiceItems: {
      type: new GraphQLList(invoiceItemType),
      args: {
        // TODO filter?
      },
      resolve: function(root, args, context) {
        return context.dao.allInvoiceItems();
      }
    },
    invoiceItem: {
      type: invoiceItemType,
      args: {
        id: {
          description: "id of invoice item",
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, args, context) => {
        return context.dao.invoiceItemById(id);
      }
    },
    priceLists: {
      type: new GraphQLList(priceListType),
      args: {
        // TODO filter?
      },
      resolve: function(root, args, context) {
        return context.dao.allPriceLists();
      }
    },
    priceList: {
      type: priceListType,
      args: {
        id: {
          description: "id of price list",
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, args, context) => {
        return context.dao.priceListById(id);
      }
    }
  }
});

// const changeAuthorResultType = new GraphQLObjectType({
//   name: "ChangeAuthorResultType",
//   fields: () => ({
//     author: {
//       type: authorType
//     },
//     errors: {
//       type: new GraphQLList(GraphQLString)
//     }
//   })
// });
//
const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    //     changeAuthor: {
    //       type: changeAuthorResultType,
    //       args: {
    //         id: { type: GraphQLInt },
    //         firstName: { type: GraphQLString },
    //         lastName: { type: GraphQLString }
    //       },
    //       resolve: (root, args, context) => {
    //         return context.dao.changeAuthor(
    //           context.loaders,
    //           args.id,
    //           args.firstName,
    //           args.lastName
    //         );
    //       }
    //     }
  })
});

export const schema = new GraphQLSchema({
  query: queryType
  // mutation: mutationType
});
