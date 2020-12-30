const Command = require("../base/Command.js");
const {MessageEmbed} = require("discord.js");

class Addowner extends Command {
    constructor (client) {
        super(client, {
            name: "addowner",
            description: "Añade un usuario a la lista de creadores del juego. Este podrá modificar la ficha del juego.",
            usage: "addowner",
            aliases: ["addo", "ao", "addown"],
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
            .setDescription("¡Hola!\nAquí puedes añadir **creadores** a tu juego.\nSimplemente debes mencionarlo aquí debajo.\n**¡ATENCIÓN!**\nQuien sea añadido tendrá el mismo poder que tú sobre el juego, es decir, podrá cambiar la descripción, link y/o modificar cualquier dato. **Te recomendamos añadir personas de confianza.**\n¡Utiliza la sección de colaboradores para añadir artistas, mappers y demás!")
            .setFooter("El uso incorrecto de esta función puede resultar en un baneo inmediato del sistema y comunidad.")
            const filter = m => m.author.id === message.author.id;
            message.channel.send(embed).then(() => {
                message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(async collected => {
                        if (!collected.first().mentions.users.first()) return message.channel.send(":x: | Debes mencionar un usuario.")
                        let arr = []
                        this.client.gameSys.pushValue(""+args+".info.owners", collected.first().mentions.users.first().id)
                        message.channel.send(`:white_check_mark: | ¡${collected.first().mentions.users.first().username} fue agregado correctamente!`)
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

module.exports = Addowner;