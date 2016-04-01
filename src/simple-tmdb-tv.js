/* global module */

var merge = require('merge');
var Promise = require('bluebird');
var requestify = require('requestify');

function buildError(err) {
    var errObj = new Error();
    if (err.getBody() && err.getBody().errors.length === 1) {
        errObj.name = 'TMDB Error';
        errObj.message = err.getBody().errors[0];
        errObj.code = err.code;
    } else {
        errObj.name = 'TMDB TV Node Error';
        errObj.message = err.body;
        errObj.code = err.code;
    }
    return errObj;
}

function ThrowError(err) {
    throw buildError(err);
}

module.exports = function (api_key, options, cache_path) {
    cache_path = cache_path || './cache'
    options = options || {};
    var default_options = {
        method: 'GET',
        params: {
            api_key: api_key
        },
        dataType: 'json',
        headers: {
            'User-Agent': 'Simple-TMDB-TV',
            cache: {
                cache: true, // Will set caching to true for this request.
                expires: 3600 // Time for cache to expire in seconds
            }
        }
    };
    default_options = merge.recursive(true, default_options, options);
    requestify.cacheTransporter(require('requestify-pouchdb')(cache_path));

    function fetchEpisode(show, season_number, epiode_number, params, options) {
        params = params || {
            append_to_response: 'credits,images,rating,videos'
        };
        return fetchShowId(show).then(function (show_id) {
            var uri = '/tv/' + show_id + '/season/' + season_number + '/episode/' + epiode_number;
            return http(uri, params, options);
        });
    }

    function fetchSeason(show, season_number, params, options) {
        params = params || {
            append_to_response: 'credits,images,videos'
        };
        return fetchShowId(show).then(function (show_id) {
            var uri = '/tv/' + show_id + '/season/' + season_number;
            return http(uri, params, options);
        });
    }

    function fetchShow(show, params, options) {
        params = params || {
            append_to_response: 'content_ratings,credits,images,keywords,rating,videos'
        };
        return fetchShowId(show, params, options).then(function (show_id) {
            var uri = '/tv/' + show_id;
            return http(uri, params, options);
        });
    }

    function fetchShowId(show_name, options) {
        if (parseInt(show_name) == show_name) {
            return Promise.resolve(show_name);
        }
        return search(show_name, undefined, options).then(function (response) {
            if (response.results.length === 0) {
                ThrowError({
                    code: 404,
                    message: 'show ' + show_name + ' could not be found'
                });
            }
            return response.results[0].id;
        });
    }

    function search(query, params, options) {
        var uri = '/search/tv';
        params = params || {};
        params.query = query;
        return http(uri, params, options);
    }

    function http(uri, params, options) {
        options = options || {};
        options.params = params || {};

        options = merge.recursive(true, options, default_options);
        url = 'https://api.themoviedb.org/3' + uri;
        return requestify.request(url, options).then(function (response) {
            var body = response.getBody();
            body.limits = {
                limit: parseInt(response.getHeader('x-ratelimit-limit')),
                remaining: parseInt(response.getHeader('x-ratelimit-remaining')),
                reset: parseInt(response.getHeader('x-ratelimit-reset'))
            };
            return body;
        }).catch(ThrowError);
    }

    return {
        search: search,
        fetchShowId: fetchShowId,
        fetchShow: fetchShow,
        fetchSeason: fetchSeason,
        fetchEpisode: fetchEpisode,
        default_options: default_options,
        cache_path: cache_path
    };
};