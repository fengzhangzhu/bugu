const localMode = false;
const debugMode = false;
const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");
const devProxy = {
    "/api": {
        target: localMode
            ? "http://localhost:20000/"
            : debugMode
            ? "https://your_url.example/"
            : "https://your_url.example/",
        pathRewrite: {
            "^/api": "/",
        },
        changeOrigin: true,
    },
    "/upload": {
        target: "http://up-z2.qiniup.com/",
        pathRewrite: {
            "^/upload": "/",
        },
        changeOrigin: true,
    },
};
const proProxy = {
    "/api": {
        target: debugMode
            ? "https://your_url.example/"
            : "https://your_url.example/",
        pathRewrite: {
            "^/api": "/",
        },
        changeOrigin: true,
    },
    "/upload": {
        target: "http://up-z2.qiniup.com/",
        pathRewrite: {
            "^/upload": "/",
        },
        changeOrigin: true,
    },
};

const port = parseInt(process.env.PORT, 10) || 3001;
const dev = process.env.NODE_ENV !== "production";
const app = next({
    dev,
});
const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        const server = express();
        if (dev && devProxy) {
            Object.keys(devProxy).forEach(function (context) {
                server.use(createProxyMiddleware(context, devProxy[context]));
            });
        } else if (!dev && proProxy) {
            Object.keys(proProxy).forEach(function (context) {
                server.use(createProxyMiddleware(context, proProxy[context]));
            });
        }

        server.all("*", (req, res) => {
            handle(req, res);
        });

        server.listen(port, (err) => {
            if (err) {
                throw err;
            }
            console.log(`> Ready on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log("An error occurred, unable to start the server");
        console.log("发生错误，无法启动服务器");
        console.log(err);
    });
