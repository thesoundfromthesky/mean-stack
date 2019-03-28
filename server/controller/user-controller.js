"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var User_1 = require("../schema/User");
var UserController = (function () {
    function UserController() {
        this.createUtil();
    }
    UserController.prototype.createUtil = function () {
        this.util = new util_1.Util();
    };
    UserController.prototype.create = function (req, res) {
        var _this = this;
        req.body._id = undefined;
        req.body.userId = res.locals.lastId + 1;
        req.body.createdAt = undefined;
        req.body.updatedAt = undefined;
        req.body.deleted = undefined;
        var newUser = new User_1.userDocument(req.body);
        newUser
            .save()
            .then(function (user) {
            if (!user)
                return res.json(_this.util.successFalse());
            return res.json(_this.util.successTrue(user));
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    UserController.prototype.index = function (req, res) {
        var _this = this;
        User_1.userDocument
            .find({
            deleted: false
        })
            .sort({ username: 1 })
            .exec()
            .then(function (users) {
            if (!users.length)
                return res.json(_this.util.successFalse());
            return res.json(_this.util.successTrue(users));
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    UserController.prototype.show = function (req, res) {
        var _this = this;
        User_1.userDocument
            .findOne({ username: req.params.username })
            .then(function (user) {
            if (!user || user.deleted)
                return res.json(_this.util.successFalse());
            return res.json(_this.util.successTrue(user));
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    UserController.prototype.update = function (req, res, next) {
        var _this = this;
        User_1.userDocument
            .findOne({ username: req.params.username })
            .select({ password: 1 })
            .then(function (user) {
            if (!user || user.deleted) {
                return res.json(_this.util.successFalse());
            }
            user.originalPassword = user.password;
            user.password = req.body.newPassword
                ? req.body.newPassword
                : user.password;
            for (var p in req.body) {
                if (p === "username")
                    continue;
                else if (p === "_id")
                    continue;
                else if (p === "createdAt")
                    continue;
                else if (p === "updatedAt")
                    continue;
                else if (p === "deleted")
                    continue;
                user[p] = req.body[p];
            }
            user.updatedAt = Date.now();
            user
                .save()
                .then(function (user) {
                if (!user)
                    return res.json(_this.util.successFalse());
                user.password = undefined;
                return res.json(_this.util.successTrue(user));
            })
                .catch(function (err) { return res.json(_this.util.successFalse(err)); });
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    UserController.prototype.delete = function (req, res, next) {
        var _this = this;
        User_1.userDocument
            .findOne({ username: req.params.username })
            .then(function (user) {
            if (!user || user.deleted)
                return res.json(_this.util.successFalse());
            user.deleted = true;
            user
                .save()
                .then(function (user) {
                if (!user)
                    return res.json(user.successFalse());
                return res.json(_this.util.successTrue(null, "delete success"));
            })
                .catch(function (err) { return res.json(_this.util.successFalse(err)); });
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    UserController.prototype.findLastIndex = function (req, res, next) {
        var _this = this;
        User_1.userDocument
            .findOne({})
            .sort({ userId: -1 })
            .then(function (user) {
            if (!user)
                res.locals.lastId = 0;
            else
                res.locals.lastId = user.userId;
            return next();
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    UserController.prototype.authGuardUser = function (req, res, next) {
        var _this = this;
        User_1.userDocument
            .findOne({ username: req.params.username })
            .then(function (user) {
            if (!user || user.deleted)
                return res.json(_this.util.successFalse());
            else if (!req.decoded || user._id != req.decoded._id) {
                return res.json(_this.util.successFalse(null, "You don't have permission"));
            }
            else
                return next();
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    return UserController;
}());
exports.UserController = UserController;
//# sourceMappingURL=user-controller.js.map