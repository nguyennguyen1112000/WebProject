'use strict'

const chai = require('chai')
const assert = chai.assert

const MergeArgs = require('../lib/merge-args')

describe('merge-args', function () {

    it('should merge args', function () {
        // create new merger with default options
        var mergeArgs = MergeArgs()
        // default object
        var config = {
            array: [],
            object: {
                array: [0],
                string: '',
            },
            string: '',
        }
        // merge
        mergeArgs(config, {
            array: [1],
            object: {
                array: [1],
            },
            string: 'foo',
        })
        // exepect args to have been merged to default
        assert.deepEqual(config, {
            array: [1],
            object: {
                array: [0,1],
                string: undefined,
            },
            string: 'foo',
        })
    })

    it('should merge args with config options', function () {
        // create new merger with default options
        var mergeArgs = MergeArgs({
            concatArrays: false,
            emptyStringUndefined: false,
        })
        // default object
        var config = {
            array: [],
            object: {
                array: [0],
                string: '',
            },
            string: '',
        }
        // merge
        mergeArgs(config, {
            array: [1],
            object: {
                array: [1],
            },
            string: 'foo',
        })
        // exepect args to have been merged to default
        assert.deepEqual(config, {
            array: [1],
            object: {
                array: [1],
                string: '',
            },
            string: 'foo',
        })
    })

    it('should throw error on invalid args', function () {
        // create new merger with default options
        var mergeArgs = MergeArgs()
        // should throw error
        assert.throws(function () {
            mergeArgs(null, {})
        })
        // should throw error
        assert.throws(function () {
            mergeArgs({foo: true}, null)
        })
    })

    it('should throw error on invalid arg property', function () {
        // create new merger with default options
        var mergeArgs = MergeArgs()
        // should throw error
        assert.throws(function () {
            mergeArgs({foo: true}, {test: true})
        })
    })

    it('should throw error on property type mismatch', function () {
        // create new merger with default options
        var mergeArgs = MergeArgs()
        // should throw error
        assert.throws(function () {
            mergeArgs({test: ''}, {test: true})
        })
    })

    it('should not throw error when target has no properties', function () {
        // create new merger with default options
        var mergeArgs = MergeArgs()
        // create empty target
        var config = {}
        // merging args to an empty argument should not throw error
        mergeArgs(config, {foo: 'bar'})
        // test result
        assert.deepEqual(config, {foo: 'bar'})
    })

})