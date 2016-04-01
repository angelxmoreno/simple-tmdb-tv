# Simple TMDB TV
An npm module for fetching TV information from TMDB.

## Installation

```sh
npm install simple-tmdb-tv --save
```

## Setup
Internally, the module uses requestify and the pouchdb caching transport. The caching can be turned off globally or per request.

To get started:

```js
var tmdb_tv = require('simple-tmdb-tv')([API-Key],[Options],[Cache Directory]);
```

## Configuration

### API-Key
_The API Key given to you by TMDB_.

You can obtain an [API key from TMDB](https://www.themoviedb.org/faq/api?language=en) here.
 ___
### Options
_Allows the modification of the default options object in requestify._
The default options object looks like this:

```js
var default_options = {
    method: 'GET',
    params: {
    },
    dataType: 'json',
    headers: {
        'User-Agent': 'Simple-TMDB-TV',
        cache: {
            cache: true,
            expires: 3600 // 1 hour
        }
    }
};
```
The value you pass for the options object will be merged with the above object. Combined, this will be the default options on every request made. These same options can be changed on a per-request call. 
___
### Cache Directory
**_The directory for the PouchDb database used by the caching engine._**

The default location is `./cache`
___

## API

```js
var tmdb_tv = require('./index')(process.env.tmdb_key);

//searching
tmdb_tv.search('Star Trek').then(function (response) {
    console.log('-------------------------------');
    console.log('Searching');
    var shows = response.results;
    shows.forEach(function (show) {
        console.log('ID# ', show.id, show.name);
    });
});

//show look up - you can pass the TMDB show id or the name of the show
tmdb_tv.fetchShow(2290).then(function (show) {
    console.log('-------------------------------');
    console.log('Fetching a Show');
    console.log('ID#', show.id, show.original_name);
});

//season look up - you can pass the TMDB show id or the name of the show
tmdb_tv.fetchSeason('Stargate Atlantis', 4).then(function (season) {
    console.log('-------------------------------');
    console.log('Fetching a Season');
    console.log('Air date', season.air_date + ' of ' + season.name);
});

//episode look up - you can pass the TMDB show id or the name of the show
tmdb_tv.fetchEpisode('Stargate Atlantis', 4, 5).then(function (episode) {
    console.log('-------------------------------');
    console.log('Fetching an Episode');
    console.log('Episode ' + episode.name + ' aired on ' + episode.air_date);
});
```



## Tests
```js
tmdb_key={Your Key} npm test
```