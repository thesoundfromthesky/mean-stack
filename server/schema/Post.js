"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var util_1 = require("../util");
var util = new util_1.Util();
var postSchema = new mongoose_1.default.Schema({
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    postId: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false },
    title: {
        type: String,
        required: [true, "Title is required!"],
        match: [/^.{1,100}$/, "Should be less than 100 characters!"],
        trim: true
    },
    body: {
        type: String,
        required: [true, "Body is required!"],
        trim: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
}, { toJSON: { virtuals: true }, id: false });
postSchema.virtual("createdDate").get(function () {
    return util.getDate(this.createdAt);
});
postSchema.virtual("createdTime").get(function () {
    return util.getTime(this.createdAt);
});
postSchema.virtual("updatedDate").get(function () {
    return util.getDate(this.updatedAt);
});
postSchema.virtual("updatedTime").get(function () {
    return util.getTime(this.updatedAt);
});
exports.postDocument = mongoose_1.default.models.post ||
    mongoose_1.default.model("post", postSchema);
//# sourceMappingURL=Post.js.map