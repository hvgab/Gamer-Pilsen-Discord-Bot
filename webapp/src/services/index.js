const users = require('./users/users.service.js');
const discordGuild = require('./discord-guild/discord-guild.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(discordGuild);
};
