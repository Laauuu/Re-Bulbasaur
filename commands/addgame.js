const Command = require("../base/Command.js");
const { MessageEmbed } = require("discord.js");

class AddGame extends Command {
    constructor (client) {
        super(client, {
            name: "addgame",
            description: "Registra un juego en nuestra base de datos. El mismo deberá ser aprobado por el staff. **Debes utilizar este comando enviando un mensaje privado al bot.**",
            usage: "addgame (En mensajes privados)",
            aliases: [],
            category: "Usuario",
            guildOnly: false
        });
    }

    async run (message, args, level) {
        try {
            if (message.guild) return message.channel.send("Este comando está inhabilitado en servidores.");
            let name, avanceLink;
            let generatedId = this.client.def.makeID();

            const filter = m => m.author.id === message.author.id;
            const embed = new MessageEmbed()
            .setColor("GREEN").setTitle("¡Asistente de registro iniciado!")
            .setDescription("¡Hola, soy el asistente de **registro de juegos**!\nEstoy aquí para **ayudarte** en el proceso de **registro** de tu **maravilloso juego**.\nA continuación te haré **dos preguntas** que ayudarán al equipo de aplicaciones a conocer más sobre tu juego.\nRecuerda que **debes poseer una cuenta** en alguna plataforma en donde **muestres un mínimo avance de tu creación**.\nTe recomendamos que no utilices emojis en el nombre de tu juego, por tu futura comodidad.\nAnte cualquier otra duda, ¡puedes unirte a nuestra **[Comunidad de Discord](https://google.com)**!")
            .setTimestamp().setAuthor(this.client.user.username, this.client.user.avatarURL({ dynamic: true }))
            .setFooter("El uso incorrecto de esta función puede resultar en un baneo inmediato del sistema y comunidad.")
            message.channel.send(embed)
            message.channel.send("¿Podrías escribir el nombre de tu juego?").then(() => {
                this.client.userSys.inAssist(message.author.id, true);
                message.channel.awaitMessages(filter, { max: 1, time: 90000, errors: ['time'] })
                    .then(collected => {
                        if (collected.first().content.includes("::")) return;
                        name = collected.first().content;
                        message.channel.send(`¡${collected.first().content} es un buen nombre!`);
                        message.channel.send("¡Una cosa más!\nNecesito ver avances de tu juego, ¿podrías brindarme un link para ello? Por ejemplo, el twitter de tu juego.").then(() => {
                            message.channel.awaitMessages(filter, { max: 1, time: 90000, errors: ['time'] })
                                .then(collected => {
                                    avanceLink = collected.first().content;
                                    if (name.length > 50) {
                                        this.client.userSys.inAssist(message.author.id, false);
                                        return message.channel.send(":x: | El título del juego no puede superar los 50 caractéres.");
                                    }
                                    let game = this.client.gameSys.gameExists(name);
                                    let allGames = this.client.gameSys.getAllGames();
                                    let myArray = new Array();
                                    let myArray2 = new Array();
                                    let checker = false;
                                    if (game) {
                                        this.client.userSys.inAssist(message.author.id, false);
                                        return message.channel.send(':x: | ¡Este juego ya está registrado!');
                                    }
                                    if (!avanceLink.startsWith("https://"))  {
                                        this.client.userSys.inAssist(message.author.id, false);
                                        return message.channel.send(':x: | ¡El link de avances debe comenzar con **https://**!');
                                    }
                                    Object.keys(allGames).forEach(e => {
                                        myArray.push(allGames[e].ID);
                                    });
                                    myArray.forEach(x => {
                                        let getGame = this.client.gameSys.getGame(x);
                                        if (getGame.info.owners.includes(message.author.id) && getGame.accepted === false) {
                                            myArray2.push(x);
                                            checker = true;
                                        }
                                    });
                                    if (checker === true) {
                                        this.client.userSys.inAssist(message.author.id, false);
                                        return message.channel.send(":x: | He detectado que tienes un juego ("+myArray2.join(", ")+") pendiente de aprobación.")
                                    }
                                    message.channel.send(`¡He terminado el proceso de registro!\nEl equipo de aplicaciones ya recibió tu solicitud y pronto definirá si tu juego es apto para ingresar en nuestra lista.`);
                                    name = this.client.def.fixName(name);
                                    this.client.gameSys.registerGame(name, {
                                        id: generatedId,
                                        registered: true,
                                        accepted: false,
                                        info: {
                                            creador: message.author.id,
                                            owners: [message.author.id],
                                            colaboradores: [],
                                            image: "https://cdn.discordapp.com/avatars/783651272975974420/57c9d7c204376b5daa2ba698cef251a0.webp",
                                            arrayImages: [],
                                            description: "Un juego sin ánimos de lucro con mucho amor.",
                                            descarga: "Este juego aún no posee un link de descarga.",
                                            avances: avanceLink,
                                            status: "El creador no asignó un estado a este juego.",
                                            color: "GREEN",
                                            premios: [],
                                            votes: {
                                                up: 0,
                                                down: 0,
                                                up_users: [],
                                                down_users: [],
                                                public: true,
                                                voters: []
                                            },
                                        },
                                    })
                                    this.client.userSys.inAssist(message.author.id, false);
                                    const embedData = new MessageEmbed()
                                    .setColor("PURPLE").setTitle(name).setDescription(`**Creador:** ${message.author.username}\n**Link de avances:** [Clic aquí](${avanceLink})`).setTimestamp();
                                    this.client.channels.resolve(this.client.config.regChan).send(embedData);       
                                })
                                .catch(collected => {
                                    this.client.userSys.inAssist(message.author.id, false);
                                    message.channel.send('¡No pude esperar más y apagué mis sistemas!');
                                    console.log(collected)
                                });
                        });
                    })
                    .catch(collected => {
                        this.client.userSys.inAssist(message.author.id, false);
                        message.channel.send('¡No pude esperar más y apagué mis sistemas!');
                    });
            });            
        } catch (e) {
            console.log(e);
        }
    }
};

module.exports = AddGame;