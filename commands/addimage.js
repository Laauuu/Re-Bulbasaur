const Command = require("../base/Command.js");
const {MessageEmbed} = require("discord.js");

class Addimage extends Command {
    constructor (client) {
        super(client, {
            name: "addimage",
            description: "Añade una imagen a la tarjeta de información de tu juego.",
            usage: "addimage nombre del juego",
            aliases: ["addi", "ai", "addimg"],
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
            .setThumbnail(game.info.image)
            .setDescription("¡Hola!\nAquí puedes modificar la imagen de la tarjeta de información de tu juego.\nPara actualizarla debes escribir el link debajo.\nRecuerda que debe comenzar con **https://** y termina con **.jpg/.png**\nLa imagen actual está anexada en este mensaje.")
            .setFooter("El uso incorrecto de esta función puede resultar en un baneo inmediato del sistema y comunidad.")
            const filter = m => m.author.id === message.author.id;
            message.channel.send(embed).then(() => {
                message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(async collected => {
                        if (collected.first().content.toLowerCase() === "reset") {
                            this.client.gameSys.pushValue(""+args+".info.image", "https://cdn.discordapp.com/avatars/783651272975974420/57c9d7c204376b5daa2ba698cef251a0.webp")
                            message.channel.send(`:white_check_mark: | ¡La imagen fue eliminada correctamente!`);
                            return;
                        }
                        console.log(!collected.first().content.endsWith(".jpg") && !collected.first().content.endsWith(".png"))
                        if (!collected.first().content.startsWith("https://")) return message.channel.send(":x: | El link debe comenzar con https://");
                        if (!collected.first().content.endsWith(".jpg") && !collected.first().content.endsWith(".png")) return message.channel.send(":x: | El link terminar con .jpg");
                        this.client.gameSys.setGameValue(""+args+".info.image", collected.first().content)
                        message.channel.send(`:white_check_mark: | ¡La imagen fue modificada correctamente!`);
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

module.exports = Addimage;