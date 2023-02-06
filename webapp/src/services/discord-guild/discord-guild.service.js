// Initializes the `discordGuild` service on path `/discord-guild`
const { DiscordGuild } = require('./discord-guild.class');
const createModel = require('../../models/discord-guild.model');
const hooks = require('./discord-guild.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/discord-guild', new DiscordGuild(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('discord-guild');

  service.hooks(hooks);
};
