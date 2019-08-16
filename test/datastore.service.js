"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var author_model_1 = require("./models/author.model");
var book_model_1 = require("./models/book.model");
var chapter_model_1 = require("./models/chapter.model");
exports.BASE_URL = 'http://localhost:8080';
exports.API_VERSION = 'v1';
var Datastore = /** @class */ (function (_super) {
    __extends(Datastore, _super);
    function Datastore(http) {
        return _super.call(this, http) || this;
    }
    Datastore = __decorate([
        src_1.JsonApiDatastoreConfig({
            baseUrl: exports.BASE_URL,
            apiVersion: exports.API_VERSION,
            models: {
                authors: author_model_1.Author,
                books: book_model_1.Book,
                chapters: chapter_model_1.Chapter
            }
        })
    ], Datastore);
    return Datastore;
}(src_1.JsonApiDatastore));
exports.Datastore = Datastore;
