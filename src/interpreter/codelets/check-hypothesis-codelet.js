var CheckHypothesisCodelet = function(coderack, hyp) {
  this.coderack = coderack;
  this.ws = this.coderack.ws;
  this.followup = [];
  this.hypothesis = hyp;
}

CheckHypothesisCodelet.prototype.name = 'check hyp';

CheckHypothesisCodelet.prototype.describe = function() {
  return 'CheckHypothesisCodelet';
}

CheckHypothesisCodelet.updateObjectSelectorArrays = function(group, sel) {
  if (sel.is_reference_selector) throw "this should not happen!";
  for (var j=0; j<group.objs.length; j++) {
    var on = group.objs[j].object_node;
    // the following check should be needed for the blank selector only, which
    // is initially applied to all scenes, as all other selectors are only
    // applied once to each scene and their result gets cached
    if (on.selectors.indexOf(sel) !== -1) throw "duplicate selector!";
    on.selectors.push(sel);
  }
}

CheckHypothesisCodelet.prototype.removeFromSelectorArrays = function(sel) {
  var remove_el = function(array, el) {
    var idx = array.indexOf(el);
    if (idx !== -1) array.splice(idx, 1);
  }

  this.ws.forEachScene(function(sn) {
    for (var i=0; i<sn.objs.length; i++) remove_el(sn.objs[i].selectors, sel);
    for (var i=0; i<sn.groups.length; i++) remove_el(sn.groups[i].selectors, sel);
  });
}

CheckHypothesisCodelet.prototype.run = function() {
  var hyp = this.hypothesis;
  var options = this.ws.options;
  var scene_pair_id = this.ws.scene_pair_index;
  if (!hyp) {
    // get a hypothesis that was not matched against the current scene pair yet
    hyp = this.ws.getRandomHypothesis({filter:
      function(sol) {
        return (!sol.wasMatchedAgainst(scene_pair_id))
      }
    });
  }
  if (!hyp) return false;
  this.ws.log(3, 'checking hyp "'+ hyp.describe()+'"');

  var scenes = this.ws.getActiveScenePair();
  var was_pot_sol = hyp.isPotentialSolution();
  var side = hyp.main_side;
  var selected_groups = hyp.checkScenePair(scenes, this.ws.scene_pair_index);

  var is_pot_sol = hyp.isPotentialSolution();
  if (was_pot_sol && !is_pot_sol) {
    if (hyp.adjustThresholds(side, this.ws.left_scenes, this.ws.right_scenes)) {
      this.removeFromSelectorArrays(hyp.sel);
      hyp.reset();
      hyp.sel.cached_results = [];
      selected_groups = hyp.checkScenePair(scenes, this.ws.scene_pair_index);
    }
  }
  this.ws.log(3, 'hyp after checking now is: "'+ hyp.describe()+'"');
  if (hyp.main_side === 'fail') {
    this.removeFromSelectorArrays(hyp.sel);
    return true;
  }
  for (var i=0; i<selected_groups.length; i++) {
    if (selected_groups[i].length > 0 && selected_groups[i].scene_node.groups.indexOf(selected_groups[i]) === -1) throw "this should not happen";
    this.ws.addGroup(selected_groups[i]);
    CheckHypothesisCodelet.updateObjectSelectorArrays(selected_groups[i], hyp.sel);
  }

  if (hyp.isSolution(this.ws.scene_pair_sequence.length)) this.ws.addSolution(hyp);

  return true;
}
