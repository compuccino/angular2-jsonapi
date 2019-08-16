"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MetaData = /** @class */ (function () {
    function MetaData() {
    }
    return MetaData;
}());
exports.MetaData = MetaData;
var PageMetaData = /** @class */ (function () {
    function PageMetaData(response) {
        this.meta = {};
        this.meta = response.meta;
    }
    return PageMetaData;
}());
exports.PageMetaData = PageMetaData;
