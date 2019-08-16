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
var json_api_model_config_decorator_1 = require("../../src/decorators/json-api-model-config.decorator");
var json_api_model_1 = require("../../src/models/json-api.model");
var attribute_decorator_1 = require("../../src/decorators/attribute.decorator");
var belongs_to_decorator_1 = require("../../src/decorators/belongs-to.decorator");
var Chapter = /** @class */ (function (_super) {
    __extends(Chapter, _super);
    function Chapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        attribute_decorator_1.Attribute()
    ], Chapter.prototype, "title", void 0);
    __decorate([
        attribute_decorator_1.Attribute()
    ], Chapter.prototype, "ordering", void 0);
    __decorate([
        attribute_decorator_1.Attribute()
    ], Chapter.prototype, "created_at", void 0);
    __decorate([
        attribute_decorator_1.Attribute()
    ], Chapter.prototype, "updated_at", void 0);
    __decorate([
        belongs_to_decorator_1.BelongsTo()
    ], Chapter.prototype, "book", void 0);
    Chapter = __decorate([
        json_api_model_config_decorator_1.JsonApiModelConfig({
            type: 'chapters'
        })
    ], Chapter);
    return Chapter;
}(json_api_model_1.JsonApiModel));
exports.Chapter = Chapter;
