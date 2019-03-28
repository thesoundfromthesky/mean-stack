"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var post_controller_1 = require("../controller/post-controller");
var PostApi = (function () {
    function PostApi() {
        this.init();
        this.setRoutes();
    }
    PostApi.prototype.init = function () {
        this.postController = new post_controller_1.PostController();
        this.postRouter = express_1.default.Router();
    };
    PostApi.prototype.getRouter = function () {
        return this.postRouter;
    };
    PostApi.prototype.setRoutes = function () {
        this.postRouter
            .route("/")
            .get(this.postController.index.bind(this.postController))
            .post(this.postController.util.isLoggedin.bind(this.postController.util), this.postController.findLastIndex.bind(this.postController), this.postController.create.bind(this.postController));
        this.postRouter
            .route("/:id")
            .get(this.postController.show.bind(this.postController))
            .put(this.postController.util.isLoggedin.bind(this.postController.util), this.postController.authGuardPost.bind(this.postController), this.postController.update.bind(this.postController))
            .delete(this.postController.util.isLoggedin.bind(this.postController.util), this.postController.authGuardPost.bind(this.postController), this.postController.delete.bind(this.postController));
    };
    return PostApi;
}());
exports.PostApi = PostApi;
//# sourceMappingURL=posts.js.map