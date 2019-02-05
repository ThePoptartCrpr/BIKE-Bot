const {SlotMachine, SlotSymbol} = require('slot-machine');

const moment = require('moment');

/*const lemon = new SlotSymbol("lemon", { display: "🍋", points: 1, weight: 100 });
const watermelon = new SlotSymbol("watermelon", { display: "🍉", points: 1, weight: 100 });
const apple = new SlotSymbol("apple", { display: "🍎", points: 1, weight: 100 });
const grape = new SlotSymbol("grape", { display: "🍇", points: 1, weight: 100 });
const orange = new SlotSymbol("orange", { display: "🍊", points: 1, weight: 100 });
const cherry = new SlotSymbol("cherry", { display: "🍒", points: 1, weight: 100 });
const wild = new SlotSymbol("wild", { display: "❔", points: 1, weight: 40, wildcard: true });
const bell = new SlotSymbol("bell", { display: "🔔", points: 2, weight: 40 });
const clover = new SlotSymbol("clover", { display: "🍀", points: 3, weight: 35 });
const heart = new SlotSymbol("heart", { display: "❤", points: 4, weight: 30 });
const money = new SlotSymbol("money", { display: "💰", points: 5, weight: 25 });
const diamond = new SlotSymbol("diamond", { display: "💎", points: 10, weight: 3 });
const jackpot = new SlotSymbol("jackpot", { display: "🔅", points: 50, weight: 5});

const machine = new SlotMachine(3, [cherry, lemon, watermelon, apple, grape, orange, wild, bell, clover, heart, money, diamond, jackpot]);*/

const cherry = new SlotSymbol("cherry", {display: "🍒", points: 20, weight: 100});
const apple = new SlotSymbol("apple", {display: "🍎", points: 20, weight: 100});
const orange = new SlotSymbol("orange", {display: "🍊", points: 20, weight: 100});
const peach = new SlotSymbol("peach", {display: "🍑", points: 20, weight: 100});
const grape = new SlotSymbol("grape", {display: "🍇", points: 20, weight: 100});
const watermelon = new SlotSymbol("watermelon", {display: "🍉", points: 20, weight: 100});
const lemon = new SlotSymbol("lemon", {display: "🍋", points: 20, weight: 100});
const strawberry = new SlotSymbol("strawberry", {display: "🍓", points: 20, weight:100});
const pineapple = new SlotSymbol("pineapple", {display: "🍍", points: 20, weight: 100});
const wildcard = new SlotSymbol("wild", {display: "❔", points: 20, weight: 50, wildcard: true});
const bell = new SlotSymbol("bell", { display: "🔔", points: 30, weight: 30 });
const jackpot = new SlotSymbol("jackpot", {display: "💰", points: 250, weight: 25});
const diamond = new SlotSymbol("diamond", {display: "💎", points: 500, weight: 5});

const machine = new SlotMachine(3, [cherry, apple, orange, peach, grape, watermelon, lemon, strawberry, wildcard, bell, jackpot, diamond]);

let totalUsed = 0;
let totalWon = 0;

exports.run = (client, message, params, perms) => {
  /*message.channel.send(`Are you sure you want to gamble 15 BikeCoin? (__Y__es/__N__o)`);
  const filter = m => m.author === message.author;
  message.channel.awaitMessages(filter, {max: 1, time: 10000, errors: ['time']})
    .then(collected => {
      let content = collected.first().content;
      if (content.toLowerCase() !== "y" && content.toLowerCase() !== "n") return message.channel.send("Invalid response. Cancelled.");
      if (content.toLowerCase() === "n") return message.channel.send("Cancelled.");
      */
     let bal = client.balance.get(message.author.id) || {bal: 0};
     if (bal < 10) return message.channel.send("You do not have 10 BikeCoin!");
     cooldown = client.cooldowns.get(message.author.id) || client.blankCooldowns;
     let dateObj = new Date(cooldown.slots);
     let momentObj = moment(dateObj);
     if (momentObj.add(10, 'seconds').isAfter(moment())) return message.channel.send(`You can use the slot machine again in ${momentObj.diff(moment(), 'seconds')} seconds.`)
      .then(msg => {
        setTimeout(() => {
          msg.delete();
        }, 4000)
      })
      let blankCooldown = client.blankCooldowns;
      blankCooldown.slots = moment().toString();
      client.cooldowns.set(message.author.id, blankCooldown);
      message.channel.send("Rolling...")
      .then(msg => {
        setTimeout(() => {
          let results = machine.play();
          let winnings = Math.floor(Math.random() * ((results.totalPoints + 30) - (results.totalPoints - 30) + 1)) + (results.totalPoints - 30);
          if (results.winCount === 0) msg.edit(`${results.visualize(false)}\n\n**${message.author.username}** rolled 10 BikeCoin and lost.`);
          else msg.edit(`${results.visualize(false)}\n\n**${message.author.username}** rolled 10 BikeCoin and won ${winnings} BikeCoin!`);
          totalUsed += 10;
          if (results.winCount !== 0) totalWon += winnings;
          console.log(`${totalUsed} used, ${totalWon} won`);
          
          let toAdd = 0;
          if (results.winCount !== 0) toAdd += winnings;
          toAdd -= 10;
          
          let currBal = client.balance.get(message.author.id) || {bal: 0, id: message.author.id};
          currBal.bal += toAdd;
          client.balance.set(message.author.id, currBal);
        }, 1000);
      })
    //})
    //.catch(collected => message.channel.send("Ran out of time."));
};

exports.conf = {
  name: 'slots',
  aliases: ["gamble", "slot"],
  permLevel: 0,
  usage: '+slots'
};
