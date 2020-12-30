const Command = require("../base/Command.js");
const {MessageEmbed} = require("discord.js");

class Status extends Command {
    constructor (client) {
        super(client, {
            name: "status",
            description: "Modifica el estado de tu juego.",
            usage: "status nombre del juego",
            aliases: ["st", "stus"],
            category: "Gestión de juegos",
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
            const embed = new MessageEmbed()
            .setColor("GREEN").setTimestamp().setAuthor(this.client.user.username, this.client.user.avatarURL({ dynamic: true })).setTitle("¡Asistente de configuración!")
            .setDescription("¡Hola!\nAquí puedes modificar el estado de tu juego.\nLas opciones disponibles son: **Sin Beta, Alpha Nº, Beta Nº, Completo, Reset**.\nEstado actual:\n`"+game.info.status+"`")
            .setFooter("El uso incorrecto de esta función puede resultar en un baneo inmediato del sistema y comunidad.")
            const filter = m => m.author.id === message.author.id;
            message.channel.send(embed).then(() => {
                message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(async collected => {
                        let arr = ["sin beta", "completo", "reset"];
                        if (collected.first().content.toLowerCase().includes("beta") || collected.first().content.toLowerCase().includes("alpha")) arr.push(collected.first().content.toLowerCase());
                        console.log(arr)
                        if (!arr.includes(collected.first().content.toLowerCase())) return message.channel.send(`:x: | Debes elegir una opción de las listadas anteriormente.`);
                        if (collected.first().content.toLowerCase() === "reset") {
                            this.client.gameSys.setGameValue(""+args+".info.status", "El creador no asignó un estado a este juego.");
                            message.channel.send(":white_check_mark: | El estado de tu juego fue actualizado.");
                            return;  
                        }
                        this.client.gameSys.setGameValue(""+args+".info.status", collected.first().content);
                        message.channel.send(":white_check_mark: | El estado de tu juego fue actualizado.");
                        return;
                    })
                    .catch(collected => {
                        message.channel.send('¡Hubo un error o el tiempo terminó!');
                        console.log(collected)
                    });
            });   
        } catch (e) {
            console.log(e);
        }
    }
};

module.exports = Status;