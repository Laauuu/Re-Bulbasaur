const Command = require("../base/Command.js");
util = require('util');

class Eval extends Command {
  constructor (client) {
    super(client, {
      name: "eval",
      description: "Evalúa código javascript.",
      usage: "eval expresión",
      aliases: ["chk"],
      permLevel: "Bot Owner"
    });
  }

  async run (message, args, level) { // eslint-disable-line no-unused-vars
    try {
        let author = message.author,
          member = message.member,
          guild = message.guild,
          channel = message.channel,
          client = message.client,
          config = client.config,
          msg = message;
        try {
          let evalued = await eval(args.join(' '));
          if (typeof evalued !== 'string')
            evalued = util.inspect(evalued, { depth: 0 });
          if (evalued.length > 1950) {
            message.channel.send('> Error: El resultado es muy largo');
          } else if (evalued.includes(config.token || config.mongoToken)) {
            message.channel.send('> Error: El resultado contiene un token');
          } else {
            message.channel.send('> Hecho:\n```js\n' + evalued + '\n```');
          }
        } catch (err) {
          err = util.inspect(err, { depth: 0 });
          if (err.includes(config.token || config.mongoToken))
            err = err.replace(config.token || config.mongoToken, 'T0K3N');
          message.channel.send('> Error: \n```js\n' + err + '\n```');
        }
    } catch (e) {
        console.error(e);
    }
  }
}

module.exports = Eval;