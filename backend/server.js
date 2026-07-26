const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const apiRoutes = require("./src/routes/index");
const errorMiddleware = require("./src/middlewares/error.middleware");
const { protect } = require("./src/middlewares/auth.middleware");
const { allowRoles } = require("./src/middlewares/role.middleware");
require("dotenv").config();

const connectDB = require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BuildTrack API is running",
  });
});

app.get(
  "/api/test-protected",
  protect,
  allowRoles("admin", "project_manager"),
  (req, res) => {
    res.json({
      success: true,
      message: `Hello ${req.user.role}, you're authorized`,
    });
  },
);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

app.use(errorMiddleware);

startServer();
