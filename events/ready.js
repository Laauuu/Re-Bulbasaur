module.exports = class {
    constructor (client) {
      this.client = client;
    }
  
    async run () {
        setTimeout(() => {
            this.client.user.setActivity(`${this.client.myPrefix()}help | Viendo fangames`);
            this.client.logger.log(`${this.client.user.tag}, ready to serve ${this.client.users.cache.size} users in ${this.client.guilds.cache.size} servers.`, "ready");
        }, 1000);
    }
};