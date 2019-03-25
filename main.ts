import express = require("express");
import { createConnection } from "typeorm";
import { SERVER_PORT } from "./constants";
import { Server } from "./server/server";

createConnection().then(connection => {
    console.info(`Database connection '${connection.name}' ready`);
    const expressApplication = express();
    const server = new Server(expressApplication, connection);

    expressApplication.listen(SERVER_PORT);
}).catch(error => {
    console.error(`Error creating database connection`);
});
