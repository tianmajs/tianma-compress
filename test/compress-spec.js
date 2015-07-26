'use strict';

var http = require('http');
var compress = require('..');
var request = require('supertest');
var tianma = require('tianma');
var path = require('path');

function createApp() {
    var app = tianma();
    var server = http.createServer(app.run);

    app.server = server;

    return app;
}

describe('compress(type, type, ...)', function () {
    function createServer() {
        var app = createApp();

        app.use(function *(next) {
                var res = this.response;

                yield next;

                if (!res.head('content-encoding')) {
                    res.head('x-no-encoding', 'true');
                }
            })
            .use(compress('txt', 'css'))
            .use(function *(next) {
                this.response
                    .status(200)
                    .type(path.extname(this.request.pathname))
                    .data('hello');
            });

        return app.server;
    }

    it('should support gzip', function (done) {
        request(createServer())
            .get('/foo.txt')
            .set('accept-encoding', 'gzip')
            .expect(200)
            .expect('content-encoding', 'gzip')
            .expect('hello')
            .end(done);
    });

    it('should support deflate', function (done) {
        request(createServer())
            .get('/foo.txt')
            .set('accept-encoding', 'wtf, deflate')
            .expect(200)
            .expect('content-encoding', 'deflate')
            .expect('hello')
            .end(done);
    });

    it('should leave the other types alone', function (done) {
        request(createServer())
            .get('/foo.js')
            .set('accept-encoding', 'wtf, deflate')
            .expect(200)
            .expect('x-no-encoding', 'true')
            .expect('hello')
            .end(done);
    });

});

describe('compress([ type, type, ... ])', function () {
    function createServer() {
        var app = createApp();

        app.use(compress([ 'txt', 'css' ]))
            .use(function *(next) {
                this.response
                    .status(200)
                    .type(path.extname(this.request.pathname))
                    .data('hello');
            });

        return app.server;
    }

    it('should support array-style argument', function (done) {
        request(createServer())
            .get('/foo.css')
            .set('accept-encoding', 'gzip')
            .expect(200)
            .expect('content-encoding', 'gzip')
            .expect('hello')
            .end(done);
    });
});

describe('compress()', function () {
    function createServer() {
        var app = createApp();

        app.use(compress())
            .use(function *(next) {
                this.response
                    .status(200)
                    .type(path.extname(this.request.pathname))
                    .data('hello');
            });

        return app.server;
    }

    it('should make js the default type', function (done) {
        request(createServer())
            .get('/foo.js')
            .set('accept-encoding', 'gzip')
            .expect(200)
            .expect('content-encoding', 'gzip')
            .expect('hello')
            .end(done);
    });

    it('should make css the default type', function (done) {
        request(createServer())
            .get('/foo.css')
            .set('accept-encoding', 'gzip')
            .expect(200)
            .expect('content-encoding', 'gzip')
            .expect('hello')
            .end(done);
    });

    it('should make html the default type', function (done) {
        request(createServer())
            .get('/foo.html')
            .set('accept-encoding', 'gzip')
            .expect(200)
            .expect('content-encoding', 'gzip')
            .expect('hello')
            .end(done);
    });
});



