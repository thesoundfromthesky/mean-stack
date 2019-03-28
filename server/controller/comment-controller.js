"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Container_1 = require("../schema/Container");
var util_1 = require("../util");
var CommentController = (function () {
    function CommentController() {
        this.createUtil();
    }
    CommentController.prototype.createUtil = function () {
        this.util = new util_1.Util();
    };
    CommentController.prototype.create = function (req, res) {
        var _this = this;
        Container_1.containerDocument
            .findOne({ post: req.params.id })
            .populate("post", "deleted")
            .then(function (container) {
            if (!container || container.post.deleted)
                return res.json(_this.util.successFalse());
            req.body._id = undefined;
            req.body.name = req.decoded._id;
            req.body.deleted = undefined;
            req.body.createdAt = undefined;
            container.comments.push(req.body);
            container
                .save()
                .then(function (container) {
                if (!container)
                    return res.json(_this.util.successFalse());
                container.comments = container.comments.filter(function (value) {
                    return !value.deleted;
                });
                return res.json(_this.util.successTrue(container.comments));
            })
                .catch(function (err) { return res.json(_this.util.successFalse(err)); });
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    CommentController.prototype.show = function (req, res) {
        var _this = this;
        Container_1.containerDocument
            .findOne({ post: req.params.id })
            .populate("post", "deleted")
            .populate("comments.name", "username")
            .then(function (container) {
            if (!container || container.post.deleted)
                return res.json(_this.util.successFalse());
            container.comments = container.comments.filter(function (value) {
                return !value.deleted;
            });
            return res.json(_this.util.successTrue(container.comments));
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    CommentController.prototype.update = function (req, res) {
        var _this = this;
        Container_1.containerDocument
            .findOne({ post: req.params.id })
            .populate("post", "deleted")
            .then(function (container) {
            if (!container ||
                container.post.deleted ||
                !container.comments.length)
                return res.json(_this.util.successFalse());
            for (var i = 0; i < container.comments.length; ++i) {
                if (req.params.commentId == container.comments[i]._id) {
                    if (container.comments[i].deleted) {
                        return res.json(_this.util.successFalse());
                    }
                    else {
                        container.comments[i].memo = req.body.memo;
                        break;
                    }
                }
            }
            container
                .save()
                .then(function (container) {
                if (!container)
                    return res.json(_this.util.successFalse());
                container.comments = container.comments.filter(function (value) {
                    return !value.deleted;
                });
                return res.json(_this.util.successTrue(container.comments));
            })
                .catch(function (err) { return res.json(_this.util.successFalse(err)); });
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    CommentController.prototype.delete = function (req, res) {
        var _this = this;
        Container_1.containerDocument
            .findOne({ post: req.params.id })
            .populate("post", "deleted")
            .then(function (container) {
            if (!container ||
                container.post.deleted ||
                !container.comments.length)
                return res.json(_this.util.successFalse());
            for (var i = 0; i < container.comments.length; ++i) {
                if (req.params.commentId == container.comments[i]._id) {
                    if (container.comments[i].deleted) {
                        return res.json(_this.util.successFalse());
                    }
                    else {
                        container.comments[i].deleted = true;
                        break;
                    }
                }
            }
            container
                .save()
                .then(function (post) {
                if (!container)
                    return res.json(_this.util.successFalse());
                return res.json(_this.util.successTrue({ comments: null }, "comment delete success"));
            })
                .catch(function (err) { return res.json(_this.util.successFalse(err)); });
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    CommentController.prototype.authGuardComment = function (req, res, next) {
        var _this = this;
        Container_1.containerDocument
            .findOne({ post: req.params.id })
            .populate("post")
            .then(function (container) {
            if (!container || container.post.deleted || !container.comments.length)
                return res.json(_this.util.successFalse());
            var i;
            for (i = 0; i < container.comments.length; ++i) {
                if (container.comments[i]._id == req.params.commentId) {
                    break;
                }
            }
            if (container.comments[i].deleted)
                return res.json(_this.util.successFalse());
            else if (!req.decoded ||
                container.comments[i].name._id != req.decoded._id) {
                return res.json(_this.util.successFalse(null, "You don't have permission"));
            }
            else {
                return next();
            }
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    return CommentController;
}());
exports.CommentController = CommentController;
//# sourceMappingURL=comment-controller.js.map