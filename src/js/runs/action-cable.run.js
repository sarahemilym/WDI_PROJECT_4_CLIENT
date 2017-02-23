angular
  .module('MuSync')
  .run(function (ActionCableConfig){
    ActionCableConfig.debug = true;
  });
