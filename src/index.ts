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

export const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.FRONT_END ||  "*",
};
app.use(cors(corsOptions));
app.use(express.json());

if(process.env.NODE_ENV === "prod"){
  const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
  app.use(awsServerlessExpressMiddleware.eventContext())
  app.get('/', (req:any, res) => {
    res.json(req.apiGateway.event)
  })
}

app.use("/v1/users", V1.user.router);
app.use("/v1/operations", V1.operation.router);
app.use("/v1/records", V1.record.router);

app.use("/v1", (req,res) => {
  console.log('v1 root');
  
  res.send("TN REST API YOU ARE ON ROOT of V1");
});

app.use("/", (req,res) => {
  console.log('root');
  
  res.send("TN REST API YOU ARE ON ROOT");
});

if(process.env.NODE_ENV !== "prod"){
  app.listen(port, () => {
    console.log(`Server is running locally on port ${port}`);
  });
}
