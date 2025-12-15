import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import shoesPageRoutes from "./routes/productRoute.js";
import orderRoutes from "./routes/order.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());

dotenv.config();
// Validate required environment variables early to give clear error messages
const requiredEnv = [
  'CONNECTION_URL',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'JWT_COOKIE_EXPIRES_IN'
];
const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('Please add them to server/.env or your environment before starting the server.');
  process.exit(1);
}
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// CORS: allow localhost dev origins (3000/3001/3002) and allow server-to-server requests
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g., curl, server-side)
    if (!origin) return callback(null, true);

    // Allow any localhost origin (useful for dev on different ports)
    if (origin.startsWith('http://localhost')) return callback(null, true);

    // Optionally restrict to a configured client URL
    if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return callback(null, true);

    // Otherwise reject
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  exposedHeaders: ["set-cookie"],
}));
app.use(morgan("dev"));
app.use("/user", userRoutes);
app.use("/shoesPage", shoesPageRoutes);
app.use("/orders", orderRoutes);
app.get("/", (req, res) => {
  res.send("Hello this is Shoes Store");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(PORT, console.log(`Server running ${PORT}`)))
  .catch(error => console.log(error));

export default app;
