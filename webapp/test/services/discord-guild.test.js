const assert = require('assert');
const app = require('../../src/app');

describe('\'discordGuild\' service', () => {
  it('registered the service', () => {
    const service = app.service('discord-guild');

    assert.ok(service, 'Registered the service');
  });
});
