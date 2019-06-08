import path from "path";

import cors from "cors";
import express, { Response, Request } from "express";
import httpProxyMiddleware from "http-proxy-middleware";
import morgan from "morgan";

import { esURL, port, staticDir } from "./config";
import WordUpdater from "./WordUpdater";
import { PopularTerm } from "../../types";

const app = express();

app.use(cors());
app.use(morgan("combined"));

// Proxy search requests, remove `/search` from URL
app.all("/search", httpProxyMiddleware({
  target: esURL,
  changeOrigin: true,
  pathRewrite: { "^/search": "" },
  logLevel: process.env.NODE_ENV === "production" ? "info" :  "debug",
}));

app.get("/popular/:date", (req: Request, res: Response) => {
  const yearRegex = /\d{4}/;
  const monthRegex = /.*-(\d{2})/;
  const date = {
    year: Number(yearRegex.exec(req.params.date)[0]),
    month: Number(monthRegex.exec(req.params.date)[1]),
  };
  new WordUpdater(date)
    .getWordCounts()
    .then((result: PopularTerm[]) => res.send(result));
});

// Production, serve static files
app.use(express.static(path.join(staticDir)));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

app.listen(port);
