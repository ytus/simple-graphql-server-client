import { connectDB, initTestDB, initKnex } from "./db/InvoicesDB.js";
import { createDao } from "./dao/Dao.js";
import { createDataLoaders } from "./dao/DataLoaders.js";
import { startServer } from "./Server.js";
import { schema } from "./schema/InvoiceSchema.js";

const db = connectDB();
initTestDB(db);

const knex = initKnex();

const dao = createDao(db, knex);

const dataLoaders = createDataLoaders(dao);

const server = startServer("/graphql", 4000, schema, dao, dataLoaders);
