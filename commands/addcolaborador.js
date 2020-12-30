const Command = require("../base/Command.js");
const {MessageEmbed} = require("discord.js");

class Addcolaborador extends Command {
    constructor (client) {
        super(client, {
            name: "addcolaborador",
            description: "Añade un usuario a la lista de colaboradores del juego. Las personas que añadas no puedrán modificar la ficha del juego.",
            usage: "addcolaborador nombre del juego",
            aliases: ["addc", "ac", "addcolab"],
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
            .setDescription("¡Hola!\nAquí puedes añadir colaboradores a tu juego.\nSimplemente debes escribir su nombre aquí debajo.\nNo es necesaria una mención, sino un texto plano.\nUn buen uso de este comando sería: `Helio`.\nEsto añadiría el nombre **Helio** a mi lista de colaboradores.")
            .setFooter("El uso incorrecto de esta función puede resultar en un baneo inmediato del sistema y comunidad.")
            const filter = m => m.author.id === message.author.id;
            message.channel.send(embed).then(() => {
                message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(async collected => {
                        if (!collected.first().length > 30) return message.channel.send(":x: | El nombre no puede superar los 25 caractéres.")
                        this.client.gameSys.pushValue(""+args+".info.colaboradores", collected.first().content)
                        message.channel.send(`:white_check_mark: | ¡${collected.first().content} fue agregado correctamente!`)
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

module.exports = Addcolaborador;