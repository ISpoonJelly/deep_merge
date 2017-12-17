module.exports = function(dict1, dict2, decision_func) {
  if (!dict1 || !dict2) {
    return null;
  }
  if (!Object.keys(dict1).length) {
    return dict2;
  }
  if (!Object.keys(dict2).length) {
    return dict1;
  }

  return merge(dict1, dict2, decision_func);
};

function merge(dict1, dict2, decision_func) {
  var result = {};
  var collisions = [];

  for (var attr in dict1) {
    if (dict2[attr]) {
      collisions.push(attr);
    } else {
      result[attr] = dict1[attr];
    }
  }

  for (var attr in dict2) {
    if (!dict1[attr]) {
      result[attr] = dict2[attr];
    }
  }

  for (var current of collisions) {
    if (
      typeof dict1[current] === "object" &&
      typeof dict2[current] === "object"
    ) {
      result[current] = merge(dict1[current], dict2[current], decision_func);
    } else {
      if (decision_func) {
        result[current] = decision_func(dict1[current], dict2[current]);
      } else {
        result[current] = dict1[current];
      }
    }
  }

  return result;
}
