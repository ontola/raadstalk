import express, { Response, Request } from "express";
import cors from "cors";
import path from "path";
import httpProxyMiddleware from "http-proxy-middleware";

const whitelist = ["http://localhost:8080", "http://localhost:3000"];
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

app.use(express.static(path.join(__dirname, "build")));

// Proxy search requests, remove `/search` from URL
app.all("/search", httpProxyMiddleware({
  target: "https://api.openraadsinformatie.nl/v1/elastic/ori_*/_search",
  changeOrigin: true,
  pathRewrite: { "^/search": "" },
  logLevel: process.env.NODE_ENV === "production" ? "info" :  "debug",
}));

// Production, serve static files
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8080);
