"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var Util = (function () {
    function Util() {
    }
    Util.prototype.successTrue = function (data, message) {
        return {
            success: true,
            message: message ? message : null,
            errors: null,
            data: data
        };
    };
    Util.prototype.successFalse = function (err, message) {
        if (!err && !message)
            message = "data not found";
        return {
            success: false,
            message: message ? message : null,
            errors: err ? this.parseError(err) : null,
            data: null
        };
    };
    Util.prototype.parseError = function (errors) {
        var parsed = {};
        if (errors.name == "ValidationError") {
            for (var name_1 in errors.errors) {
                var validationError = errors.errors[name_1];
                parsed[name_1] = { message: validationError.message };
            }
        }
        else if (errors.code == "11000" &&
            errors.errmsg.indexOf("username") > 0) {
            parsed.username = { message: "This username already exists!" };
        }
        else {
            parsed.unhandled = errors;
        }
        return parsed;
    };
    Util.prototype.isLoggedin = function (req, res, next) {
        var _this = this;
        var token = req.headers["x-access-token"];
        if (!token)
            res.json(this.successFalse(null, "token is required!"));
        else {
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, function (err, decoded) {
                if (err)
                    return res.json(_this.successFalse(err));
                else {
                    req.decoded = decoded;
                    return next();
                }
            });
        }
    };
    Util.prototype.getDate = function (dateObj) {
        if (dateObj instanceof Date)
            return (dateObj.getFullYear() + "-" +
                (this.get2digits(dateObj.getMonth() + 1) + "-") +
                ("" + this.get2digits(dateObj.getDate())));
    };
    Util.prototype.getTime = function (dateObj) {
        if (dateObj instanceof Date)
            return (this.get2digits(dateObj.getHours()) + ":" +
                (this.get2digits(dateObj.getMinutes()) + ":") +
                ("" + this.get2digits(dateObj.getSeconds())));
    };
    Util.prototype.get2digits = function (num) {
        return ("0" + num).slice(-2);
    };
    return Util;
}());
exports.Util = Util;
//# sourceMappingURL=util.js.map