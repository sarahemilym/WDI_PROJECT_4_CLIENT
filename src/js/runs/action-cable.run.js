angular
  .module('MuSync')
  .run(ActionCable);

ActionCable.$inject = ['ActionCableConfig'];
function ActionCable(ActionCableConfig){
  ActionCableConfig.debug = true;
}
