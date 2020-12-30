const Command = require("../base/Command.js");

class Vote extends Command {
    constructor (client) {
        super(client, {
            name: "vote",
            description: "Vota positiva o negativamente por un juego. Debes incluír un `-` entre argumentos.",
            usage: "vote up/down-nombre del juego",
            aliases: ["votar", "v"],
            category: "Usuario",
        });
    }

    async run (message, args, level) {
        try {
            args = args.join(" ").split("-")
            let gameSys = this.client.gameSys;
            if (!args[0]) return message.channel.send(":x: | ¿Votarás positivo (up) o negativo (down)?");
            console.log(args[0].toLowerCase() !== "up" || args[0].toLowerCase() !== "down")
            if (args[0].toLowerCase() === "up" || args[0].toLowerCase() === "down") {
                if (!args[1]) return message.channel.send(":x: | Ingresa el nombre de un juego.");
                let game = gameSys.getGame(args[1]);
                if (!game) return message.channel.send(":x: | El juego no existe.");
                if (game.accepted === false) return message.channel.send(":x: | Este juego está en proceso de aprobación.");
                if (game.info.votes.voters.includes(message.author.id)) return message.channel.send(":x: | Ya has votado por este juego.");
                if (args[0].toLowerCase() === "up") gameSys.addValue(""+args[1]+".info.votes.up", 1);
                if (args[0].toLowerCase() === "down") gameSys.addValue(""+args[1]+".info.votes.down", 1);
                gameSys.pushValue(""+args[1]+".info.votes.voters", message.author.id);
                message.channel.send(":white_check_mark: | ¡Tu voto fue añadido satisfactoriamente!")  
            } else return message.channel.send(":x: | Ese argumento no es válido.");
        } catch (e) {
            console.log(e);
        }
    }
};

module.exports = Vote;