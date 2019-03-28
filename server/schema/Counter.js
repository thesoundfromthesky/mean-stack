"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
exports.counterSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    totalCount: {
        type: Number,
        required: true
    },
    todayCount: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});
exports.counterDocument = mongoose_1.default.models.counter ||
    mongoose_1.default.model("counter", exports.counterSchema);
//# sourceMappingURL=Counter.js.map