"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Comment_1 = require("./Comment");
exports.containerSchema = new mongoose_1.default.Schema({
    post: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "post",
        required: true
    },
    comments: [Comment_1.commentSchema]
});
exports.containerDocument = mongoose_1.default.models.comment ||
    mongoose_1.default.model("comment", exports.containerSchema);
//# sourceMappingURL=Container.js.map