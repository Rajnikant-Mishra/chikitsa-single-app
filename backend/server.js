import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import sequelize from "./config/db.js";
import "./modules/associations.js";


const PORT = process.env.PORT || 5000;
     
const server = http.createServer(app);


//  Start server FIRST, then connect DB
server.listen(PORT,"0.0.0.0" ,() => {
  console.log(`Server running on port ${PORT}`);

  sequelize
    .authenticate()
    .then(() => {
      console.log("MySQL Connected");
      return sequelize.sync();
    })
    .catch((err) => {
      console.error("DB connection failed:", err);
    });
});




