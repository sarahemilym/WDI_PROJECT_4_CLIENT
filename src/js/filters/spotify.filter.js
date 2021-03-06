angular
  .module('MuSync')
  .filter('spotifyEmbedUrl', spotifyEmbedUrl);

spotifyEmbedUrl.$inject = ['$sce'];
function spotifyEmbedUrl($sce) {
  return function(uri) {
    return $sce.trustAsResourceUrl(`https://embed.spotify.com/?uri=${uri}`);
  };
}
