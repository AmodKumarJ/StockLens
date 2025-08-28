import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import portfolioRoutes from "./routes/portfolio.routes"
import stockRoutes from "./routes/stock.routes";
const app = express();
app.use(cors());
app.use(express.json());


const PORT = 3001;
//const FILE_PATH = "../portfolio.xlsx";
const FILE_PATH = path.join(__dirname, "../portfolio.xlsx");

app.use("/api", portfolioRoutes);
app.use("/api", stockRoutes);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
