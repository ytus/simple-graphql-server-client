// import sqlite3 from "sqlite3";
//
// sqlite3.verbose();
//
// export const initDB = () => {
//   // open database in memory
//   const db = new sqlite3.Database(":memory:", err => {
//     if (err) {
//       return console.error(err.message);
//     }
//     console.log("Connected to the in-memory SQlite database.");
//   });
//
//   db.serialize(() => {
//     db.run(`CREATE TABLE IF NOT EXISTS authors (
//       id integer PRIMARY KEY,
//       firstName text NOT NULL,
//       lastName text NOT NULL
//     );`);
//
//     db.run(`CREATE TABLE IF NOT EXISTS posts (
//       id integer PRIMARY KEY,
//       author integer NOT NULL,
//       title text NOT NULL,
//       votes integer,
//       FOREIGN KEY (author) REFERENCES authors(id)
//     );`);
//
//     const logInsertCallback = table => (err, res) => {
//       if (err) {
//         return console.log(table, err.message);
//       }
//       console.log(`New row in ${table}, id ${res}`);
//     };
//
//     const insertAuthor = db.prepare(
//       `INSERT INTO authors(id, firstName, lastName) VALUES(?, ?, ?)`
//     );
//     insertAuthor.run([1, "Tom", "Coleman"], logInsertCallback("authors"));
//     insertAuthor.run([2, "Sashko", "Stubailo"], logInsertCallback("authors"));
//     insertAuthor.run([3, "Mikhail", "Novikov"], logInsertCallback("authors"));
//
//     const insertPost = db.prepare(
//       `INSERT INTO posts(id, title, votes, author) VALUES(?, ?, ?, ?)`
//     );
//     insertPost.run(
//       [1, "Introduction to GraphQL", 2, 1],
//       logInsertCallback("posts")
//     );
//     insertPost.run([2, "Welcome to Meteor", 3, 2], logInsertCallback("posts"));
//     insertPost.run([3, "Advanced GraphQL", 1, 2], logInsertCallback("posts"));
//     insertPost.run([4, "Launchpad is Cool", 7, 3], logInsertCallback("posts"));
//   });
//
//   process.on("SIGINT", () => {
//     console.log("Ctrl+C");
//
//     // close the database connection
//     db.close(err => {
//       if (err) {
//         return console.error(err.message);
//       }
//       console.log("Close the database connection.");
//     });
//   });
//
//   return db;
// };
