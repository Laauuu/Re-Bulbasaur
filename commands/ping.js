const Command = require("../base/Command.js");

class Ping extends Command {
    constructor (client) {
        super(client, {
            name: "ping",
            description: "Tiempo de respuesta de latencia y API.",
            usage: "ping",
            aliases: ["pong"],
            category: "Usuario",
        });
    }

    async run (message, args, level) {
        try {
            const msg = await message.channel.send("🏓 Ping!");
            msg.edit(`🏓 Pong! (Tiempo de respuesta: ${msg.createdTimestamp - message.createdTimestamp}ms.Tengo ${Math.round(this.client.ws.ping)}ms.)`);
            this.client.gameSys.setGameValue("Pokémon Nuevos Horizontes.info.votes.public", false)
        } catch (e) {
            console.log(e);
        }
    }
};

module.exports = Ping;