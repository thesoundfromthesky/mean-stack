"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var util_1 = require("../util");
var User_1 = require("../schema/User");
var AuthController = (function () {
    function AuthController() {
        this.createUtil();
    }
    AuthController.prototype.createUtil = function () {
        this.util = new util_1.Util();
    };
    AuthController.prototype.loginValidation = function (req, res, next) {
        var isValid = true;
        var validationError = {
            name: "ValidationError",
            errors: {}
        };
        if (!req.body.username) {
            isValid = false;
            validationError.errors.username = { message: "Username is required!" };
        }
        if (!req.body.password) {
            isValid = false;
            validationError.errors.password = { message: "Password is required!" };
        }
        if (!isValid)
            res.json(this.util.successFalse(validationError));
        else {
            next();
        }
    };
    AuthController.prototype.login = function (req, res, next) {
        var _this = this;
        User_1.userDocument
            .findOne({ username: req.body.username })
            .select({ password: 1, username: 1, name: 1, email: 1 })
            .then(function (user) {
            if (!user || user.deleted || !user.authenticate(req.body.password))
                res.json(_this.util.successFalse(null, "Username or Password is invalid"));
            else {
                var payload = {
                    _id: user._id,
                    username: user.username
                };
                var secretOrPrivateKey = process.env.JWT_SECRET;
                var options = { expiresIn: 60 * 60 * 24 };
                jsonwebtoken_1.default.sign(payload, secretOrPrivateKey, options, function (err, token) {
                    if (err)
                        return res.json(_this.util.successFalse(err));
                    return res.json(_this.util.successTrue(token));
                });
            }
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    AuthController.prototype.me = function (req, res, next) {
        var _this = this;
        User_1.userDocument
            .findById(req.decoded._id)
            .then(function (user) {
            if (!user || user.deleted)
                return res.json(_this.util.successFalse());
            return res.json(_this.util.successTrue(user));
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    AuthController.prototype.refresh = function (req, res, next) {
        var _this = this;
        User_1.userDocument
            .findById(req.decoded._id)
            .then(function (user) {
            if (!user || user.deleted)
                res.json(_this.util.successFalse());
            else {
                var payload = {
                    _id: user._id,
                    username: user.username
                };
                var secretOrPrivateKey = process.env.JWT_SECRET;
                var options = { expiresIn: 60 * 60 * 24 };
                jsonwebtoken_1.default.sign(payload, secretOrPrivateKey, options, function (err, token) {
                    if (err)
                        return res.json(_this.util.successFalse(err));
                    return res.json(_this.util.successTrue(token));
                });
            }
        })
            .catch(function (err) { return res.json(_this.util.successFalse(err)); });
    };
    return AuthController;
}());
exports.AuthController = AuthController;
//# sourceMappingURL=auth-controller.js.map