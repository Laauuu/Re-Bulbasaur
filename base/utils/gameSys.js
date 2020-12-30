const db = require("quick.db");
const games = new db.table("games");

module.exports = {

    registerGame(name, data) {
        games.set(name, data);
    },
    setGameValue(name, data) {
        if (!this.gameExists) return false;
        games.set(name, data);
    },
    pushValue(name, value) {
        if (!this.gameExists) return false;
        games.push(name, value);
    },
    addValue(name, value) {
        if (!this.gameExists) return false;
        games.add(name, value);
    },
    subValue(name, value) {
        if (!this.gameExists) return false;
        games.subtract(name, value);
    },
    gameExists(name) {
        return games.has(name);
    },
    getGame(name) {
        if (!this.gameExists) return false;
        return games.get(name);
    },
    deleteGame(name) {
        if (!this.gameExists) return false;
        return games.delete(name);
    },
    getAllGames() {
        return games.all();
    },
    fetchGames(name) {
        try {
            return games.fetchAll(name);
        } catch (e) {
            return e;
        }
    }
}