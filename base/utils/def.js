module.exports = {
    makeID() {
      let result = '';
      const characters =
        '0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    },
    check(hay, needle, from) {
      var i = 1;
      while (i < needle.length) {
        if (hay[from] != needle[i])
          return false;
        i++;
        from++;
      }
      return true;
    },
    myFindWordIndex(str, findme) {
      var indices = [];
      var needle = findme.split(" ");
      var hay = str.split(" ");
    
      for (var i = 0; i < hay.length - needle.length; i++) {
        if (hay[i] == needle[0] && (needle.length==1||check(hay, needle, i)))
          indices.push(i);
      }
      return indices;
    },
    getAllIndexes(arr, val) {
      var indexes = [], i;
      for(i = 0; i < arr.length; i++)
          if (arr[i] === val)
              indexes.push(i);
      return indexes;
    },
    removeItemOnce(arr, value) {
      var index = arr.indexOf(value);
      if (index > -1) {
        arr.splice(index, 1);
      }
      return arr;
    }, 
    removeItemAll(arr, value) {
      var i = 0;
      while (i < arr.length) {
        if (arr[i] === value) {
          arr.splice(i, 1);
        } else {
          ++i;
        }
      }
      return arr;
    },
    fixName(args) {
      let checkWords = ["Poke", "Pokem", "Pokemo", "Pokemon"]
      args = args.split(" ");
      for (var i = 0, x = args.length; i < x; i++) {
          args[i] = args[i][0].toUpperCase() + args[i].substr(1);
      }
      console.log(checkWords.includes(args.join(" ")))
      if (checkWords.includes("Poke")) {
          args.forEach(x => {
            console.log(x)   
              if (x.startsWith("Poke")) {                                            
                  args.splice(args.indexOf(x), 0, x.replace("e", "é"));
                  args.splice(args.indexOf(x), 1)
              }
          });
      }
      return args = args.join(" ");
    }
};