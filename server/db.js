"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Database = (function () {
    function Database() {
    }
    Database.prototype.connectMongoDb = function () {
        mongoose_1.default
            .connect(process.env.MONGO_DB, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
            .then(function () { return console.log("DB connected"); })
            .catch(function (err) { return console.log("DB ERROR : ", err); });
    };
    return Database;
}());
exports.Database = Database;
//# sourceMappingURL=db.js.map