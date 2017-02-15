var fs = require('fs');
var os = require('os');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('spotify');
var keys = require('./keys.js');

var first = process.argv[2];
var second = process.argv[3];

//liri input arguments
function liri(arg2, arg3) {
    switch (arg2) {
        case "my-tweets":
            myTweets();
            break;
        case "spotify-this-song":
            spotifyThis(arg3)
            break;
        case "movie-this":
            movieThis(arg3)
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log(first + " : command is not valid");
    }
}

//last 20 tweets
//cant get to print out
function myTweets() {

    var twitterGet = new Twitter({
        consumer_key: keys.twitter_keys.consumer_key,
        consumer_secret: keys.twitter_keys.consumer_secret,
        access_token_key: keys.twitter_keys.access_token_key,
        access_token_secret: keys.twitter_keys.access_token_secret
    });

    var user = 'trippNC';
    var tweetCount = 20;

    twitterGet.get('statuses/user_timeline', {screen_name: user, count: tweetCount}, function(error, tweets) {

        if (error)
            throw error;
        else {
            var tweet_data = [];

            for ( i in tweets ) {
                var data = {
                        "Created"   : tweets[i].created_at,
                        "Tweet"     : tweets[i].text,
                        "Retweeted" : tweets[i].retweet_count,
                        "Favorited" : tweets[i].favorite_count
                        };
                tweet_data.push(data);
            }

            console.log("----------------------------");
            console.log(tweets.length);
            console.log("----------------------------");
        }
    });

}

//spotify
//not working
function spotifyThis(song) {

    var spotify_client = new Spotify({
        clientId    : keys.spotify_keys.client_id,
        clientSecret: keys.spotify_keys.client_secret
    });

    spotify_client.searchTracks(song).then(function(res) {


        var spotifyArray = [];
        var tracks = res.body.tracks.items;

        for ( i in tracks ) {
            var data = {
                    "Track"      : tracks[i].name,
                    "Album"      : tracks[i].album.name,
                    "Artist(s)"  : tracks[i].artists[0].name,
                    "Preview URL": tracks[i].preview_url
                    };
            spotifyArray.push(data);
        }


        var printSpotify = tracks.length;

        console.log("----------------------------");
        console.log(printSpotify);
        console.log("----------------------------");

    }, function(error) {
            console.error(error);
    });

}

//movie database not working
function movieThis(movie) {

    var query_url = 'http://www.omdbapi.com/?t=' + movie +'&y=&plot=long&tomatoes=true&r=json';

    request(query_url, function(error, res, body) {

       
            var movie_data = {
                "Title"                 : JSON.parse(body).Title,
                "Released"              : JSON.parse(body).Released,
                "Country"               : JSON.parse(body).Country,
                "Language(s)"           : JSON.parse(body).Language,
                "Actors"                : JSON.parse(body).Actors,
                "IMDB Rating"           : JSON.parse(body).imdbRating,
                "Rotten Tomatoes Rating": JSON.parse(body).tomatoRating,
                "Rotten Tomatoes URL"   : JSON.parse(body).tomatoURL,
                "Plot"                  : JSON.parse(body).Plot
            
            console.log("----------------------------");
            console.log(movie_data.Title);
            console.log("----------------------------");
        }
        else
            console.error(error);
    });


}

//random function
function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function(err, txt) {

        var randomArray = txt.split(',');
        var logic = randomArray[0];
        var print = randomArray[1];

        console.log(print);

        switch (logic) {
            case "my-tweets":
                myTweets();
                break;
            case "spotify-this-song":
                spotifyThis(print);
                break;
            case "movie-this":
                movieThis(print);
                break;
        }
    });

    
}



//Call Liri
liri(first, second);