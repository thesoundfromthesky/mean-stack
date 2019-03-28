"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var util_1 = require("../util");
var util = new util_1.Util();
exports.commentSchema = new mongoose_1.default.Schema({
    name: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    memo: {
        type: String,
        required: [true, "memo is required!"],
        trim: true
    },
    deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, { toJSON: { virtuals: true }, id: false });
exports.commentSchema.virtual("createdDate").get(function () {
    return util.getDate(this.createdAt);
});
exports.commentSchema.virtual("createdTime").get(function () {
    return util.getTime(this.createdAt);
});
exports.commentSchema.virtual("updatedDate").get(function () {
    return util.getDate(this.updatedAt);
});
exports.commentSchema.virtual("updatedTime").get(function () {
    return util.getTime(this.updatedAt);
});
//# sourceMappingURL=Comment.js.map