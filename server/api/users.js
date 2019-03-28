"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_controller_1 = require("../controller/user-controller");
var UserApi = (function () {
    function UserApi() {
        this.init();
        this.setRoutes();
    }
    UserApi.prototype.init = function () {
        this.userController = new user_controller_1.UserController();
        this.userRouter = express_1.default.Router();
    };
    UserApi.prototype.getRouter = function () {
        return this.userRouter;
    };
    UserApi.prototype.setRoutes = function () {
        this.userRouter
            .route("/")
            .get(this.userController.util.isLoggedin.bind(this.userController.util), this.userController.index.bind(this.userController))
            .post(this.userController.findLastIndex.bind(this.userController), this.userController.create.bind(this.userController));
        this.userRouter
            .route("/:username")
            .get(this.userController.util.isLoggedin.bind(this.userController.util), this.userController.show.bind(this.userController))
            .put(this.userController.util.isLoggedin.bind(this.userController.util), this.userController.authGuardUser.bind(this.userController), this.userController.update.bind(this.userController))
            .delete(this.userController.util.isLoggedin.bind(this.userController.util), this.userController.authGuardUser.bind(this.userController), this.userController.delete.bind(this.userController));
    };
    return UserApi;
}());
exports.UserApi = UserApi;
//# sourceMappingURL=users.js.map