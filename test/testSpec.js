/* global require, process */

var exec = require('child_process').exec;
var expect = require('chai').expect;
var TmdbTv = require('../index');
var tmdb_key = process.env.tmdb_key;

var given_api_key = (new Date / 1000).toString();
var given_options = {
    method: 'PATCH',
    url: 'http://example.com/',
    headers: {
        'User-Agent': 'TMDB TV Node'
    }
};
var given_cache_dir = './foo-bar-cache-db';
var default_tmdbTv = new TmdbTv();
var modified_tmdbTv = new TmdbTv(given_api_key, given_options, given_cache_dir);
var tmdbTv = new TmdbTv(tmdb_key);

var show_name = 'Breaking Bad';
var show_id = 1396;
var season_id = 3572;
var episode_id = 62086;

describe('TmdbTv', function () {
    describe('Constructor', function () {
        it('Allows the API Key to be passed and used', function () {
            expect(modified_tmdbTv.default_options.params.api_key).to.equal(given_api_key);
            expect(default_tmdbTv.default_options.params.api_key).to.not.equal(given_api_key);
        });

        it('Allows default options to be modified', function () {
            expect(default_tmdbTv.default_options.method).to.not.equal(given_options.method);
            expect(default_tmdbTv.default_options.url).to.not.equal(given_options.url);
            expect(default_tmdbTv.default_options.headers['User-Agent']).to.not.equal(given_options.headers['User-Agent']);

            expect(modified_tmdbTv.default_options.method).to.equal(given_options.method);
            expect(modified_tmdbTv.default_options.url).to.equal(given_options.url);
            expect(modified_tmdbTv.default_options.headers['User-Agent']).to.equal(given_options.headers['User-Agent']);
        });

        it('Uses the default cache directory when none is passed', function () {
            expect(default_tmdbTv.cache_path).to.equal('./cache');
        });

        it('Uses allows the cache dir to be overwritten', function () {
            expect(modified_tmdbTv.cache_path).to.equal(given_cache_dir);
        });
    });
    describe('Searching shows', function () {
        it('Allows the searching of shows', function (done) {
            tmdbTv.search(show_name).then(function (response) {
                expect(response).contain.keys([
                    'page',
                    'results',
                    'total_results',
                    'total_pages'
                ]);
//                var actual = [
//                    {
//                        id: 1,
//                        name: 'foo'
//                    },
//                    {
//                        id: 9000,
//                        name: 'bar'
//                    }
//
//                ]
//
//                var expected = [{
//                        id: 9000
//                    }];
//                expect(actual).to.include.members(expected);
//                console.log(response.results)
                done();
            }).catch(done);

        });

        it('Allows the searching of shows ids', function (done) {
            tmdbTv.fetchShowId(show_name).then(function (response) {
                expect(response).to.equal(show_id);
                done();
            }).catch(done);

        });

        it('Allows the fetching of shows by name', function (done) {
            tmdbTv.fetchShow(show_name).then(function (response) {
                expect(response.id).to.equal(show_id);
                expect(response.original_name).to.equal(show_name);
                done();
            }).catch(done);
        });

        it('Allows the fetching of shows by id', function (done) {
            tmdbTv.fetchShow(show_id).then(function (response) {
                expect(response.id).to.equal(show_id);
                expect(response.original_name).to.equal(show_name);
                done();
            }).catch(done);
        });
    });
    describe('Searching Seasons', function () {
        it('Allows the fetching of season shows by season number', function (done) {
            tmdbTv.fetchSeason(show_name, 1).then(function (response) {
                expect(response.id).to.equal(season_id);
                expect(response.season_number).to.equal(1);
                done();
            }).catch(done);
        });
    });
    describe('Searching Episodes', function () {
        it('Allows the fetching of episodes by show, season number and episode number', function (done) {
            tmdbTv.fetchEpisode(show_name, 1, 2).then(function (response) {
                expect(response.id).to.equal(episode_id);
                expect(response.season_number).to.equal(1);
                expect(response.episode_number).to.equal(2);
                done();
            }).catch(done);
        });
    });
    after(function (done) {
        exec('rm -r ' + given_cache_dir, function (err, stdout, stderr) {
            done(err, stdout);
        });
    });
});