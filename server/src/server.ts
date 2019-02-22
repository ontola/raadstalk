import express, { Response, Request } from "express";
import cors from "cors";
import path from "path";
import httpProxyMiddleware from "http-proxy-middleware";
import { mockPupularItems } from "./mockdata";

const whitelist = ["http://localhost:8080", "http://localhost:3000"];
const staticDir = process.env.WWW_DIR || "www";
const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const app = express();

app.use(cors(corsOptions));
// app.option((cors(corsOptions));

// Proxy search requests, remove `/search` from URL
app.all("/search", httpProxyMiddleware({
  target: "https://api.openraadsinformatie.nl/v1/elastic/ori_*/_search",
  changeOrigin: true,
  pathRewrite: { "^/search": "" },
  logLevel: process.env.NODE_ENV === "production" ? "info" :  "debug",
}));

app.all("/popular", (req: Request, res: Response) => {
  res.send(mockPupularItems);
});

// Production, serve static files
app.use(express.static(path.join(__dirname, staticDir)));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, staticDir, "index.html"));
});

app.listen(process.env.PORT || 8080);
