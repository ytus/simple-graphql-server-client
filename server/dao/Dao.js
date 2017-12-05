export const createDao = (db, knex) => {
  db.on("trace", sql => console.log("sqlite: ", sql));

  const sqlToPromise = (dbFun, sql, params) => {
    return new Promise((res, rej) => {
      dbFun(sql, params, (err, row) => {
        if (err != null) {
          console.error(err);
          rej(err);
          return;
        }
        console.log("sqlite3: returns ", row);
        res(row);
      });
    });
  };

  const allToPromise = (sql, params) => {
    return sqlToPromise(db.all.bind(db), sql, params);
  };

  const getToPromise = (sql, params) => {
    return sqlToPromise(db.get.bind(db), sql, params);
  };

  const updateToPromise = (sql, params) => {
    return sqlToPromise(db.run.bind(db), sql, params);
  };

  const addCondition = (query, conditions) => {
    return conditions.reduce(
      (q, c) => q.andWhere(c.field, c.op, c.value),
      query
    );
  } ;

  const dao = {
    allAddressBooks(conditions = [], orderBy = []) {
      console.log("dao.allAddressBooks()", conditions);
      let query = knex.select("*").from("address_book");
      query = addCondition(query, conditions);
      return allToPromise(query.toString());
    },
    addressBookById(id) {
      console.log("dao.addressBookById()", id);
      return getToPromise("SELECT * FROM address_book WHERE id = ?;", [id]);
    },

    allPriceLists(conditions = [], orderBy = []) {
      console.log("dao.allPriceLists()", conditions);
      let query = knex.select("*").from("price_list");
      query = addCondition(query, conditions);
      return allToPromise(query.toString());
    },
    priceListById(id) {
      console.log("dao.priceListsById()", id);
      return getToPromise("SELECT * FROM price_list WHERE id = ?;", [id]);
    },

    allInvoiceItems(conditions = [], orderBy = []) {
      console.log("dao.allInvoiceItems()");
      let query = knex.select("*").from("invoice_item");
      query = addCondition(query, conditions);
      return allToPromise(query.toString());
    },
    invoiceItemById(id) {
      console.log("dao.addressBookById()", id);
      return getToPromise("SELECT * FROM invoice_item WHERE id = ?;", [id]);
    },

    allInvoices(conditions = [], orderBy = []) {
      console.log("dao.allInvoices()", conditions, orderBy);
      let query = knex.select("*").from("invoice");
      query = addCondition(query, conditions);
      return allToPromise(query.toString());
    },
    invoiceById(id) {
      console.log("dao.invoiceById()", id);
      return getToPromise("SELECT * FROM invoice WHERE id = ?;", [id]);
    }
  };

  return dao;
};
