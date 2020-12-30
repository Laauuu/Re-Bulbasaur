const { Client, Collection } = require("discord.js");
const path = require("path");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const klaw = require("klaw");

class Main extends Client {
    constructor(options) {
        super(options);
        this.config = require("./config");
        this.commands = new Collection();
        this.aliases = new Collection();
        this.logger = require("./modules/Logger");
        this.def = require("./base/utils/def");
        this.gameSys = require("./base/utils/gameSys");
        this.userSys = require("./base/utils/userSys")
    }

    myPrefix () {
        return this.config.prefix;
    }

    permlevel (message) {
        let permlvl = 0;
    
        const permOrder = this.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
    
        while (permOrder.length) {
          const currentLevel = permOrder.shift();
          if (message.guild && currentLevel.guildOnly) continue;
          if (currentLevel.check(message)) {
            permlvl = currentLevel.level;
            break;
          }
        }
        return permlvl;
    }
    

    loadCommand(commandPath, commandName) {
        try {
          const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
          this.logger.log(`Loading Command: ${props.help.name}.`, "log");
          props.conf.location = commandPath;
          if (props.init) {
            props.init(this);
          }
          this.commands.set(props.help.name, props);
          props.conf.aliases.forEach(alias => {
            this.aliases.set(alias, props.help.name);
          });
          return false;
        } catch (e) {
          return `Unable to load command ${commandName}: ${e}`;
        }
      }
    
      async unloadCommand(commandPath, commandName) {
        let command;
        if (this.commands.has(commandName)) {
          command = this.commands.get(commandName);
        } else if (this.aliases.has(commandName)) {
          command = this.commands.get(this.aliases.get(commandName));
        }
        if (!command) return `El comando \`${commandName}\` no existe.`;
    
        if (command.shutdown) {
          await command.shutdown(this);
        }
        delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
        return false;
      }

};

const intents = ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"];
const client = new Main({ ws: {intents: intents } });

const init = async () => {

    klaw("./commands").on("data", (item) => {
        const cmdFile = path.parse(item.path);
        if (!cmdFile.ext || cmdFile.ext !== ".js") return;
        const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
        if (response) client.logger.error(response);
    });
    const evtFiles = await readdir("./events/");
    client.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        client.logger.log(`Loading Event: ${eventName}`);
        const event = new (require(`./events/${file}`))(client);
        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
    client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
        const thisLevel = client.config.permLevels[i];
        client.levelCache[thisLevel.name] = thisLevel.level;
    }
  
    client.login(client.config.token);
};

init();



client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
  .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info));

process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Uncaught Exception: ", errorMsg);
    process.exit(1);
});
  
process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: ", err);
});


