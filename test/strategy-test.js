const expect = require('chai').expect;
const nock = require('nock');
const noop = () => {};

const BitbucketStrategy = require('../lib/passport-bitbucket/strategy');

describe('strategy', function () {
  it('should be named bitbucket', function () {
    const strategy = new BitbucketStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, noop);

    expect(strategy.name).to.equal('bitbucket');
  });

  it('should load the user profile', function (done) {
    const strategy = new BitbucketStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, noop);

    const oauthProfile = nock('https://api.bitbucket.org')
      .get('/2.0/user')
      .reply(200, mockProfileReply);

    const oauthEmails = nock('https://api.bitbucket.org')
      .get('/2.0/user/emails')
      .reply(200, mockEmailsReply);

    strategy.userProfile('token', (err, profile) => {
      if (err) {
        return done(err);
      }

      expect(profile.id).to.exist;
      expect(profile.displayName).to.exist;
      expect(profile.username).to.exist;
      expect(profile.profileUrl).to.exist;

      oauthProfile.done();
      oauthEmails.done();

      done();
    });
  });

  it('should set raw and json property in user profile', function (done) {
    const strategy = new BitbucketStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, noop);

    const oauthProfile = nock('https://api.bitbucket.org')
      .get('/2.0/user')
      .reply(200, mockProfileReply);

    const oauthEmails = nock('https://api.bitbucket.org')
      .get('/2.0/user/emails')
      .reply(200, mockEmailsReply);

    strategy.userProfile('token', (err, profile) => {
      if (err) {
        return done(err);
      }

      expect(profile._raw).to.exist;
      expect(profile._json).to.exist;

      oauthProfile.done();
      oauthEmails.done();

      done();
    });
  });

  it('should load emails', function (done) {
    const strategy = new BitbucketStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, noop);

    const oauthProfile = nock('https://api.bitbucket.org')
      .get('/2.0/user')
      .reply(200, mockProfileReply);

    const oauthEmails = nock('https://api.bitbucket.org')
      .get('/2.0/user/emails')
      .reply(200, mockEmailsReply);

    strategy.userProfile('token', (err, profile) => {
      if (err) {
        return done(err);
      }

      expect(profile.emails).to.deep.equal([{
        primary: true,
        verified: true,
        value: 'nomail@please.com',
      }]);

      oauthProfile.done();
      oauthEmails.done();

      done();
    });
  });

  it('should not load emails when skipEmails option is set', function (done) {
    const strategy = new BitbucketStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret',
      skipEmails: true
    }, noop);

    const oauthProfile = nock('https://api.bitbucket.org')
      .get('/2.0/user')
      .reply(200, mockProfileReply);

    strategy.userProfile('token', (err, profile) => {
      if (err) {
        return done(err);
      }

      expect(profile.emails).to.not.exist;

      oauthProfile.done();

      done();
    });
  });

  it('should set raw and json property for emails', function (done) {
    const strategy = new BitbucketStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret',
    }, noop);

    const oauthProfile = nock('https://api.bitbucket.org')
      .get('/2.0/user')
      .reply(200, mockProfileReply);

    const oauthEmails = nock('https://api.bitbucket.org')
      .get('/2.0/user/emails')
      .reply(200, mockEmailsReply);

    strategy.userProfile('token', (err, profile) => {
      if (err) {
        return done(err);
      }

      expect(profile._rawEmails).to.exist;
      expect(profile._jsonEmails).to.exist;

      oauthProfile.done();
      oauthEmails.done();

      done();
    });
  });
});

const mockProfileReply = {
  "username": "saintedlama",
  "website": "",
  "display_name": "saintedlama NA",
  "account_id": "aaaa358:9e0b7167-4cd3-1aax-aaaa-000000000",
  "links": {
    "hooks": {
      "href": "https://api.bitbucket.org/2.0/users/saintedlama/hooks"
    },
    "self": {
      "href": "https://api.bitbucket.org/2.0/users/saintedlama"
    },
    "repositories": {
      "href": "https://api.bitbucket.org/2.0/repositories/saintedlama"
    },
    "html": {
      "href": "https://bitbucket.org/saintedlama/"
    },
    "followers": {
      "href": "https://api.bitbucket.org/2.0/users/saintedlama/followers"
    },
    "avatar": {
      "href": "https://bitbucket.org/account/saintedlama/avatar/32/"
    },
    "following": {
      "href": "https://api.bitbucket.org/2.0/users/saintedlama/following"
    },
    "snippets": {
      "href": "https://api.bitbucket.org/2.0/snippets/saintedlama"
    }
  },
  "created_on": "2016-12-11T09:56:33.491205+00:00",
  "is_staff": false,
  "location": null,
  "type": "user",
  "uuid": "{b1234567-1234-5678-12345678123456781}"
}

const mockEmailsReply = {
  "pagelen": 10,
  "values": [{
    "is_primary": true,
    "is_confirmed": true,
    "type": "email",
    "email": "nomail@please.com",
    "links": {
      "self": {
        "href": "https://api.bitbucket.org/2.0/user/emails/Christoph.Walcher@gmail.com"
      }
    }
  }],
  "page": 1,
  "size": 1
}