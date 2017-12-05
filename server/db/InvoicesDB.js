import sqlite3 from "sqlite3";
import { default as createKnex } from "knex";

export const connectDB = () => {
  sqlite3.verbose();

  const db = new sqlite3.Database(":memory:", err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("sqlite: Connected to the in-memory database.");
  });

  process.on("SIGINT", () => {
    console.log("Ctrl+C");

    db.close(err => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Database connection closed.");
    });
  });

  return db;
};

const addressBookData = [
  { $id: "1", $name: "Apple", $code: "AAPL", $vatId: "" },
  { $id: "2", $name: "Google", $code: "GOOG", $vatId: "" },
  { $id: "3", $name: "Facebok", $code: "FB", $vatId: "" },
  { $id: "4", $name: "Netflix", $code: "NFLX", $vatId: "" },
  { $id: "5", $name: "Tesla", $code: "TSLA", $vatId: "" }
];

const priceListData = [
  { $id: "1", $name: "man-hour", $unitPrice: "100" },
  { $id: "2", $name: "man-day", $unitPrice: "600" },
  { $id: "3", $name: "man-week", $unitPrice: "2000" },
  { $id: "4", $name: "man-month", $unitPrice: "7000" }
];

const invoiceItemData = [
  { $id: "1", $sum: 100, $unitQuantity: 1, $priceListId: "1", $invoiceId: "1" },
  { $id: "2", $sum: 1200, $unitQuantity: 2, $priceListId: "2", $invoiceId: "2" },
  { $id: "3", $sum: 6000, $unitQuantity: 3, $priceListId: "3", $invoiceId: "3" },
  { $id: "4", $sum: 28000, $unitQuantity: 4, $priceListId: "4", $invoiceId: "3" }
];

const invoiceData = [
  { $id: "1", $issueDate: "2017-12-01", $sumTotal: 100, $companyId: "1" },
  { $id: "2", $issueDate: "2017-12-02", $sumTotal: 1200, $companyId: "2" },
  { $id: "3", $issueDate: "2017-12-03", $sumTotal: 34000, $companyId: "3" }
];

export const initTestDB = db => {
  // https://github.com/mapbox/node-sqlite3/wiki/API

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS address_book (
      id TEXT NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT,
      vatId TEXT 
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS price_list (
      id TEXT NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      unitPrice INTEGER NOT NULL
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS invoice (
      id TEXT NOT NULL PRIMARY KEY,
      issueDate TEXT NOT NULL,
      sumTotal INTEGER NOT NULL,
      companyId TEXT NOT NULL,
      FOREIGN KEY (companyId) REFERENCES address_book(id)
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS invoice_item (
      id TEXT NOT NULL PRIMARY KEY,
      sum INTEGER NOT NULL,
      unitQuantity INTEGER,
      priceListId TEXT NOT NULL,
      invoiceId TEXT NOT NULL,
      FOREIGN KEY (priceListId) REFERENCES price_list(id),
      FOREIGN KEY (invoiceId) REFERENCES invoice(id)
    );`);

    function logInsertCallback(table) {
      return function(err, res) {
        if (err) {
          console.log(table, err.message);
          return;
        }
        console.log(`sqlite: new row in ${table}, id: ${this.lastID}`);
      };
    }

    const insertIntoAddressBook = db.prepare(
      `INSERT INTO address_book(id, name, code, vatId) VALUES($id, $name, $code, $vatId);`
    );
    addressBookData.forEach(i =>
      insertIntoAddressBook.run(i, logInsertCallback("address_book"))
    );

    const insertIntoPriceList = db.prepare(
      `INSERT INTO price_list(id, name, unitPrice) VALUES($id, $name, $unitPrice);`
    );
    priceListData.forEach(i =>
      insertIntoPriceList.run(i, logInsertCallback("price_list"))
    );

    const insertIntoInvoice = db.prepare(
      `INSERT INTO invoice(id, issueDate, sumTotal, companyId) VALUES($id, $issueDate, $sumTotal, $companyId);`
    );
    invoiceData.forEach(i =>
      insertIntoInvoice.run(i, logInsertCallback("invoice"))
    );

    const insertIntoInvoiceItem = db.prepare(
      `INSERT INTO invoice_item(id, sum, unitQuantity, priceListId, invoiceId) VALUES($id, $sum, $unitQuantity, $priceListId, $invoiceId);`
    );
    invoiceItemData.forEach(i =>
      insertIntoInvoiceItem.run(i, logInsertCallback("invoice_item"))
    );
  });
};

export const initKnex = () => {
  return createKnex({
    client: "sqlite3"
  });
};
