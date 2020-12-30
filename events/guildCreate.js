module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (guild) {
      let gChan = guild.channels.resolveID("785921594253770793");
      let guildChan = guild.channels.resolve(gChan);
      guildChan.send(`**__Nuevo servidor__**\n${guild.name} (${guild.id}) con ${guild.memberCount - 1} miembros.`);
  }
};