import path from "path";

import cors from "cors";
import express, { Response, Request } from "express";
import httpProxyMiddleware from "http-proxy-middleware";
import morgan from "morgan";

import { oriURL } from "./config";
import WordUpdater from "./WordUpdater";
import { PopularTerm } from "../../types";

const staticDir = process.env.WWW_DIR || "/usr/src/app/www/";
const defaultPort = 8080;
const app = express();

app.use(cors());
app.use(morgan("combined"));

const DATE = { year: 2018 };

// Proxy search requests, remove `/search` from URL
app.all("/search", httpProxyMiddleware({
  target: oriURL,
  changeOrigin: true,
  pathRewrite: { "^/search": "" },
  logLevel: process.env.NODE_ENV === "production" ? "info" :  "debug",
}));

app.get("/popular", (req: Request, res: Response) => {
  new WordUpdater(DATE)
    .getWordCounts()
    .then((result: PopularTerm[]) => res.send(result));
});

// Production, serve static files
app.use(express.static(path.join(staticDir)));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

app.listen(process.env.PORT || defaultPort);
