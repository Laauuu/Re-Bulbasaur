const config = {
  "admins": [],
  "support": [],
  "prefix": "::",
  "token": "",
  "mongoToken": "",
  "regChan": "",
  permLevels: [
      { level: 0,
        name: "Usuario", 
        check: () => true
      },
      { level: 8,
        name: "Bot Mod",
        check: (message) => config.support.includes(message.author.id)
      },
      { level: 9,
        name: "Bot Admin",
        check: (message) => config.admins.includes(message.author.id)
      },
      { level: 10,
        name: "Bot Owner", 
        check: (message) => "595734746059898927" === message.author.id
      }
  ],
};

module.exports = config;
