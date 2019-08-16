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
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var date_fns_1 = require("date-fns");
var author_model_1 = require("../../test/models/author.model");
var custom_author_model_1 = require("../../test/models/custom-author.model");
var author_fixture_1 = require("../../test/fixtures/author.fixture");
var testing_2 = require("@angular/common/http/testing");
var datastore_service_1 = require("../../test/datastore.service");
var error_response_model_1 = require("../models/error-response.model");
var book_fixture_1 = require("../../test/fixtures/book.fixture");
var book_model_1 = require("../../test/models/book.model");
var datastore_with_config_service_1 = require("../../test/datastore-with-config.service");
var datastore;
var datastoreWithConfig;
var httpMock;
// workaround, see https://github.com/angular/angular/pull/8961
var MockError = /** @class */ (function (_super) {
    __extends(MockError, _super);
    function MockError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MockError;
}(Response));
describe('JsonApiDatastore', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                testing_2.HttpClientTestingModule,
            ],
            providers: [
                datastore_service_1.Datastore,
                datastore_with_config_service_1.DatastoreWithConfig,
            ]
        });
        datastore = testing_1.TestBed.get(datastore_service_1.Datastore);
        datastoreWithConfig = testing_1.TestBed.get(datastore_with_config_service_1.DatastoreWithConfig);
        httpMock = testing_1.TestBed.get(testing_2.HttpTestingController);
    });
    afterEach(function () {
        httpMock.verify();
    });
    describe('query', function () {
        it('should build basic url from the data from datastore decorator', function () {
            var authorModelConfig = Reflect.getMetadata('JsonApiModelConfig', author_model_1.Author);
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/" + authorModelConfig.type;
            datastore.query(author_model_1.Author).subscribe();
            var queryRequest = httpMock.expectOne({ method: 'GET', url: expectedUrl });
            queryRequest.flush({ data: [] });
        });
        it('should build basic url and apiVersion from the config variable if exists', function () {
            var authorModelConfig = Reflect.getMetadata('JsonApiModelConfig', author_model_1.Author);
            var expectedUrl = datastore_with_config_service_1.BASE_URL_FROM_CONFIG + "/" + datastore_with_config_service_1.API_VERSION_FROM_CONFIG + "/" + authorModelConfig.type;
            datastoreWithConfig.query(author_model_1.Author).subscribe();
            var queryRequest = httpMock.expectOne({ method: 'GET', url: expectedUrl });
            queryRequest.flush({ data: [] });
        });
        // tslint:disable-next-line:max-line-length
        it('should use apiVersion and modelEnpointUrl from the model instead of datastore if model has apiVersion and/or modelEndpointUrl specified', function () {
            var authorModelConfig = Reflect.getMetadata('JsonApiModelConfig', custom_author_model_1.CustomAuthor);
            var expectedUrl = datastore_with_config_service_1.BASE_URL_FROM_CONFIG + "/" + custom_author_model_1.AUTHOR_API_VERSION + "/" + custom_author_model_1.AUTHOR_MODEL_ENDPOINT_URL;
            datastoreWithConfig.query(custom_author_model_1.CustomAuthor).subscribe();
            var queryRequest = httpMock.expectOne({ method: 'GET', url: expectedUrl });
            queryRequest.flush({ data: [] });
        });
        it('should set JSON API headers', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors";
            datastore.query(author_model_1.Author).subscribe();
            var queryRequest = httpMock.expectOne({ method: 'GET', url: expectedUrl });
            expect(queryRequest.request.headers.get('Content-Type')).toEqual('application/vnd.api+json');
            expect(queryRequest.request.headers.get('Accept')).toEqual('application/vnd.api+json');
            queryRequest.flush({ data: [] });
        });
        it('should build url with nested params', function () {
            var queryData = {
                page: {
                    size: 10, number: 1
                },
                include: 'comments',
                filter: {
                    title: {
                        keyword: 'Tolkien'
                    }
                }
            };
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/" + 'authors?' +
                encodeURIComponent('page[size]') + '=10&' +
                encodeURIComponent('page[number]') + '=1&' +
                encodeURIComponent('include') + '=comments&' +
                encodeURIComponent('filter[title][keyword]') + '=Tolkien';
            datastore.query(author_model_1.Author, queryData).subscribe();
            httpMock.expectNone(datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION);
            var queryRequest = httpMock.expectOne({ method: 'GET', url: expectedUrl });
            queryRequest.flush({ data: [] });
        });
        it('should have custom headers', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors";
            datastore.query(author_model_1.Author, null, new Headers({ Authorization: 'Bearer' })).subscribe();
            var queryRequest = httpMock.expectOne({ method: 'GET', url: expectedUrl });
            expect(queryRequest.request.headers.get('Authorization')).toEqual('Bearer');
            queryRequest.flush({ data: [] });
        });
        it('should override base headers', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors";
            datastore.headers = new Headers({ Authorization: 'Bearer' });
            datastore.query(author_model_1.Author, null, new Headers({ Authorization: 'Basic' })).subscribe();
            var queryRequest = httpMock.expectOne({ method: 'GET', url: expectedUrl });
            expect(queryRequest.request.headers.get('Authorization')).toEqual('Basic');
            queryRequest.flush({ data: [] });
        });
        it('should get authors', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors";
            datastore.query(author_model_1.Author).subscribe(function (authors) {
                expect(authors).toBeDefined();
                expect(authors.length).toEqual(1);
                expect(authors[0].id).toEqual(author_fixture_1.AUTHOR_ID);
                expect(authors[0].name).toEqual(author_fixture_1.AUTHOR_NAME);
                expect(authors[1]).toBeUndefined();
            });
            var queryRequest = httpMock.expectOne(expectedUrl);
            queryRequest.flush({ data: [author_fixture_1.getAuthorData()] });
        });
        it('should get authors with custom metadata', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors";
            datastore.findAll(author_model_1.Author).subscribe(function (document) {
                expect(document).toBeDefined();
                expect(document.getModels().length).toEqual(1);
                expect(document.getMeta().meta.page.number).toEqual(1);
            });
            var findAllRequest = httpMock.expectOne(expectedUrl);
            findAllRequest.flush({
                data: [author_fixture_1.getAuthorData()],
                meta: {
                    page: {
                        number: 1,
                        size: 1,
                        total: 1,
                        last: 1
                    }
                }
            });
        });
        it('should get data with default metadata', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/books";
            datastore.findAll(book_model_1.Book).subscribe(function (document) {
                expect(document).toBeDefined();
                expect(document.getModels().length).toEqual(1);
                expect(document.getMeta().links[0]).toEqual('http://www.example.org');
            });
            var findAllRequest = httpMock.expectOne(expectedUrl);
            findAllRequest.flush({
                data: [book_fixture_1.getSampleBook(1, '1')],
                links: ['http://www.example.org']
            });
        });
        it('should fire error', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors";
            var dummyResponse = {
                errors: [
                    {
                        code: '100',
                        title: 'Example error',
                        detail: 'detailed error Message'
                    }
                ]
            };
            datastore.query(author_model_1.Author).subscribe(function (authors) { return fail('onNext has been called'); }, function (response) {
                expect(response).toEqual(jasmine.any(error_response_model_1.ErrorResponse));
                expect(response.errors.length).toEqual(1);
                expect(response.errors[0].code).toEqual(dummyResponse.errors[0].code);
                expect(response.errors[0].title).toEqual(dummyResponse.errors[0].title);
                expect(response.errors[0].detail).toEqual(dummyResponse.errors[0].detail);
            }, function () { return fail('onCompleted has been called'); });
            var queryRequest = httpMock.expectOne(expectedUrl);
            queryRequest.flush(dummyResponse, { status: 500, statusText: 'Internal Server Error' });
        });
        it('should generate correct query string for array params with findAll', function () {
            var expectedQueryString = 'arrayParam[]=4&arrayParam[]=5&arrayParam[]=6';
            var expectedUrl = encodeURI(datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/books?" + expectedQueryString);
            datastore.findAll(book_model_1.Book, { arrayParam: [4, 5, 6] }).subscribe();
            var findAllRequest = httpMock.expectOne(expectedUrl);
            findAllRequest.flush({ data: [] });
        });
        it('should generate correct query string for array params with query', function () {
            var expectedQueryString = 'arrayParam[]=4&arrayParam[]=5&arrayParam[]=6';
            var expectedUrl = encodeURI(datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/books?" + expectedQueryString);
            datastore.query(book_model_1.Book, { arrayParam: [4, 5, 6] }).subscribe();
            var queryRequest = httpMock.expectOne(expectedUrl);
            queryRequest.flush({ data: [] });
        });
        it('should generate correct query string for nested params with findAll', function () {
            var expectedQueryString = 'filter[text]=test123';
            var expectedUrl = encodeURI(datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/books?" + expectedQueryString);
            datastore.findAll(book_model_1.Book, { filter: { text: 'test123' } }).subscribe();
            var findAllRequest = httpMock.expectOne(expectedUrl);
            findAllRequest.flush({ data: [] });
        });
        it('should generate correct query string for nested array params with findAll', function () {
            var expectedQueryString = 'filter[text][]=1&filter[text][]=2';
            var expectedUrl = encodeURI(datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/books?" + expectedQueryString);
            datastore.findAll(book_model_1.Book, { filter: { text: [1, 2] } }).subscribe();
            var findAllRequest = httpMock.expectOne(expectedUrl);
            findAllRequest.flush({ data: [] });
        });
    });
    describe('findRecord', function () {
        it('should get author', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors/" + author_fixture_1.AUTHOR_ID;
            datastore.findRecord(author_model_1.Author, author_fixture_1.AUTHOR_ID).subscribe(function (author) {
                expect(author).toBeDefined();
                expect(author.id).toBe(author_fixture_1.AUTHOR_ID);
                expect(author.date_of_birth).toEqual(date_fns_1.parse(author_fixture_1.AUTHOR_BIRTH));
            });
            var findRecordRequest = httpMock.expectOne(expectedUrl);
            findRecordRequest.flush({ data: author_fixture_1.getAuthorData() });
        });
        it('should generate correct query string for array params with findRecord', function () {
            var expectedQueryString = 'arrayParam[]=4&arrayParam[]=5&arrayParam[]=6';
            var expectedUrl = encodeURI(datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/books/1?" + expectedQueryString);
            datastore.findRecord(book_model_1.Book, '1', { arrayParam: [4, 5, 6] }).subscribe();
            var findRecordRequest = httpMock.expectOne(expectedUrl);
            findRecordRequest.flush({ data: author_fixture_1.getAuthorData() });
        });
    });
    describe('saveRecord', function () {
        it('should create new author', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors";
            var author = datastore.createRecord(author_model_1.Author, {
                name: author_fixture_1.AUTHOR_NAME,
                date_of_birth: author_fixture_1.AUTHOR_BIRTH
            });
            author.save().subscribe(function (val) {
                expect(val.id).toBeDefined();
                expect(val.id).toEqual(author_fixture_1.AUTHOR_ID);
            });
            httpMock.expectNone(datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION);
            var saveRequest = httpMock.expectOne({ method: 'POST', url: expectedUrl });
            var obj = saveRequest.request.body.data;
            expect(obj.attributes).toBeDefined();
            expect(obj.attributes.name).toEqual(author_fixture_1.AUTHOR_NAME);
            expect(obj.attributes.dob).toEqual(date_fns_1.format(date_fns_1.parse(author_fixture_1.AUTHOR_BIRTH), 'YYYY-MM-DDTHH:mm:ssZ'));
            expect(obj.id).toBeUndefined();
            expect(obj.type).toBe('authors');
            expect(obj.relationships).toBeUndefined();
            saveRequest.flush({
                data: {
                    id: author_fixture_1.AUTHOR_ID,
                    type: 'authors',
                    attributes: {
                        name: author_fixture_1.AUTHOR_NAME,
                    }
                }
            }, { status: 201, statusText: 'Created' });
        });
        it('should throw error on new author with 201 response but no body', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors";
            var author = datastore.createRecord(author_model_1.Author, {
                name: author_fixture_1.AUTHOR_NAME
            });
            author.save().subscribe(function () { return fail('should throw error'); }, function (error) { return expect(error).toEqual(new Error('no body in response')); });
            var saveRequest = httpMock.expectOne({ method: 'POST', url: expectedUrl });
            saveRequest.flush(null, { status: 201, statusText: 'Created' });
        });
        it('should throw error on new author with 201 response but no data', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors";
            var author = datastore.createRecord(author_model_1.Author, {
                name: author_fixture_1.AUTHOR_NAME
            });
            author.save().subscribe(function () { return fail('should throw error'); }, function (error) { return expect(error).toEqual(new Error('expected data in response')); });
            var saveRequest = httpMock.expectOne({ method: 'POST', url: expectedUrl });
            saveRequest.flush({}, { status: 201, statusText: 'Created' });
        });
        it('should create new author with 204 response', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors";
            var author = datastore.createRecord(author_model_1.Author, {
                name: author_fixture_1.AUTHOR_NAME
            });
            author.save().subscribe(function (val) {
                expect(val).toBeDefined();
            });
            var saveRequest = httpMock.expectOne({ method: 'POST', url: expectedUrl });
            saveRequest.flush(null, { status: 204, statusText: 'No Content' });
        });
        it('should create new author with existing ToMany-relationship', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors";
            var author = datastore.createRecord(author_model_1.Author, {
                name: author_fixture_1.AUTHOR_NAME
            });
            author.books = [new book_model_1.Book(datastore, {
                    id: '10',
                    title: author_fixture_1.BOOK_TITLE
                })];
            author.save().subscribe();
            var saveRequest = httpMock.expectOne(expectedUrl);
            var obj = saveRequest.request.body.data;
            expect(obj.attributes.name).toEqual(author_fixture_1.AUTHOR_NAME);
            expect(obj.id).toBeUndefined();
            expect(obj.type).toBe('authors');
            expect(obj.relationships).toBeDefined();
            expect(obj.relationships.books.data.length).toBe(1);
            expect(obj.relationships.books.data[0].id).toBe('10');
            saveRequest.flush(null, { status: 204, statusText: 'No Content' });
        });
        it('should create new author with new ToMany-relationship', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors";
            var author = datastore.createRecord(author_model_1.Author, {
                name: author_fixture_1.AUTHOR_NAME
            });
            author.books = [datastore.createRecord(book_model_1.Book, {
                    title: author_fixture_1.BOOK_TITLE
                })];
            author.save().subscribe();
            var saveRequest = httpMock.expectOne(expectedUrl);
            var obj = saveRequest.request.body.data;
            expect(obj.attributes.name).toEqual(author_fixture_1.AUTHOR_NAME);
            expect(obj.id).toBeUndefined();
            expect(obj.type).toBe('authors');
            expect(obj.relationships).toBeDefined();
            expect(obj.relationships.books.data.length).toBe(0);
            saveRequest.flush(null, { status: 204, statusText: 'No Content' });
        });
        it('should create new author with new ToMany-relationship 2', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors";
            var author = datastore.createRecord(author_model_1.Author, {
                name: author_fixture_1.AUTHOR_NAME
            });
            author.books = [datastore.createRecord(book_model_1.Book, {
                    id: 123,
                    title: author_fixture_1.BOOK_TITLE
                }), datastore.createRecord(book_model_1.Book, {
                    title: "New book - " + author_fixture_1.BOOK_TITLE
                })];
            author.save().subscribe();
            var saveRequest = httpMock.expectOne(expectedUrl);
            var obj = saveRequest.request.body.data;
            expect(obj.id).toBeUndefined();
            expect(obj.relationships).toBeDefined();
            expect(obj.relationships.books.data.length).toBe(1);
            saveRequest.flush(null, { status: 204, statusText: 'No Content' });
        });
        it('should create new book with existing BelongsTo-relationship', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/books";
            var book = datastore.createRecord(book_model_1.Book, {
                title: author_fixture_1.BOOK_TITLE
            });
            book.author = new author_model_1.Author(datastore, {
                id: author_fixture_1.AUTHOR_ID
            });
            book.save().subscribe();
            var saveRequest = httpMock.expectOne(expectedUrl);
            var obj = saveRequest.request.body.data;
            expect(obj.attributes.title).toEqual(author_fixture_1.BOOK_TITLE);
            expect(obj.id).toBeUndefined();
            expect(obj.type).toBe('books');
            expect(obj.relationships).toBeDefined();
            expect(obj.relationships.author.data.id).toBe(author_fixture_1.AUTHOR_ID);
            saveRequest.flush(null, { status: 204, statusText: 'No Content' });
        });
    });
    describe('updateRecord', function () {
        it('should update author with 200 response (no data)', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors/" + author_fixture_1.AUTHOR_ID;
            var author = new author_model_1.Author(datastore, {
                id: author_fixture_1.AUTHOR_ID,
                attributes: {
                    date_of_birth: date_fns_1.parse(author_fixture_1.AUTHOR_BIRTH),
                    name: author_fixture_1.AUTHOR_NAME
                }
            });
            author.name = 'Rowling';
            author.date_of_birth = date_fns_1.parse('1965-07-31');
            author.save().subscribe(function (val) {
                expect(val.name).toEqual(author.name);
            });
            httpMock.expectNone(datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors");
            var saveRequest = httpMock.expectOne({ method: 'PATCH', url: expectedUrl });
            var obj = saveRequest.request.body.data;
            expect(obj.attributes.name).toEqual('Rowling');
            expect(obj.attributes.dob).toEqual(date_fns_1.format(date_fns_1.parse('1965-07-31'), 'YYYY-MM-DDTHH:mm:ssZ'));
            expect(obj.id).toBe(author_fixture_1.AUTHOR_ID);
            expect(obj.type).toBe('authors');
            expect(obj.relationships).toBeUndefined();
            saveRequest.flush({});
        });
        it('should update author with 204 response', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors/" + author_fixture_1.AUTHOR_ID;
            var author = new author_model_1.Author(datastore, {
                id: author_fixture_1.AUTHOR_ID,
                attributes: {
                    date_of_birth: date_fns_1.parse(author_fixture_1.AUTHOR_BIRTH),
                    name: author_fixture_1.AUTHOR_NAME
                }
            });
            author.name = 'Rowling';
            author.date_of_birth = date_fns_1.parse('1965-07-31');
            author.save().subscribe(function (val) {
                expect(val.name).toEqual(author.name);
            });
            httpMock.expectNone(datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors");
            var saveRequest = httpMock.expectOne({ method: 'PATCH', url: expectedUrl });
            var obj = saveRequest.request.body.data;
            expect(obj.attributes.name).toEqual('Rowling');
            expect(obj.attributes.dob).toEqual(date_fns_1.format(date_fns_1.parse('1965-07-31'), 'YYYY-MM-DDTHH:mm:ssZ'));
            expect(obj.id).toBe(author_fixture_1.AUTHOR_ID);
            expect(obj.type).toBe('authors');
            expect(obj.relationships).toBeUndefined();
            saveRequest.flush(null, { status: 204, statusText: 'No Content' });
        });
        it('should integrate server updates on 200 response', function () {
            var expectedUrl = datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors/" + author_fixture_1.AUTHOR_ID;
            var author = new author_model_1.Author(datastore, {
                id: author_fixture_1.AUTHOR_ID,
                attributes: {
                    date_of_birth: date_fns_1.parse(author_fixture_1.AUTHOR_BIRTH),
                    name: author_fixture_1.AUTHOR_NAME
                }
            });
            author.name = 'Rowling';
            author.date_of_birth = date_fns_1.parse('1965-07-31');
            author.save().subscribe(function (val) {
                expect(val.name).toEqual('Potter');
            });
            httpMock.expectNone(datastore_service_1.BASE_URL + "/" + datastore_service_1.API_VERSION + "/authors");
            var saveRequest = httpMock.expectOne({ method: 'PATCH', url: expectedUrl });
            var obj = saveRequest.request.body.data;
            expect(obj.attributes.name).toEqual('Rowling');
            expect(obj.attributes.dob).toEqual(date_fns_1.format(date_fns_1.parse('1965-07-31'), 'YYYY-MM-DDTHH:mm:ssZ'));
            expect(obj.id).toBe(author_fixture_1.AUTHOR_ID);
            expect(obj.type).toBe('authors');
            expect(obj.relationships).toBeUndefined();
            saveRequest.flush({
                data: {
                    id: obj.id,
                    attributes: {
                        name: 'Potter',
                    }
                }
            });
        });
    });
});
