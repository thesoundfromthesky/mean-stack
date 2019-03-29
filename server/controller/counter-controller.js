"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Counter_1 = require("../schema/Counter");
var util_1 = require("../util");
var CounterController = (function () {
    function CounterController() {
        this.createUtil();
    }
    CounterController.prototype.createUtil = function () {
        this.util = new util_1.Util();
    };
    CounterController.prototype.countVisitors = function (req, res, next) {
        var _this = this;
        var now = new Date();
        var date = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
        if (date != req.cookies.countDate) {
            res.cookie("countDate", date, { maxAge: 86400000, httpOnly: true });
            Counter_1.counterDocument
                .findOne({ name: "vistors" })
                .then(function (counter) {
                if (!counter) {
                    Counter_1.counterDocument.create({
                        name: "vistors",
                        totalCount: 1,
                        todayCount: 1,
                        date: date
                    });
                }
                else {
                    counter.totalCount++;
                    if (counter.date == date) {
                        counter.todayCount++;
                    }
                    else {
                        counter.todayCount = 1;
                        counter.date = date;
                    }
                    counter.save().then(function (counter) {
                        return res.json(_this.util.successTrue(counter));
                    });
                }
            })
                .catch(function (err) {
                res.json(_this.util.successFalse(err));
            });
        }
        else {
            Counter_1.counterDocument
                .findOne({ name: "vistors" })
                .then(function (counter) {
                return res.json(_this.util.successTrue(counter));
            })
                .catch(function (err) {
                res.json(_this.util.successFalse(err));
            });
        }
    };
    return CounterController;
}());
exports.CounterController = CounterController;
//# sourceMappingURL=counter-controller.js.map