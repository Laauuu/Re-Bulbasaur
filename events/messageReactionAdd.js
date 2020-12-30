module.exports = class {
    constructor (client) {
      this.client = client;
    }
  
    async run (reaction, user) {
        let client = this.client;
        if (reaction.message.channel.id !== client.config.regChan) return;
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Algo sucedió al intentar fetchear el mensaje: ', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }

        console.log(reaction.message.content)
        //message.guild.channels.resolve(client.config.regChan).send(embedData);
    }
};