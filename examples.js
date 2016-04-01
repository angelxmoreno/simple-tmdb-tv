/* global process */

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