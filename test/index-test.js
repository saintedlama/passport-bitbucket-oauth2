var vows = require('vows');
var assert = require('assert');
var util = require('util');
var bitbucket = require('../lib/passport-bitbucket');


vows.describe('passport-bitbucket').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(bitbucket.version);
    },
  },
  
}).export(module);
