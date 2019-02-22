"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const http_proxy_middleware_1 = __importDefault(require("http-proxy-middleware"));
const whitelist = ["http://localhost:8080", "http://localhost:3000"];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};
const app = express_1.default();
app.use(cors_1.default(corsOptions));
// app.option((cors(corsOptions));
app.use(express_1.default.static(path_1.default.join(__dirname, "build")));
// Proxy search requests, remove `/search` from URL
app.all("/search", http_proxy_middleware_1.default({
    target: "https://api.openraadsinformatie.nl/v1/elastic/ori_*/_search",
    changeOrigin: true,
    pathRewrite: { "^/search": "" },
    logLevel: process.env.NODE_ENV === "production" ? "info" : "debug",
}));
// Production, serve static files
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "build", "index.html"));
});
app.listen(process.env.PORT || 8080);
//# sourceMappingURL=server.js.map