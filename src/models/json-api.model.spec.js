"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var date_fns_1 = require("date-fns");
var author_model_1 = require("../../test/models/author.model");
var author_fixture_1 = require("../../test/fixtures/author.fixture");
var book_model_1 = require("../../test/models/book.model");
var testing_2 = require("@angular/common/http/testing");
var datastore_service_1 = require("../../test/datastore.service");
var chapter_model_1 = require("../../test/models/chapter.model");
var datastore;
describe('JsonApiModel', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                testing_2.HttpClientTestingModule,
            ],
            providers: [
                datastore_service_1.Datastore
            ]
        });
        datastore = testing_1.TestBed.get(datastore_service_1.Datastore);
    });
    describe('constructor', function () {
        it('should be instantiated with attributes', function () {
            var DATA = {
                id: '1',
                attributes: {
                    name: 'Daniele',
                    surname: 'Ghidoli',
                    date_of_birth: '1987-05-25'
                }
            };
            var author = new author_model_1.Author(datastore, DATA);
            expect(author).toBeDefined();
            expect(author.id).toBe('1');
            expect(author.name).toBe('Daniele');
            expect(author.date_of_birth.getTime()).toBe(date_fns_1.parse('1987-05-25').getTime());
        });
        it('should be instantiated without attributes', function () {
            var author = new author_model_1.Author(datastore);
            expect(author).toBeDefined();
            expect(author.id).toBeUndefined();
            expect(author.date_of_birth).toBeUndefined();
        });
    });
    describe('syncRelationships', function () {
        var author;
        it('should return the object when there is no relationship included', function () {
            author = new author_model_1.Author(datastore, author_fixture_1.getAuthorData());
            expect(author).toBeDefined();
            expect(author.id).toBe(author_fixture_1.AUTHOR_ID);
            expect(author.books).toBeUndefined();
        });
        describe('parseHasMany', function () {
            it('should return the parsed relationships when one is included', function () {
                var BOOK_NUMBER = 4;
                var DATA = author_fixture_1.getAuthorData('books', BOOK_NUMBER);
                author = new author_model_1.Author(datastore, DATA);
                author.syncRelationships(DATA, author_fixture_1.getIncludedBooks(BOOK_NUMBER), 0);
                expect(author).toBeDefined();
                expect(author.id).toBe(author_fixture_1.AUTHOR_ID);
                expect(author.books).toBeDefined();
                expect(author.books.length).toBe(BOOK_NUMBER);
                author.books.forEach(function (book, index) {
                    expect(book instanceof book_model_1.Book).toBeTruthy();
                    expect(+book.id).toBe(index + 1);
                    expect(book.title).toBe(author_fixture_1.BOOK_TITLE);
                    expect(book.date_published.valueOf()).toBe(date_fns_1.parse(author_fixture_1.BOOK_PUBLISHED).valueOf());
                });
            });
            it('should parse infinite levels of relationships by reference', function () {
                var BOOK_NUMBER = 4;
                var DATA = author_fixture_1.getAuthorData('books', BOOK_NUMBER);
                author = new author_model_1.Author(datastore, DATA);
                datastore.addToStore(author);
                author.syncRelationships(DATA, author_fixture_1.getIncludedBooks(BOOK_NUMBER), 0);
                author.books.forEach(function (book, index) {
                    expect(book.author).toBeDefined();
                    expect(book.author).toEqual(author);
                    expect(book.author.books[index]).toEqual(author.books[index]);
                });
            });
            it('should return the parsed relationships when two nested ones are included', function () {
                var REL = 'books,books.chapters';
                var BOOK_NUMBER = 2;
                var CHAPTERS_NUMBER = 4;
                var DATA = author_fixture_1.getAuthorData(REL, BOOK_NUMBER);
                var INCLUDED = author_fixture_1.getIncludedBooks(BOOK_NUMBER, REL, CHAPTERS_NUMBER);
                author = new author_model_1.Author(datastore, DATA);
                author.syncRelationships(DATA, INCLUDED, 0);
                expect(author).toBeDefined();
                expect(author.id).toBe(author_fixture_1.AUTHOR_ID);
                expect(author.books).toBeDefined();
                expect(author.books.length).toBe(BOOK_NUMBER);
                author.books.forEach(function (book, index) {
                    expect(book instanceof book_model_1.Book).toBeTruthy();
                    expect(+book.id).toBe(index + 1);
                    expect(book.title).toBe(author_fixture_1.BOOK_TITLE);
                    expect(book.date_published.valueOf()).toBe(date_fns_1.parse(author_fixture_1.BOOK_PUBLISHED).valueOf());
                    expect(book.chapters).toBeDefined();
                    expect(book.chapters.length).toBe(CHAPTERS_NUMBER);
                    book.chapters.forEach(function (chapter, cindex) {
                        expect(chapter instanceof chapter_model_1.Chapter).toBeTruthy();
                        expect(chapter.title).toBe(author_fixture_1.CHAPTER_TITLE);
                        expect(chapter.book).toEqual(book);
                    });
                });
            });
            describe('update relationships', function () {
                it('should return updated relationship', function () {
                    var REL = 'books';
                    var BOOK_NUMBER = 1;
                    var CHAPTERS_NUMBER = 4;
                    var DATA = author_fixture_1.getAuthorData(REL, BOOK_NUMBER);
                    var INCLUDED = author_fixture_1.getIncludedBooks(BOOK_NUMBER);
                    var NEW_BOOK_TITLE = 'The Hobbit';
                    author = new author_model_1.Author(datastore, DATA);
                    author.syncRelationships(DATA, INCLUDED, 0);
                    INCLUDED.forEach(function (model) {
                        if (model.type === 'books') {
                            model.attributes.title = NEW_BOOK_TITLE;
                        }
                    });
                    author.syncRelationships(DATA, INCLUDED, 0);
                    author.books.forEach(function (book) {
                        expect(book.title).toBe(NEW_BOOK_TITLE);
                    });
                });
            });
        });
    });
});
