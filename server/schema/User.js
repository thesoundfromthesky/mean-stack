"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
var util_1 = require("../util");
var util = new util_1.Util();
var userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, "Username is required!"],
        match: [/^.{4,12}$/, "Should be 4-12 characters!"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        select: false
    },
    userId: { type: Number, default: 0 },
    name: {
        type: String,
        required: [true, "Name is required!"],
        match: [/^.{4,12}$/, "Should be 4-12 characters!"],
        trim: true
    },
    email: {
        type: String,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
            "Should be a vaild email address!"
        ],
        trim: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    deleted: { type: Boolean, default: false }
}, {
    toJSON: { virtuals: true },
    id: false
});
userSchema
    .virtual("passwordConfirmation")
    .get(function () {
    return this._passwordConfirmation;
})
    .set(function (value) {
    this._passwordConfirmation = value;
});
userSchema
    .virtual("originalPassword")
    .get(function () {
    return this._originalPassword;
})
    .set(function (value) {
    this._originalPassword = value;
});
userSchema
    .virtual("currentPassword")
    .get(function () {
    return this._currentPassword;
})
    .set(function (value) {
    this._currentPassword = value;
});
userSchema
    .virtual("newPassword")
    .get(function () {
    return this._newPassword;
})
    .set(function (value) {
    this._newPassword = value;
});
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = "Should be minimum 8 characters of alphabet and number combination!";
userSchema.path("password").validate(function (v) {
    var user = this;
    if (user.isNew) {
        if (!user.passwordConfirmation) {
            user.invalidate("passwordConfirmation", "Password Confirmation is required!");
        }
        if (!passwordRegex.test(user.password)) {
            user.invalidate("password", passwordRegexErrorMessage);
        }
        else if (user.password !== user.passwordConfirmation) {
            user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
        }
    }
    if (!user.isNew) {
        if (!user.currentPassword) {
            user.invalidate("currentPassword", "Current Password is required!");
        }
        if (user.currentPassword &&
            !bcrypt_nodejs_1.default.compareSync(user.currentPassword, user.originalPassword)) {
            user.invalidate("currentPassword", "Current Password is invalid!");
        }
        if (user.newPassword && !passwordRegex.test(user.newPassword)) {
            user.invalidate("newPassword", passwordRegexErrorMessage);
        }
        else if (user.newPassword !== user.passwordConfirmation) {
            user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
        }
    }
});
userSchema.pre("save", function (next) {
    var user = this;
    if (!user.isModified("password")) {
        return next();
    }
    else {
        user.password = bcrypt_nodejs_1.default.hashSync(user.password);
        return next();
    }
});
userSchema.methods.authenticate = function (password) {
    var user = this;
    return bcrypt_nodejs_1.default.compareSync(password, user.password);
};
userSchema.virtual("createdDate").get(function () {
    return util.getDate(this.createdAt);
});
userSchema.virtual("createdTime").get(function () {
    return util.getTime(this.createdAt);
});
userSchema.virtual("updatedDate").get(function () {
    return util.getDate(this.updatedAt);
});
userSchema.virtual("updatedTime").get(function () {
    return util.getTime(this.updatedAt);
});
exports.userDocument = mongoose_1.default.models.user ||
    mongoose_1.default.model("user", userSchema);
//# sourceMappingURL=User.js.map