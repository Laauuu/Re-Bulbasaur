const Command = require("../base/Command.js");
const {MessageEmbed} = require("discord.js");

class Download extends Command {
    constructor (client) {
        super(client, {
            name: "download",
            description: "Modifica el link de descarga de tu juego.",
            usage: "download nombre del juego",
            aliases: ["dw", "dwnld"],
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
            .setDescription("¡Hola!\nAquí puedes modificar el link de descarga de tu juego.\nSimplemente debes escribir el nuevo link aquí debajo.\nRecuerda, ¡debe comenzar con **https://**!\nPuedes eliminar el link de descarga escribiendo **reset**.\nEste es el link de descarga actual:\n`"+game.info.descarga+"`")
            .setFooter("El uso incorrecto de esta función puede resultar en un baneo inmediato del sistema y comunidad.")
            const filter = m => m.author.id === message.author.id;
            message.channel.send(embed).then(() => {
                message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(async collected => {
                        if (collected.first().content.toLowerCase() == "reset") {
                            this.client.gameSys.setGameValue(""+args+".info.descarga", "Este juego aún no posee un link de descarga.");
                            message.channel.send(":white_check_mark: | El link de descarga de tu juego fue eliminado.");
                            return;
                        }
                        if (!collected.first().content.startsWith("https://")) return message.channel.send(":x: | El link de descarga debe comenzar con https://");
                        if (collected.first().content.length > 150) return message.channel.send(`:x: | El link de descarga no puede superar los 150 caractéres.`);
                        this.client.gameSys.setGameValue(""+args+".info.descarga", collected.first().content);
                        message.channel.send(":white_check_mark: | El link de descarga de tu juego fue actualizado.");
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

module.exports = Download;