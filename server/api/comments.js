"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var comment_controller_1 = require("../controller/comment-controller");
var CommentApi = (function () {
    function CommentApi() {
        this.init();
        this.setRoutes();
    }
    CommentApi.prototype.init = function () {
        this.commentController = new comment_controller_1.CommentController();
        this.commentRouter = express_1.default.Router();
    };
    CommentApi.prototype.getRouter = function () {
        return this.commentRouter;
    };
    CommentApi.prototype.setRoutes = function () {
        this.commentRouter
            .route("/:id")
            .get(this.commentController.show.bind(this.commentController))
            .post(this.commentController.util.isLoggedin.bind(this.commentController.util), this.commentController.create.bind(this.commentController));
        this.commentRouter
            .route("/:id/:commentId")
            .put(this.commentController.util.isLoggedin.bind(this.commentController.util), this.commentController.authGuardComment.bind(this.commentController), this.commentController.update.bind(this.commentController))
            .delete(this.commentController.util.isLoggedin.bind(this.commentController.util), this.commentController.authGuardComment.bind(this.commentController), this.commentController.delete.bind(this.commentController));
    };
    return CommentApi;
}());
exports.CommentApi = CommentApi;
//# sourceMappingURL=comments.js.map