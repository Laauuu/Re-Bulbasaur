const { MessageEmbed } = require("discord.js");

module.exports = class {
    constructor (client) {
      this.client = client;
    }
  
    async run (message) {
		if (message.author.bot) return;
		if (message.guild && !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")) return;
		const prefix = this.client.myPrefix();
		message.prefix = prefix;
	
		const prefixMention = new RegExp(`^<@!?${this.client.user.id}> ?$`);
		if (message.content.match(prefixMention)) {
			return message.reply(`Mi prefijo es \`${prefix}\``);
		}

		if (message.channel.type === "dm" && message.content.toLowerCase() !== "::addgame") {
			if (this.client.userSys.isInAssist(message.author.id)) return;
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
		}
	
		if (message.content.indexOf(prefix) !== 0) return;
	
		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
	
		if (message.guild && !message.member) await message.guild.fetchMember(message.author);
	
		const level = this.client.permlevel(message);
	
		const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

		if (!cmd) return;
	
		if (cmd && !message.guild && cmd.conf.guildOnly)
			return message.channel.send(":x: | Este comando está inhabilitado en mensajes privados.");
	
		if (level < this.client.levelCache[cmd.conf.permLevel]) {
			return message.channel.send(`:x: | ¡No tienes permiso para usar este comando!`);
			return;
		}

		if (this.client.userSys.isInAssist(message.author.id) && message.content.includes("::addgame")) {
			this.client.userSys.inAssist(message.author.id, false);
			return message.channel.send(":x: | El asistente ya está ejecutándose.");
		}
		message.author.permLevel = level;
	
		message.flags = [];
		while (args[0] && args[0][0] === "-") {
			message.flags.push(args.shift().slice(1));
		}
		
		this.client.logger.log(`${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) utilizó el comando ${cmd.help.name}`, "cmd");
		cmd.run(message, args, level);
    }
  };