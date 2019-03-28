"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Post_1 = require("../schema/Post");
var Container_1 = require("../schema/Container");
var util_1 = require("../util");
var PostController = (function () {
    function PostController() {
        this.createUtil();
    }
    PostController.prototype.createUtil = function () {
        this.util = new util_1.Util();
    };
    PostController.prototype.create = function (req, res) {
        var _this = this;
        req.body.author = req.decoded._id;
        req.body.postId = res.locals.lastId + 1;
        req.body._id = undefined;
        req.body.views = undefined;
        req.body.deleted = undefined;
        req.body.createdAt = undefined;
        req.body.updatedAt = undefined;
        var newPost = new Post_1.postDocument(req.body);
        newPost
            .save()
            .then(function (post) {
            if (!post)
                return res.json(_this.util.successFalse());
            Container_1.containerDocument
                .create({ post: post._id })
                .then(function (container) {
                return console.log("creating container success", container);
            })
                .catch(function (err) { return console.log("creating container failed", err); });
            return res.json(_this.util.successTrue(post));
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    PostController.prototype.index = function (req, res) {
        var _this = this;
        var page = Math.max(1, req.query.page);
        var limit = Math.max(10, req.query.limit);
        var maxLimit = 50;
        Post_1.postDocument
            .countDocuments({ deleted: false })
            .then(function (count) {
            if (!count) {
                return res.json(_this.util.successTrue([{ maxPage: 0 }], "empty data"));
            }
            else if (isNaN(limit))
                return res.json(_this.util.successFalse(null, "limit query NaN"));
            else if (maxLimit < limit)
                return res.json(_this.util.successFalse(null, "limit exceeds max : " + maxLimit));
            var skip = (page - 1) * limit;
            var maxPage = Math.ceil(count / limit);
            Post_1.postDocument
                .find({
                deleted: false
            })
                .sort("-createdAt")
                .skip(skip)
                .limit(limit)
                .populate("author")
                .exec()
                .then(function (posts) {
                if (!posts)
                    return res.json(_this.util.successFalse());
                else if (isNaN(page))
                    return res.json(_this.util.successFalse(null, "page is NaN"));
                else if (maxPage < page)
                    return res.json(_this.util.successFalse(null, "page exceeds max : " + maxPage));
                posts.push({ maxPage: maxPage });
                return res.json(_this.util.successTrue(posts));
            })
                .catch(function (err) { return res.json(_this.util.successFalse(err)); });
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    PostController.prototype.show = function (req, res) {
        var _this = this;
        Post_1.postDocument
            .findOne({ _id: req.params.id })
            .populate("author")
            .then(function (post) {
            if (!post || post.deleted) {
                return res.json(_this.util.successFalse());
            }
            ++post.views;
            post
                .save()
                .then(function (post) {
                if (!post)
                    return res.json(_this.util.successFalse());
                return res.json(_this.util.successTrue(post));
            })
                .catch(function (err) { return res.json(_this.util.successFalse(err)); });
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    PostController.prototype.update = function (req, res) {
        var _this = this;
        Post_1.postDocument
            .findOne({ _id: req.params.id })
            .then(function (post) {
            if (!post || post.deleted)
                return res.json(_this.util.successFalse());
            for (var p in req.body) {
                if (p === "postId")
                    continue;
                if (p === "_id")
                    continue;
                else if (p === "views")
                    continue;
                else if (p === "createdAt")
                    continue;
                else if (p === "updatedAt")
                    continue;
                else if (p === "deleted")
                    continue;
                else if (p === "author")
                    continue;
                post[p] = req.body[p];
            }
            post.updatedAt = Date.now();
            post
                .save()
                .then(function (post) {
                if (!post)
                    return res.json(_this.util.successFalse());
                return res.json(_this.util.successTrue(post));
            })
                .catch(function (err) { return res.json(_this.util.successFalse(err)); });
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    PostController.prototype.delete = function (req, res) {
        var _this = this;
        Post_1.postDocument
            .findOne({ _id: req.params.id })
            .then(function (post) {
            if (!post || post.deleted)
                return res.json(_this.util.successFalse());
            post.deleted = true;
            post
                .save()
                .then(function (post) {
                if (!post)
                    return res.json(_this.util.successFalse());
                return res.json(_this.util.successTrue(null, "delete success"));
            })
                .catch(function (err) { return res.json(_this.util.successFalse(err)); });
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    PostController.prototype.findLastIndex = function (req, res, next) {
        var _this = this;
        Post_1.postDocument
            .findOne({})
            .sort({ postId: -1 })
            .then(function (post) {
            if (!post)
                res.locals.lastId = 0;
            else
                res.locals.lastId = post.postId;
            return next();
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    PostController.prototype.authGuardPost = function (req, res, next) {
        var _this = this;
        Post_1.postDocument
            .findOne({ _id: req.params.id })
            .then(function (post) {
            if (!post || post.deleted)
                return res.json(_this.util.successFalse());
            else if (!req.decoded ||
                post.author._id != req.decoded._id) {
                return res.json(_this.util.successFalse(null, "You don't have permission"));
            }
            else {
                return next();
            }
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    return PostController;
}());
exports.PostController = PostController;
//# sourceMappingURL=post-controller.js.map