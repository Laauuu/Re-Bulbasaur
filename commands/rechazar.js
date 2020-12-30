const Command = require("../base/Command.js");
const { MessageEmbed } = require("discord.js");

class Rechazar extends Command {
    constructor (client) {
        super(client, {
            name: "rechazar",
            description: "Rechaza un juego pendiente.",
            usage: "rechazar nombre del juego (respetando acentos y mayúsculas)",
            aliases: ["rc", "rczr"],
        });
    }

    async run (message, args, level) {
        try {
            if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(":x: | Este comando solo puede ser utilizado por miembros del staff");
            if (message.channel.id !== "784127694878146585") return message.channel.send(":x: | Este comando solo puede ser utilizado en el canal de staff de mi servidor.");

            args = args.join(" ");
            if (!args) return message.channel.send(":x: | Es necesario especificar el nombre del juego a aceptar.");
            let game = this.client.gameSys.getGame(args);
            if (!game) return message.channel.send(":x: | El juego no existe en la base de datos.");
            game.info.owners.map(u => this.client.users.fetch(u).then(r => { 
                const embedData = new MessageEmbed()
                .setColor("RED").setTitle("Tu juego ha sido rechazado... 😢").setTimestamp()
                .setDescription(`¡Lamentamos que esta sea nuestra decisión!\nTu juego no cumple con los requisitos mínimos para ser aceptado.\n¡Tranquilo!\nPuedes volver a intentarlo cuando desees, pero asegúrate de tener todo en regla para no obtener este resultado otra vez.\nSi todavía tienes alguna duda sobre nuestra decisión, puedes preguntar en [nuestro Discord](https://discord.gg/2pEDpvm8BG).`)
                .setAuthor(r.username+", ", this.client.user.avatarURL({ dynamic: true }));
                this.client.gameSys.deleteGame(args);
                this.client.users.resolve(r.id).send(embedData).catch(e => console.log("No puedo mandar mensajito a este usuario"));
            }).catch(err => console.log(err)));
            message.channel.send(`:white_check_mark: | ${args} ha sido rechazado con éxito.`);
            return;
        } catch (e) {
            console.log(e);
        }
    }
};

module.exports = Rechazar;