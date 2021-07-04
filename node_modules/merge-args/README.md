# merge-args

Simple extended merge function that merges an args object over a target object
with defaults specified and performs type checking.

## Creating a new merge function with default options

    const MergeArgs = require('merge-args')

    var mergeArgs = MergeArgs()

    var defaults = {
        foo: 'bar'
    }

    mergeArgs(defaults, {foo: 'bam'})

    // defaults: {foo: bam}

## Merge options

    var mergeArgs = MergeArgs({
        concatArrays: false,
        emptyStringUndefined: false,
    })

Default merge options can be overridden by passing options when creating a new
merge function.

All options have a default of true but can be set to false.

### concatArrays

When merging arrays concatenate. When set to false arrays will be replaced.

### emptyStringUndefined

Convert empty strings to undefined after merge complete.