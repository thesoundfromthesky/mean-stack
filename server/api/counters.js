"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var counter_controller_1 = require("../controller/counter-controller");
var CounterApi = (function () {
    function CounterApi() {
        this.init();
        this.setRoutes();
    }
    CounterApi.prototype.init = function () {
        this.counterController = new counter_controller_1.CounterController();
        this.counterRouter = express_1.default.Router();
    };
    CounterApi.prototype.getRouter = function () {
        return this.counterRouter;
    };
    CounterApi.prototype.setRoutes = function () {
        this.counterRouter
            .route("/")
            .get(this.counterController.countVisitors.bind(this.counterController));
    };
    return CounterApi;
}());
exports.CounterApi = CounterApi;
//# sourceMappingURL=counters.js.map