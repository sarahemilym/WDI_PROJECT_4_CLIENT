https://accounts.spotify.com/authorize/?client_id=<client_id>&response_type=code&redirect_uri=<redirect_uri>&scope=playlist-modify-public%20playlist-modify-private

// Description
//   Allows the ability to add/remove/findTracks to a Spotify Playlist.
//
// Configuration:
//   SPOTIFY_APP_CLIENT_ID
//   SPOTIFY_APP_CLIENT_SECRET
//   SPOTIFY_USER_ID
//   SPOTIFY_PLAYLIST_ID
//   SPOTIFY_OAUTH_CODE
//   SPOTIFY_REDIRECT_URI

module.exports = function(robot) {
  var addTrack, authorizeApp, authorizeAppUser, findAndAddFirstTrack, findTrack, refreshAccessToken, removeTrack, requestInitialTokens;
  authorizeApp = function(res, func) {
    var data, encodedAppId;
    encodedAppId = new Buffer(process.env.SPOTIFY_APP_CLIENT_ID + ":" + process.env.SPOTIFY_APP_CLIENT_SECRET).toString('base64');
    data = "grant_type=client_credentials";
    return res.http("https://accounts.spotify.com/api/token").header("Authorization", "Basic " + encodedAppId).header('Content-Type', 'application/x-www-form-urlencoded').post(data)((function(_this) {
      return function(err, resp, body) {
        var response;
        response = JSON.parse(body);
        return func(res, response.access_token);
      };
    })(this));
  };
  requestInitialTokens = function(res, func) {
    var data, encodedAppId;
    encodedAppId = new Buffer(process.env.SPOTIFY_APP_CLIENT_ID + ":" + process.env.SPOTIFY_APP_CLIENT_SECRET).toString('base64');
    data = "grant_type=authorization_code&code=" + process.env.SPOTIFY_OAUTH_CODE + "&redirect_uri=" + process.env.SPOTIFY_REDIRECT_URI;
    return res.http("https://accounts.spotify.com/api/token").header("Authorization", "Basic " + encodedAppId).header('Content-Type', 'application/x-www-form-urlencoded').post(data)((function(_this) {
      return function(err, resp, body) {
        var response;
        response = JSON.parse(body);
        if (response.error) {
          res.send("An error occured, " + response.error_description);
        }
        robot.brain.set('access_token', response.access_token);
        robot.brain.set('refresh_token', response.refresh_token);
        robot.brain.set('expires', new Date().getTime() + (response.expires_in * 1000));
        return func(res);
      };
    })(this));
  };
  refreshAccessToken = function(res, func) {
    var data, encodedAppId;
    console.log('refreshAccessToken', robot);
    encodedAppId = new Buffer(process.env.SPOTIFY_APP_CLIENT_ID + ":" + process.env.SPOTIFY_APP_CLIENT_SECRET).toString('base64');
    data = "grant_type=refresh_token&refresh_token=" + robot.brain.get('refresh_token');
    return res.http("https://accounts.spotify.com/api/token").header("Authorization", "Basic " + encodedAppId).header('Content-Type', 'application/x-www-form-urlencoded').post(data)((function(_this) {
      return function(err, resp, body) {
        var response;
        response = JSON.parse(body);
        if (response.refresh_token) {
          robot.brain.set('refresh_token', response.refresh_token);
        }
        robot.brain.set('access_token', response.access_token);
        robot.brain.set('expires', new Date().getTime() + (response.expires_in * 1000));
        return func(res);
      };
    })(this));
  };
  authorizeAppUser = function(res, func) {
    if (robot.brain.get('access_token') !== null) {
      if ((new Date().getTime()) > robot.brain.get('expires')) {
        return refreshAccessToken(res, func);
      } else {
        return func(res);
      }
    } else {
      return requestInitialTokens(res, func);
    }
  };
  addTrack = function(res) {
    return res.http("https://api.spotify.com/v1/users/" + process.env.SPOTIFY_USER_ID + "/playlists/" + process.env.SPOTIFY_PLAYLIST_ID + "/tracks?uris=spotify%3Atrack%3A" + res.match[1]).header("Authorization", "Bearer " + robot.brain.get('access_token')).header('Content-Type', 'application/json').header('Accept', 'application/json').post()((function(_this) {
      return function(err, resp, body) {
        var response;
        response = JSON.parse(body);
        if (response.snapshot_id) {
          return res.send("Track added");
        }
      };
    })(this));
  };
  findAndAddFirstTrack = function(res, token) {
    return res.http("https://api.spotify.com/v1/search?q=" + res.match[1] + "&type=track&market=US&limit=1").header("Authorization", "Bearer " + token).header('Accept', 'application/json').get()((function(_this) {
      return function(err, resp, body) {
        var i, item, len, ref, response;
        response = JSON.parse(body);
        ref = response.tracks.items;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          res.match[1] = item.id;
        }
        return authorizeAppUser(res, addTrack);
      };
    })(this));
  };
  removeTrack = function(res) {
    var data;
    data = JSON.stringify({
      tracks: [
        {
          uri: "spotify:track:" + res.match[1]
        }
      ]
    });
    return res.http("https://api.spotify.com/v1/users/" + process.env.SPOTIFY_USER_ID + "/playlists/" + process.env.SPOTIFY_PLAYLIST_ID + "/tracks").header("Authorization", "Bearer " + robot.brain.get('access_token')).header('Content-Type', 'application/json')["delete"](data)((function(_this) {
      return function(err, resp, body) {
        var response;
        response = JSON.parse(body);
        if (response.snapshot_id) {
          return res.send("Track removed");
        }
      };
    })(this));
  };
  findTrack = function(res, token) {
    return res.http("https://api.spotify.com/v1/search?q=" + res.match[1] + "&type=track&market=US&limit=10").header("Authorization", "Bearer " + token).header('Accept', 'application/json').get()((function(_this) {
      return function(err, resp, body) {
        var i, item, len, ref, response, string;
        response = JSON.parse(body);
        string = "";
        ref = response.tracks.items;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          string = string + (item.name + " - " + item.artists[0].name + " - " + item.album.name + " - " + item.id + " \n");
        }
        return res.send(string);
      };
    })(this));
  };
  robot.hear(/playlist add (.*)/i, function(res) {
    return authorizeApp(res, findAndAddFirstTrack);
  });
  robot.hear(/playlist addid (.*)/i, function(res) {
    return authorizeAppUser(res, addTrack);
  });
  robot.hear(/playlist remove (.*)/i, function(res) {
    return authorizeAppUser(res, removeTrack);
  });
  return robot.hear(/playlist find (.*)/i, function(res) {
    return authorizeApp(res, findTrack);
  });
};

// ---
// generated by coffee-script 1.9.2
