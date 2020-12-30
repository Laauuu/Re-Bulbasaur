const Command = require("../base/Command.js");
const { MessageEmbed } = require("discord.js");

class Aceptar extends Command {
    constructor (client) {
        super(client, {
            name: "aceptar",
            description: "Acepta un juego pendiente.",
            usage: "aceptar nombre del juego (respetando acentos y mayúsculas)",
            aliases: ["ac", "acpt"],
        });
    }

    async run (message, args, level) {
        try {
            if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(":x: | Este comando solo puede ser utilizado por miembros del staff");
            if (message.channel.id !== "784127694878146585") return message.channel.send(":x: | Este comando solo puede ser utilizado en el canal de staff de mi servidor.");

            args = args.join(" ");
            if (!args) return message.channel.send(":x: | Es necesario especificar el nombre del juego a aceptar.");
            let game = this.client.gameSys.getGame(args);
            if (!game) return message.channel.send(":x: | El juego no existe.");
            if (game.accepted === true) return message.channel.send(":x: | Este juego ya fue aceptado.");
            game.info.owners.map(u => this.client.users.fetch(u).then(r => { 
                const embedData = new MessageEmbed()
                .setColor("GREEN").setTitle("¡Tu juego ha sido aceptado!").setTimestamp()
                .setDescription(`¡**${args}** ya forma parte de nuestra **lista de juegos**!\n¡Quienes utilicen nuestro sistema lo conocerán y podrán ver toda la información del mismo!\n¿Qué información? Oh, no te lo he dicho...\n¡Ahora tienes acceso a funcionalidades de personalización para darle tu toque a la tarjeta de información de **${args}**!\n¡Recuerda acceder a [nuestro Discord](https://discord.gg/2pEDpvm8BG)!, podrás obtener ayuda, pedir recursos y muchísimo más.`)
                .setAuthor(r.username+", ", this.client.user.avatarURL({ dynamic: true }));
                this.client.gameSys.setGameValue(""+args+".accepted", true);
                this.client.users.resolve(r.id).send(embedData).catch(e => console.log("No puedo mandar mensajito a este usuario"));
            }).catch(err => console.log(err)));
            message.channel.send(`:white_check_mark: | ${args} ha sido aprobado con éxito.`);
            return;
        } catch (e) {
            console.log(e);
        }
    }
};

module.exports = Aceptar;