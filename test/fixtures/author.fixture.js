"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var book_fixture_1 = require("./book.fixture");
exports.AUTHOR_ID = '1';
exports.AUTHOR_NAME = 'J. R. R. Tolkien';
exports.AUTHOR_BIRTH = '1892-01-03';
exports.AUTHOR_DEATH = '1973-09-02';
exports.AUTHOR_CREATED = '2016-09-26T21:12:40Z';
exports.AUTHOR_UPDATED = '2016-09-26T21:12:45Z';
exports.BOOK_TITLE = 'The Fellowship of the Ring';
exports.BOOK_PUBLISHED = '1954-07-29';
exports.CHAPTER_TITLE = 'The Return Journey';
function getAuthorData(relationship, total) {
    if (total === void 0) { total = 0; }
    var response = {
        id: exports.AUTHOR_ID,
        type: 'authors',
        attributes: {
            name: exports.AUTHOR_NAME,
            dob: exports.AUTHOR_BIRTH,
            date_of_death: exports.AUTHOR_DEATH,
            created_at: exports.AUTHOR_CREATED,
            updated_at: exports.AUTHOR_UPDATED
        },
        relationships: {
            books: {
                links: {
                    self: '/v1/authors/1/relationships/books',
                    related: '/v1/authors/1/books'
                }
            }
        },
        links: {
            self: '/v1/authors/1'
        }
    };
    if (relationship && relationship.indexOf('books') !== -1) {
        response.relationships.books.data = [];
        for (var i = 1; i <= total; i++) {
            response.relationships.books.data.push({
                id: '' + i,
                type: 'books'
            });
        }
    }
    return response;
}
exports.getAuthorData = getAuthorData;
function getIncludedBooks(totalBooks, relationship, totalChapters) {
    if (totalChapters === void 0) { totalChapters = 0; }
    var responseArray = [];
    var chapterId = 0;
    for (var i = 1; i <= totalBooks; i++) {
        var book = book_fixture_1.getSampleBook(i, exports.AUTHOR_ID);
        if (relationship && relationship.indexOf('books.chapters') !== -1) {
            book.relationships.chapters.data = [];
            for (var ic = 1; ic <= totalChapters; ic++) {
                chapterId++;
                book.relationships.chapters.data.push({
                    id: '' + chapterId,
                    type: 'chapters'
                });
                responseArray.push({
                    id: '' + chapterId,
                    type: 'chapters',
                    attributes: {
                        title: exports.CHAPTER_TITLE,
                        ordering: chapterId,
                        created_at: '2016-10-01T12:54:32Z',
                        updated_at: '2016-10-01T12:54:32Z'
                    },
                    relationships: {
                        book: {
                            links: {
                                self: '/v1/authors/288/relationships/book',
                                related: '/v1/authors/288/book'
                            },
                            data: {
                                id: '' + i,
                                type: 'books'
                            }
                        }
                    },
                    links: {
                        self: '/v1/authors/288'
                    }
                });
            }
        }
        responseArray.push(book);
    }
    return responseArray;
}
exports.getIncludedBooks = getIncludedBooks;
