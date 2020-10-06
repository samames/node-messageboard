const connectedUsers = {}; // username: socket

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

module.exports = { connectedUsers, getKeyByValue };
