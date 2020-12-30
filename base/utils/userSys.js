const db = require("quick.db");
const userData = new db.table("userData");

module.exports = {
    inAssist(user, boolean) {
        userData.set(user+".inAssist", boolean);
    },
    isInAssist(user) {
        return userData.get(user+".inAssist");
    }
}