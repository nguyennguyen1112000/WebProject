'use strict'

const ExpressHandlebarsMulti = require('../lib/express-handlebars-multi')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const assert = chai.assert

describe('express-handlebars-multi', function () {

    beforeEach(function () {
        // reset global data
        ExpressHandlebarsMulti.reset()
    })

    it('should create new handlebars engine', function () {
        // create new engine with default config
        var engine = ExpressHandlebarsMulti()
    })

    it('should load multiple partials and use first', function () {
        // create new engine
        var engine = ExpressHandlebarsMulti({
            layoutDirs: [__dirname+'/'+'bar/layouts', __dirname+'/'+'foo/layouts'],
            partialDirs: [__dirname+'/'+'foo/partials', __dirname+'/'+'bar/partials'],
        })
        // render template with engine
        return engine(__dirname+'/foo/views/foo.view.hbs', {})
        // check result
        .then(data => {
            assert.strictEqual(data, 'foo/foo/partial')
        })
    })

    it('should load multiple layouts and use first', function () {
        // create new engine
        var engine = ExpressHandlebarsMulti({
            layoutDirs: [__dirname+'/'+'bar/layouts', __dirname+'/'+'foo/layouts'],
            partialDirs: [__dirname+'/'+'foo/partials', __dirname+'/'+'bar/partials'],
        })
        // render template with engine
        return engine(__dirname+'/foo/views/foo.view.hbs', {
            layout: 'foo.layout',
        })
        // check result
        .then(data => {
            assert.strictEqual(data, 'bar/foo: foo/foo/partial')
        })
    })

    it('should use default layout', function () {
        // create new engine
        var engine = ExpressHandlebarsMulti({
            defaultLayout: 'foo.layout',
            layoutDirs: [__dirname+'/'+'bar/layouts', __dirname+'/'+'foo/layouts'],
            partialDirs: [__dirname+'/'+'foo/partials', __dirname+'/'+'bar/partials'],
        })
        // render template with engine
        return engine(__dirname+'/foo/views/foo.view.hbs', {})
        // check result
        .then(data => {
            assert.strictEqual(data, 'bar/foo: foo/foo/partial')
        })
    })

    it('should render layout with html in template', function () {
        // create new engine
        var engine = ExpressHandlebarsMulti({
            defaultLayout: 'foo.layout',
            layoutDirs: [__dirname+'/'+'bar/layouts', __dirname+'/'+'foo/layouts'],
            partialDirs: [__dirname+'/'+'bar/partials', __dirname+'/'+'foo/partials'],
        })
        // render template with engine
        return engine(__dirname+'/foo/views/foo.view.hbs', {})
        // check result
        .then(data => {
            assert.strictEqual(data, 'bar/foo: <h1>bar/foo/partial</h1>')
        })
    })

    it('should render template with params', function () {
        // create new engine
        var engine = ExpressHandlebarsMulti({
            defaultLayout: 'foo.layout',
            layoutDirs: [__dirname+'/'+'bar/layouts', __dirname+'/'+'foo/layouts'],
            partialDirs: [__dirname+'/'+'bar/partials', __dirname+'/'+'foo/partials'],
        })
        // render template with engine
        return engine(__dirname+'/bar/views/bar.view.hbs', {foo: 'bar'})
        // check result
        .then(data => {
            assert.strictEqual(data, 'bar/foo: bar/bar/partial bar')
        })
    })

    it('should set config', function () {
        // create new engine
        var engine = ExpressHandlebarsMulti({
            layoutDirs: [__dirname+'/'+'bar/layouts', __dirname+'/'+'foo/layouts'],
            partialDirs: [__dirname+'/'+'bar/partials', __dirname+'/'+'foo/partials'],
        })
        // set/get config
        ExpressHandlebarsMulti.config({defaultLayout: 'foo.layout'})
        // render template with engine
        return engine(__dirname+'/bar/views/bar.view.hbs', {foo: 'bar'})
        // check result
        .then(data => {
            assert.strictEqual(data, 'bar/foo: bar/bar/partial bar')
        })
    })

    it('should use helpers', function () {
        // create new engine
        var engine = ExpressHandlebarsMulti({
            helpers: {
                fooHelper: function (val) {
                    return 'foo'+val
                }
            },
        })
        // set/get config
        ExpressHandlebarsMulti.config({defaultLayout: 'foo.layout'})
        // render template with engine
        return engine(__dirname+'/foo/views/helper.view.hbs', {})
        // check result
        .then(data => {
            assert.strictEqual(data, 'footest')
        })
    })

})