const Command = require("../base/Command.js");
const { MessageEmbed } = require("discord.js");

class Game extends Command {
    constructor (client) {
        super(client, {
            name: "game",
            description: "Busca un juego en nuestro base de datos. El nombre del juego debe respetar acentos y mayúsculas. Puedes utilizar `::search` en su lugar.",
            usage: "game nombre del juego",
            aliases: ["g"],
            category: "Usuario",
        });
    }

    async run (message, args, level) {
        try {
            args = args.join(" ");
            if (!args) return message.channel.send(":x: | Ingresa el nombre de un juego.")
            let game = this.client.gameSys.getGame(args);
            if (!game) return message.channel.send(":x: | El juego no existe.");
            if (game.accepted === false) return message.channel.send(":x: | Este juego está en proceso de aprobación.");
            let hasDownload = (game.info.descarga.startsWith("https://")) ? `[Click aquí](${game.info.descarga})` : "Este juego no posee un link de descarga visible.";
            let hasColabs = (game.info.colaboradores.length > 0) ? game.info.colaboradores.join(", ") : "Este juego no tiene colaboradores";
            const userPromises = game.info.owners.map((id) => this.client.users.fetch(id));
            const users = Promise.all(userPromises);
            let votePublic = (game.info.votes.public) ? `**__Votos__**:\n${game.info.votes.up} :thumbsup: | ${game.info.votes.down} :thumbsdown:` : `\nEl creador ocultó los votos.`                   
            const embedData = new MessageEmbed();
            embedData.setColor("GREEN").setTitle(args)
            .setDescription(`**__Descripción__**:\n${game.info.description}\n**__Creador/es__**:\n${await users}\n**__Colaborador/es__**:\n${hasColabs}\n**__Avances__**:\n${game.info.avances}\n**__Estado__**:\n${game.info.status}\n**__Descarga__**:\n${hasDownload}\n**__Votos__**:\n${votePublic}`)
            .setThumbnail(game.info.image);
            message.channel.send(embedData);
            return;
        } catch (e) {
            console.log(e);
        }
    }
};

module.exports = Game;