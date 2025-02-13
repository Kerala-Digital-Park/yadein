const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const router = require('./routes/auth')
const path = require("path");

const app = express();

dotenv.config();

app.use(cors());
// app.use(cors({
//   origin: '*',  // Allow requests only from your frontend
//   credentials: true,                // Allow cookies/auth headers
// }));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(router)

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running successfully at port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Server running successfully");
});
