const Command = require("../base/Command.js");

class Reload extends Command {
  constructor (client) {
    super(client, {
      name: "reload",
      description: "Recarga un módulo.",
      usage: "reload [módulo]",
      aliases: ["rld"],
      permLevel: "Bot Owner"
    });
  }

  async run (message, args, level) {
    if (!args || args.size < 1) return;
    
    const commands = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]));
    if (!commands) return message.reply(`El comando \`${args[0]}\` no existe.`);

    let response = await this.client.unloadCommand(commands.conf.location, commands.help.name);
    if (response) return message.reply(`Error descargando: ${response}`);

    response = this.client.loadCommand(commands.conf.location, commands.help.name);
    if (response) return message.reply(`Error recargando: ${response}`);

    message.reply(`El comando \`${commands.help.name}\` ha sido recargado.`);
  }
}
module.exports = Reload;