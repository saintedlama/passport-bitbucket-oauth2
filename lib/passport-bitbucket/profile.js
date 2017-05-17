/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }

  return {
    id: json.uuid,
    displayName: json.display_name,
    username: json.username,
    profileUrl:  getProfileUrl(json),
  };
};

function getProfileUrl(json) {
  return json && json.links && json.links.html && json.links.html.href;
}
