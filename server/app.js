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

dotenv.config();
// sanitize CLIENT_URL so quotes, accidental spaces or trailing slashes in `server/.env` don't break CORS checks
const CLIENT_URL = (process.env.CLIENT_URL || '')
  .replace(/^['"]|['"]$/g, '')
  .trim()
  .replace(/\/+$/g, '');

const app = express();
app.use(cookieParser());

// Validate required environment variables early
const requiredEnv = [
  'CONNECTION_URL',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'JWT_COOKIE_EXPIRES_IN',
  'CLIENT_URL', // thêm CLIENT_URL để production domain
];
const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('Please add them to server/.env or your environment before starting the server.');
  process.exit(1);
}

// Body parser
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// CORS: allow localhost, production, and Netlify preview domains
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // server-side or curl requests
    // Localhost dev
    if (origin.startsWith('http://localhost')) return callback(null, true);
    // Production domain
    if (CLIENT_URL && origin === CLIENT_URL) return callback(null, true);
    // Netlify preview subdomains: *.--your-site-name.netlify.app
    if (/--.*--footgearh\.netlify\.app$/.test(origin)) return callback(null, true);

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  exposedHeaders: ["set-cookie"],
}));

// Logging
app.use(morgan("dev"));

// Routes
app.use("/user", userRoutes);
app.use("/shoesPage", shoesPageRoutes);
app.use("/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Hello this is Shoes Store");
});

// Start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(error => console.log(error));

export default app;
