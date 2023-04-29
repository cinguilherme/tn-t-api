import express from "express";
import cors from "cors";
import userRouter from "./routes/userRouter";
import operationRouter from "./routes/operationRouter";
import recordRouter from "./routes/recordRouter";
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

// const corsOptions = {
//   origin: "http://your-frontend-domain.com",
// };

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/operations", operationRouter);
app.use("/records", recordRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
