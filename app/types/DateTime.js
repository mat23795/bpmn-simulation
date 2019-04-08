var DateTime = (function () {
    function DateTime(year, month, day, hour, minutes, seconds) {
        if (hour === void 0) { hour = 0; }
        if (minutes === void 0) { minutes = 0; }
        if (seconds === void 0) { seconds = 0; }
        var temp = new Date(Date.UTC(year, month, day, hour, minutes, seconds));
        this._date = temp.toISOString();
    }
    Object.defineProperty(DateTime.prototype, "date", {
        get: function () {
            return this._date;
        },
        enumerable: true,
        configurable: true
    });
    return DateTime;
})();
exports.DateTime = DateTime;
//# sourceMappingURL=DateTime.js.map