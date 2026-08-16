import express from "express";
import helmet from "helmet";
import visionRouter from "./api/vision.js";

const app = express();

const PORT =
  process.env.PORT || 3000;

app.disable("x-powered-by");

app.use(helmet());

app.use(
  express.json({
    limit: "6mb"
  })
);

app.get(
  "/health",
  (_req, res) => {
    res.json({
      status: "ok",
      service: "see2shop-api",
      version: "0.1.0"
    });
  }
);

app.use(
  "/api/v1/vision",
  visionRouter
);

app.use(
  (_req, res) => {
    res.status(404).json({
      error: "Not found"
    });
  }
);

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `See2Shop API listening on port ${PORT}`
    );
  }
);
