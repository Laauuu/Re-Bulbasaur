const Command = require("../base/Command.js");

class VoteStatus extends Command {
    constructor (client) {
        super(client, {
            name: "votestatus",
            description: "Cambia la visibilidad de los votos.",
            usage: "votestatus juego",
            aliases: ["vts", "bts"],
            category: "Usuario",
        });
    }

    async run (message, args, level) {
        try {
            args = args.join(" ");
            if (!args) return message.channel.send(":x: | Ingresa el nombre de un juego.");
            let game = this.client.gameSys.getGame(args);
            if (!game) return message.channel.send(":x: | El juego no existe.");
            if (game.accepted === false) return message.channel.send(":x: | Este juego está en proceso de aprobación.");
            if (!game.info.owners.includes(message.author.id)) return message.channel.send(":x: | Este juego no es de tu propiedad. Si esto es un error, contacta con un administrador.");
            let publicGame = game.info.votes.public;
            if (publicGame) {
                publicGame = false;
            } else if (!publicGame) {
                publicGame = true;
            }
            this.client.gameSys.setGameValue(""+args+".info.votes.public", publicGame);
            message.channel.send(":white_check_mark: | La visibilidad fue modificada correctamente a "+publicGame)
        } catch (e) {
            console.log(e);
        }
    }
};

module.exports = VoteStatus;