const Command = require("../base/Command.js");
const {MessageEmbed} = require("discord.js");

class Description extends Command {
    constructor (client) {
        super(client, {
            name: "description",
            description: "Modifica la descripción de tu juego.",
            usage: "description nombre del juego",
            aliases: ["d", "dc", "dcrption"],
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
            .setDescription("¡Hola!\nAquí puedes modificar la descripción de tu juego.\nSimplemente debes escribir la nueva descripción aquí debajo.\nRecuerda, ¡no puede superar los 500 caractéres!\nEsta es la descripción actual:\n`"+game.info.description+"`")
            .setFooter("El uso incorrecto de esta función puede resultar en un baneo inmediato del sistema y comunidad.")
            const filter = m => m.author.id === message.author.id;
            message.channel.send(embed).then(() => {
                message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(async collected => {
                        if (collected.first().content.length > 500) return message.channel.send(`:x: | La descripción no puede superar los 500 caractéres.`);
                        this.client.gameSys.setGameValue(""+args+".info.description", collected.first().content);
                        message.channel.send(":white_check_mark: | La descripción de tu juego fue actualizada.");
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

module.exports = Description;