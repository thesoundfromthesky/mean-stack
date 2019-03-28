"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_controller_1 = require("../controller/auth-controller");
var AuthApi = (function () {
    function AuthApi() {
        this.init();
        this.setRoutes();
    }
    AuthApi.prototype.init = function () {
        this.authController = new auth_controller_1.AuthController();
        this.authRouter = express_1.default.Router();
    };
    AuthApi.prototype.getRouter = function () {
        return this.authRouter;
    };
    AuthApi.prototype.setRoutes = function () {
        this.authRouter
            .route("/login")
            .post(this.authController.loginValidation.bind(this.authController), this.authController.login.bind(this.authController));
        this.authRouter
            .route("/me")
            .get(this.authController.util.isLoggedin.bind(this.authController.util), this.authController.me.bind(this.authController));
        this.authRouter
            .route("/refresh")
            .get(this.authController.util.isLoggedin.bind(this.authController.util), this.authController.refresh.bind(this.authController));
    };
    return AuthApi;
}());
exports.AuthApi = AuthApi;
//# sourceMappingURL=auth.js.map