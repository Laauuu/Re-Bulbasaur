const Command = require("../base/Command.js");
const { MessageEmbed } = require("discord.js");

class Guia extends Command {
    constructor (client) {
        super(client, {
            name: "guia",
            description: "Muestra mi guía de uso.",
            usage: "guia",
            aliases: ["guide", "gi"],
            category: "Usuario",
        });
    }

    async run (message, args, level) {
        try {
            if (message.member.hasPermission('MANAGE_MESSAGES')) {
                const embed = new MessageEmbed().setColor("GREEN").setTimestamp().setTitle("Guía de uso").setFooter("Desarrollado con ♥ por Lau#9565, Mimilena#9032 y Galen#2359")
                .setAuthor(this.client.user.username, this.client.user.avatarURL({dynamic: true}))
                .setDescription("**¡Hola!**, permíteme explicarte lo básico sobre mí.\n" +
                "Debes escribir `::addgame` en mensajes privados. Abriré el asistente y te acompañaré durante el proceso de registro.\n" +
                "Deberás ingresar el **nombre** y un **link de avances** (donde muestras el progreso de tu juego), como twitter, ¡ténlo a mano!\n" +
                "Una vez terminado el proceso, generaré una solicitud y la enviaré a mi Discord central. Un miembro del staff verá tu juego y decidirá si aprobarlo o no.\n" +
                "¡Tranquilo/a!\n" +
                "El proceso es muy rápido, no debería tomar más de 30 minutos, pero te pedimos paciencia.\n" +
                "En caso de que tu juego sea aprobado, desbloquearás el apartado de **Gestión de juegos** de mi comando **::help**.\n" +
                "Allí podrás conocer todas las **acciones** que podrás realizar sobre la **ficha de tu juego**, por ejemplo, cambiar la **descripción**, el **estado** (beta, completo, etc), ¡e incluso **añadir una imagen**!\n" +
                "\nEn caso de presentar alguna duda, puedes unirte a [nuestro Discord](https://discord.gg/2pEDpvm8BG). Intentaremos responderte lo antes posible.\n" +
                "\nSi quieres añadirme a tu servidor, puedes hacerlo mediante [este link](https://discord.com/api/oauth2/authorize?client_id=783651272975974420&permissions=8&scope=bot).");
                message.channel.send(embed);
                return;
            } else {
                return message.channel.send(":x: | Envíame un mensaje privado para obtener la guía.");
            }    
        } catch (e) {
            console.log(e);
        }
    }
};

module.exports = Guia;