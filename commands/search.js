const Command = require("../base/Command.js");
const { MessageEmbed } = require("discord.js");

class Search extends Command {
    constructor (client) {
        super(client, {
            name: "search",
            description: "Busca por juegos en nuestra lista. Puedes escribir una letra o palabra y te mostraré resultados aproximados.",
            usage: "search palabra o letra",
            aliases: ["searchfor", "sf"],
            category: "Usuario",
        });
    }

    async run (message, args, level) {
        try {
            args = args.join(" ")
            if (!args) return message.channel.send(":x: | Ingresa un nombre a buscar");
            let allGames = this.client.gameSys.getAllGames();
            let myArray = new Array();
            args = this.client.def.fixName(args);
            if (this.client.gameSys.getGame(args)) {
                myArray = [""+args+""]
            } else {
                Object.keys(allGames).forEach(e => {
                    if (allGames[e].ID.includes(args)) {
                        myArray.push(allGames[e].ID);
                    }
                });
            }
            let d = myArray.length-20;
            myArray.sort();
            if (myArray.length > 20) {
                myArray.splice(myArray.length-d, d);
            }
            myArray.forEach(x => {
                if (this.client.gameSys.getGame(x).accepted === false) {
                    myArray = myArray.filter(function(value, index, arr){ 
                        return value !== x;
                    });
                }
            });
            let count = "";
            for (let x = 0; x < myArray.length; x++) {
                count += `${x}. ${myArray[x]}\n`;
            }
            const filter = m => m.author.id === message.author.id;
            let gameNumber = "";
            const embedData = new MessageEmbed();
            const embedSearch = new MessageEmbed().setColor("GREEN").setTimestamp().setTitle(`¡Aquí tengo ${myArray.length} resultado(s) para tí!\n`)
            .setDescription(count+"\n\nPuedes escribir el número del juego para ver más información del mismo.").setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
            message.channel.send(embedSearch).then(() => {
                message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(async collected => {
                        gameNumber = collected.first().content;
                        if (myArray[gameNumber] === undefined) return message.channel.send(":x: | El valor ingresado no corresponde a un juego registrado. Vuelve a ejecutar la búsqueda.");
                        let game = this.client.gameSys.getGame(myArray[gameNumber]);
                        let hasDownload = (game.info.descarga.includes("https://")) ? `[Click aquí](${game.info.descarga})` : game.info.descarga;
                        let hasColabs = (game.info.colaboradores.length > 0) ? game.info.colaboradores.join(", ") : "Este juego no tiene colaboradores";
                        let votePublic = (game.info.votes.public) ? `**__Votos__**:\n${game.info.votes.up} :thumbsup: | ${game.info.votes.down} :thumbsdown:` : `\nEl creador ocultó los votos.`
                        const userPromises = game.info.owners.map((id) => this.client.users.fetch(id));
                        //const usernames = users.map((user) => user.username).join(", ");
                        const users = Promise.all(userPromises);
                        embedData.setColor("GREEN").setTitle(myArray[gameNumber])
                        .setDescription(`**__Descripción__**:\n${game.info.description}\n**__Creador/es__**:\n${await users}\n**__Colaborador/es__**:\n${hasColabs}\n**__Avances__**:\n${game.info.avances}\n**__Estado__**:\n${game.info.status}\n**__Descarga__**:\n${hasDownload}\n${votePublic}`)
                        .setThumbnail(game.info.image);
                        await message.channel.send(embedData)
                    })
                    .catch(collected => {
                        message.channel.send('¡Hubo un error o el tiempo terminó!');
                        console.log(collected)
                    });
            });   
            //await message.channel.send(this.client.gameSys.getGame(""+myArray[gameNumber].info.description+""));
        } catch (e) {
            console.log(e);
        }
    }
};

module.exports = Search;