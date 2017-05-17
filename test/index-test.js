const expect = require('chai').expect;
const bitbucket = require('../lib/passport-bitbucket');

describe('passport-bitbucket-oauth20', function() {
  it('should report a version', function() {
    expect(bitbucket.version).to.be.a('string');
  });

});
