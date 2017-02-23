angular
  .module('MuSync')
  .filter('spotifyEmbedUrl', function ($sce) {
    return function(uri) {
      return $sce.trustAsResourceUrl(`https://embed.spotify.com/?uri=${uri}`);
    };
  });
