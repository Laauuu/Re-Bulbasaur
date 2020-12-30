const Command = require("../base/Command.js");
const {MessageEmbed} = require("discord.js");

class Help extends Command {
    constructor (client) {
        super(client, {
            name: "help",
            description: "Muestra mis comandos y funciones.",
            usage: "help <comando>",
            aliases: ["h"],
            category: "Usuario",
        });
    }

    async run (message, args, level) {
        try {
            const embed = new MessageEmbed().setColor("GREEN").setTimestamp().setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
            if (args[0] === "usuario") {
                embed.setTitle("Comandos para Usuarios")
                .setDescription("**[::addgame](https://discord.gg/2pEDpvm8BG) :** Registra un juego en nuestra base de datos. El mismo deberá ser aprobado por el staff. **Debes utilizar este comando enviando un mensaje privado al bot.**\n" +
                "**[::allgames](https://discord.gg/2pEDpvm8BG) :** Envía una lista de todos los juegos a tus mensajes privados. Si tienes permiso de administrador, tendrás la opción de enviarlo a un canal de texto de tú servidor.\n" +
                "**[::game](https://discord.gg/2pEDpvm8BG) :** Busca un juego en nuestro base de datos. El nombre del juego debe respetar acentos y mayúsculas. Puedes utilizar **::search** en su lugar.\n" +
                "**[::guia](https://discord.gg/2pEDpvm8BG) :** Muestra mi guía de uso.\n" +
                "**[::help](https://discord.gg/2pEDpvm8BG) :** Muestra esta lista.\n" +
                "**[::ping](https://discord.gg/2pEDpvm8BG) :** Tiempo de respuesta de latencia y API.\n" +
                "**[::search](https://discord.gg/2pEDpvm8BG) :** Busca por juegos en nuestra lista. Puedes escribir una letra o palabra y te mostraré resultados aproximados.\n" +
                "**[::vote](https://discord.gg/2pEDpvm8BG) :** Vota positiva o negativamente por un juego. Debes incluír un `-` entre argumentos.")
                .setFooter("¿No has registrado tu juego? ¡Envíame un mensaje privado!")
                message.channel.send(embed)
                return;
            } else if (args[0] === "gestion") {
                embed.setTitle("Comandos de Gestión")
                .setDescription("**Debes añadir el nombre de tu juego respetando mayúsculas y acentos detrás de cada comando. Por ejemplo: ::status Pokémon Ukent**\n\n**[::addcolaborador](https://discord.gg/2pEDpvm8BG) :** Añade un usuario a la lista de colaboradores del juego. Este será un nombre gráfico y no podrá realizar ningún tipo de acción sobre la información de tu juego.\n" +
                "**[::addimage](https://discord.gg/2pEDpvm8BG) :** Añade una imagen a la tarjeta de información de tu juego.\n" +
                "**[::addowner](https://discord.gg/2pEDpvm8BG) :** Añade un usuario a la lista de creadores del juego. Este tendrá la misma autoridad y podrá realizar las mismas acciones que tú.\n" +
                "**[::description](https://discord.gg/2pEDpvm8BG) :** Modifica la descripción de tu juego.\n" +
                "**[::download](https://discord.gg/2pEDpvm8BG) :** Modifica el link de descarga de tu juego.\n" +
                "**[::status](https://discord.gg/2pEDpvm8BG) :** Modifica el estado de tu juego.\n" +
                "**[::votestatus](https://discord.gg/2pEDpvm8BG) :** Modifica la visibilidad de los votos.")
                .setFooter("¿Tienes alguna duda? ¡Únete a nuestro discord!")
                message.channel.send(embed)
                return;
            } else {    
                embed.setTitle("¡Asistente iniciado!")
                .setDescription("¡Hola, soy Bulbasaur!\nMis desarrolladores me dieron la misión de ~~llenar una enciclopedia Pokémon~~ registrar cada fangame como me sea posible, y además, brindar la posibilidad de difundirlos utilizándome.\n" +
                "Si todavía no registraste tu juego, puedes enviarme un mensaje privado, ¡yo te responderé de inmediante con mi guía de uso!\n\nMi lista de comandos y funciones para usuarios la puedes obtener escribiendo `::help usuario`\nSi has registrado un juego y quieres conocer como modificar su ficha, escribe `::help gestion`\nSi quieres conocer más sobre un comando, escribe `::help comando`\n\n¡Puedes unirte a mí [servidor de Discord](https://discord.gg/2pEDpvm8BG) e [invitarme a tú servidor](https://discord.com/api/oauth2/authorize?client_id=783651272975974420&permissions=8&scope=bot)!")
                .setFooter("Desarrollado con ♥ por Lau#9565, Mimilena#9032 y Galen#2359");
                let command = args[0];
                if (this.client.commands.has(command)) {
                    command = this.client.commands.get(command);
                    if (level < this.client.levelCache[command.conf.permLevel]) return;
                    embed.setTitle(command.help.name.toUpperCase())
                    .setDescription(`\n\n**Descripción:** ${command.help.description}\n**Uso:** ${command.help.usage}\n**Aliases:** ${command.conf.aliases.join(", ")}`)
                    message.channel.send(embed)
                    return;
                } else {
                    message.channel.send(embed) 
                    return;
                }
            }
            

        } catch (e) {
            console.log(e);
        }
    }
};

module.exports = Help;