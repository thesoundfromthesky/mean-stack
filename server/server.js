"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = __importDefault(require("socket.io"));
var path_1 = __importDefault(require("path"));
var auth_1 = require("./api/auth");
var users_1 = require("./api/users");
var posts_1 = require("./api/posts");
var comments_1 = require("./api/comments");
var counters_1 = require("./api/counters");
var db_1 = require("./db");
var App = (function () {
    function App() {
        this.createApp();
        this.createDb();
        this.connectDb();
        this.config();
        this.createApi();
        this.initApi();
        this.angular();
        this.createServer();
        this.sockets();
        this.listen();
    }
    App.prototype.createApp = function () {
        this.app = express_1.default();
    };
    App.prototype.createDb = function () {
        this.db = new db_1.Database();
    };
    App.prototype.getApp = function () {
        return this.app;
    };
    App.prototype.connectDb = function () {
        this.db.connectMongoDb();
    };
    App.prototype.config = function () {
        this.port = process.env.PORT || App.PORT;
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({
            extended: true
        }));
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
            res.header("Access-Control-Allow-Headers", "Content-Type, x-access-token");
            next();
        });
    };
    App.prototype.createApi = function () {
        this.userApi = new users_1.UserApi();
        this.authApi = new auth_1.AuthApi();
        this.postApi = new posts_1.PostApi();
        this.commentApi = new comments_1.CommentApi();
        this.counterApi = new counters_1.CounterApi();
    };
    App.prototype.initApi = function () {
        this.app.use("/api/auth", this.authApi.getRouter());
        this.app.use("/api/users", this.userApi.getRouter());
        this.app.use("/api/posts", this.postApi.getRouter());
        this.app.use("/api/comments", this.commentApi.getRouter());
        this.app.use("/api/counters", this.counterApi.getRouter());
    };
    App.prototype.angular = function () {
        this.app.use(express_1.default.static(path_1.default.resolve(__dirname, "../dist/client")));
        this.app.get("*", function (req, res) {
            var indexFile = path_1.default.resolve(__dirname, "../dist/client/index.html");
            res.sendFile(indexFile);
        });
    };
    App.prototype.createServer = function () {
        this.server = http_1.default.createServer(this.app);
    };
    App.prototype.sockets = function () {
        this.io = socket_io_1.default(this.server);
    };
    App.prototype.listen = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log("Running server on port %s", _this.port);
        });
        this.io.on("connect", function (socket) {
            console.log("Connected client on port %s.", _this.port);
            socket.on("message", function (m) {
                console.log("[server](message): %s", JSON.stringify(m));
                _this.io.emit("message", m);
            });
            socket.on("disconnect", function () {
                console.log("Client disconnected");
            });
        });
    };
    App.PORT = 3000;
    return App;
}());
exports.App = App;
//# sourceMappingURL=server.js.map