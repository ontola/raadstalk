import path from "path";

import cors from "cors";
import express, { Response, Request } from "express";
import httpProxyMiddleware from "http-proxy-middleware";
import morgan from "morgan";

import { getRedisWords, getHitCounts } from "./words";

const staticDir = process.env.WWW_DIR || "/usr/src/app/www/";
const defaultPort = 8080;
const app = express();

app.use(cors());
app.use(morgan("combined"));

// Proxy search requests, remove `/search` from URL
app.all("/search", httpProxyMiddleware({
  target: "https://api.openraadsinformatie.nl/v1/elastic/ori_*/_search",
  changeOrigin: true,
  pathRewrite: { "^/search": "" },
  logLevel: process.env.NODE_ENV === "production" ? "info" :  "debug",
}));

app.get("/popular", (req: Request, res: Response) => {
  getRedisWords()
    .then(result => res.send(result));

  getHitCounts();
});

// Production, serve static files
app.use(express.static(path.join(staticDir)));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

app.listen(process.env.PORT || defaultPort);
