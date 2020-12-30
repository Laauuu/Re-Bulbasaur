const config = {
  "admins": [],
  "support": [],
  "prefix": "::",
  "token": "NzgzNjUxMjcyOTc1OTc0NDIw.X8d2Hw.A1KMGwH3qvaG7pKyM8B9ou1Ye5g",
  "mongoToken": "mongodb+srv://user:123@fangamecluster.athj7.mongodb.net/FangameCluster?retryWrites=true&w=majority",
  "regChan": "784130813242507326",
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