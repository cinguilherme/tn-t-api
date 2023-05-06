import express from "express";
import cors from "cors";
import { V1 } from "./routes";
import * as db from "./db";

// db.dropTables().then(() => {
//   console.log("Tables dropped...");
// db.createTables()
//   .then(() => {
//     console.log("Tables created...");
//   })
//   .catch((e) => {
//     console.log("tables aready created...");
//   });
// });

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.CORS ||  "*", // get this from ENV
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/v1/users", V1.user.router);
app.use("/v1/operations", V1.operation.router);
app.use("/v1/records", V1.record.router);

app.use("/v1", (req,res) => {
  res.send("TN REST API YOU ARE ON ROOT");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
