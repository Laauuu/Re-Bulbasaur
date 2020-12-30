const Command = require("../base/Command.js");
const { MessageEmbed } = require("discord.js");

class Allgames extends Command {
    constructor (client) {
        super(client, {
            name: "allgames",
            description: "Envía una lista de todos los juegos a tus mensajes privados. Si tienes permiso de administrador, tendrás la opción de enviarlo a un canal de texto de tú servidor.",
            usage: "allgames [server]",
            aliases: ["allg"],
            category: "Usuario",
        });
    }

    async run (message, args, level) {
        try {
            let allGames = this.client.gameSys.getAllGames();
            let arr = new Array();
            Object.keys(allGames).forEach(x => {
                arr.push(allGames[x].ID);
            });
            arr.forEach(x => {
                if (this.client.gameSys.getGame(x).accepted === false) {
                    arr = arr.filter(function(value, index, arr){ 
                        return value !== x;
                    });
                }
            });
            let arr2 = new Array();
            if (arr.length > 240) {
                arr2 = arr = arr.slice(241, arr.length+1);
                console.log("Se registraron más de 240 juegos.");
                const embed2 = new MessageEmbed().setColor("GREEN").setFooter("¿Tu juego no está aquí? ¡Registralo!")
                .setDescription(arr2.sort().join("\n"))
            }
            const embed = new MessageEmbed().setTitle("Lista de juegos registrados").setTimestamp()
            .setColor("GREEN").setAuthor(this.client.user.username, this.client.user.avatarURL({dynamic: true})).setFooter("¿Tu juego no está aquí? ¡Registralo!")
            .setDescription(arr.sort().join("\n"))
            if (message.member.hasPermission('MANAGE_MESSAGES') && args[0] === "server") {
                return message.channel.send(embed)
                //Cuando se registren 200 juegos, añadir aquí el message.send
            } else {
                return this.client.users.resolve(message.author.id).send(embed).catch(e => message.channel.send(":x: | <@"+message.author.id+">, tienes los mensajes privados desactivados. No puedo enviar la lista de juegos."));
            }
        } catch (e) {
            console.log(e);
        }
    }
};

module.exports = Allgames;