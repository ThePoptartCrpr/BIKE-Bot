const Discord = require('discord.js');

const moment = require('moment');

// exports.run = (client, message, params, perms) => {
//   let type = params[0];
//   if (!params[0] || !isNaN(params[0])) type = "xp";
//
//   let mySpot = "You are not on the leaderboard!";
//   let myScore = "0";
//
//   let perPage = 20;
//   let page = 1;
//
//   if (!isNaN(params[0]) && params[0].indexOf(".") == -1) page = params[0];
//   else if (!isNaN(params[1]) && params[1].indexOf(".") == -1) page = params[1];
//   if (page < 1) return message.channel.send("Page cannot be below 1!");
//   // else message.channel.send(page);
//
//   if (type == "balance" || type == "bal" || type == "money" || type == "currency" || type == "coin" || type == "bikecoin" || type == "c" || type == "b") {
//     let count = 1;
//     let str = "";
//     let user;
//
//     let top = client.balance;
//     let lbTop = [];
//
//     top.map(b => ({bal: b.bal, id: b.id}))
//       .sort((a, b) => b.bal > a.bal ? 1 : -1)
//       .map(us => {
//         lbTop.push(us.id);
//       })
//
//     lbTop.forEach(balance => {
//       user = client.users.get(balance);
//       if (count <= page * perPage && count > (page - 1) * perPage) {
//         if (user == undefined) str += `${count}. Invalid user (ID ${balance}) - ${client.balance.get(balance).bal}\n`;
//         else str += `${count}. ${user.username} - ${client.balance.get(balance).bal}\n`;
//       }
//       if (balance === message.author.id) {
//         mySpot = `#${count}`;
//         myScore = client.balance.get(balance).bal.toLocaleString();
//       }
//       count++;
//     });
//     message.channel.send(`**📜 | BikeCoin Leaderboard**\n\nPage ${page}\n\`\`\`python\n${str}\`\`\`\n\nYour spot: ${mySpot} with ${myScore} BikeCoin`);
//   } else if (type == "xp" || type == "points" || type == "point" || type == "p") {
//     let count = 1;
//     let str = "";
//     let user;
//
//     let top = client.points;
//     let lbTop = [];
//
//     top.map(p => ({points: p.points, id: p.id}))
//       .sort((a, b) => b.points > a.points ? 1 : -1)
//       .map(us => {
//         lbTop.push(us.id);
//       })
//
//     lbTop.forEach(points => {
//       user = client.users.get(points);
//       if (count <= page * perPage && count > (page - 1) * perPage) {
//         if (user == undefined) str += `${count}. Invalid user (ID ${points}) - ${client.points.get(points).points}\n`;
//         else str += `${count}. ${user.username} - ${client.points.get(points).points}\n`;
//       }
//       if (points === message.author.id) {
//         mySpot = `#${count}`;
//         myScore = client.points.get(points).points.toLocaleString();
//       }
//       count++;
//     });
//     if (str === "") return message.channel.send("That page does not exist!");
//     message.channel.send(`**📜 | XP Leaderboard**\n\nPage ${page}\n\`\`\`python\n${str}\`\`\`\n\nYour spot: ${mySpot} with ${myScore} XP`);
//   } else if (type == "level" || type == "l") {
//     let count = 1;
//     let str = "";
//     let user;
//
//     let top = client.points;
//     let lbTop = [];
//
//     top.map(l => ({level: l.level, id: l.id}))
//       .sort((a, b) => b.level > a.level ? 1 : -1)
//       .map(us => {
//         lbTop.push(us.id);
//       })
//
//     lbTop.forEach(level => {
//       if (client.points.get(level).level <= 0) return;
//       user = client.users.get(level);
//       if (count <= page * perPage && count > (page - 1) * perPage) {
//         if (user == undefined) str += `${count}. Invalid user (ID ${level}) - ${client.points.get(level).level}\n`;
//         else str += `${count}. ${user.username} - ${client.points.get(level).level}\n`;
//       }
//       if (level === message.author.id) {
//         mySpot = `#${count}`;
//         myScore = client.points.get(level).level;
//       }
//       count++;
//     });
//     if (str === "") return message.channel.send("That page does not exist!");
//     message.channel.send(`**📜 | Level Leaderboard**\n\nPage ${page}\n\`\`\`python\n${str}\`\`\`\n\nYour spot: ${mySpot} with level ${myScore}`);
//   } else if (type === "rep" || type === "reputation" || type === "r") {
//     let count = 1;
//     let str = "";
//     let user;
//
//     let top = client.reputation;
//     let lbTop = [];
//
//     top.map(r => ({rep: r.rep, id: r.id}))
//       .sort((a, b) => b.rep > a.rep ? 1 : -1)
//       .map(us => {
//         lbTop.push(us.id);
//       })
//
//     lbTop.forEach(rep => {
//       if (client.reputation.get(rep).rep <= 0) return;
//       user = client.users.get(rep);
//       if (count <= page * perPage && count > (page - 1) * perPage) {
//         if (user == undefined) str += `${count}. Invalid user (ID ${rep}) - ${client.reputation.get(rep).rep}\n`;
//         else str += `${count}. ${user.username} - ${client.reputation.get(rep).rep}\n`;
//       }
//       if (rep === message.author.id) {
//         mySpot = `#${count}`;
//         myScore = client.reputation.get(rep).rep;
//       }
//       count++;
//     });
//     if (str === "") return message.channel.send("That page does not exist!");
//     message.channel.send(`**📜 | Reputation Leaderboard**\n\nPage ${page}\n\`\`\`python\n${str}\`\`\`\n\nYour spot: ${mySpot} with ${myScore} reputation`);
//   } else if (type === "sentrep" || type === "sent" || type === "sentreputation" || type == "s") {
//     let count = 1;
//     let str = "";
//     let user;
//
//     let top = client.reputation;
//     let lbTop = [];
//
//     top.map(r => ({sent: r.sent, id: r.id}))
//       .sort((a, b) => b.sent > a.sent ? 1 : -1)
//       .map(us => {
//         lbTop.push(us.id);
//       })
//
//     lbTop.forEach(rep => {
//       user = client.users.get(rep);
//       if (client.reputation.get(rep).sent <= 0) return;
//       if (count <= page * perPage && count > (page - 1) * perPage) {
//         if (user == undefined) str += `${count}. Invalid user (ID ${rep}) - ${client.reputation.get(rep).sent}\n`;
//         else str += `${count}. ${user.username} - ${client.reputation.get(rep).sent}\n`;
//       }
//       if (rep === message.author.id) {
//         mySpot = `#${count}`;
//         myScore = client.reputation.get(rep).sent;
//       }
//       count++;
//     });
//     if (str === "") return message.channel.send("That page does not exist!");
//     message.channel.send(`**📜 | Sent Reputation Leaderboard**\n\nPage ${page}\n\`\`\`python\n${str}\`\`\`\n\nYour spot: ${mySpot} with ${myScore} sent reputation`);
//   } else if (type === "streak" || type === "streaks" || type === "dailystreak" || type === "dailystreaks") {
//     let count = 1;
//     let str = "";
//     let user;
//
//     let topToFilter = client.streaks;
//
//     /*
//     let dateStreak = new Date(lastDailyClaimed);
//     let momentStreak = moment(dateStreak);
//     if (momentStreak.add(48, 'hours').isAfter(moment())) {
//       streak.streak++;
//       client.streaks.set(message.author.id, streak);
//     } else {
//       client.streaks.set(message.author.id, {streak: 1, id: message.author.id});
//     }
//      */
//     topToFilter.forEach(streak => {
//       let dateStreak = new Date(client.prevDailies.get(streak.id));
//       let momentStreak = moment(dateStreak);
//       if (momentStreak.add(240, 'hours').isBefore(moment())) {
//         // console.log("yes it is " + momentStreak + streak.id);
//         client.streaks.set(streak.id, {streak: 0, id: streak.id});
//       }
//     });
//
//     let top = client.streaks;
//     let lbTop = [];
//
//     top.map(s => ({streak: s.streak, id: s.id}))
//       .sort((a, b) => b.streak > a.streak ? 1 : -1)
//       .map(us => {
//         lbTop.push(us.id);
//       })
//
//     lbTop.forEach(streak => {
//       console.log(streak);
//       user = client.users.get(streak);
//       if (client.streaks.get(streak).streak <= 0) return;
//       if (user == undefined) str += `${count}. Invalid user (ID ${streak}) - ${client.streaks.get(streak).streak}\n`;
//       else str += `${count}. ${user.username} - ${client.streaks.get(streak).streak}\n`;
//       if (streak === message.author.id) {
//         mySpot = `#${count}`;
//         myScore = client.streaks.get(streak).streak;
//       }
//       count++;
//     });
//     message.channel.send(`**📜 | Streak Leaderboard**\n\n\`\`\`python\n${str}\`\`\`\n\nYour spot: ${mySpot} with a streak of ${myScore}`);
//   } else if (type === "dailies" || type === "daily" || type === "d") {
//     let count = 1;
//     let str = "";
//     let user;
//
//     let top = client.userStats;
//     let lbTop = [];
//
//     top.map(d => ({dailies: d.dailies, id: d.id}))
//       .sort((a, b) => b.dailies > a.dailies ? 1 : -1)
//       .map(us => {
//         lbTop.push(us.id);
//       })
//
//     lbTop.forEach(daily => {
//       user = client.users.get(daily);
//       if (client.userStats.get(daily).dailies <= 0) return;
//       if (count <= page * perPage && count > (page - 1) * perPage) {
//         if (user == undefined) str += `${count}. Invalid user (ID ${daily}) - ${client.userStats.get(daily).dailies}\n`;
//         else str += `${count}. ${user.username} - ${client.userStats.get(daily).dailies}\n`;
//       }
//       if (daily === message.author.id) {
//         mySpot = `#${count}`;
//         myScore = client.userStats.get(daily).dailies;
//       }
//       count++;
//     });
//     if (str === "") return message.channel.send("That page does not exist!");
//     message.channel.send(`**📜 | Daily Leaderboard**\n\nPage ${page}\n\`\`\`python\n${str}\`\`\`\n\nYour spot: ${mySpot} with ${myScore} dailies`);
//
//   } else {
//     message.channel.send("That's not a recognized leaderboard.\n\nOptions:\nbalance, xp, level, reputation, sentrep, streak, daily");
//   }
// };

exports.run = (client, message, params, perms) => {
  // if (perms < 1 && message.author.id != '307571341916241922') return message.channel.send({embed: client.EmbedHelper.prebuiltEmbeds.noPermission});

  let perPage = 20;

  let type = params[0];
  if (!params[0] || !isNaN(params[0])) type = "xp";
  let page = 1;

  if (!isNaN(params[0]) && params[0].indexOf(".") == -1) page = params[0];
  else if (!isNaN(params[1]) && params[1].indexOf(".") == -1) page = params[1];
  if (page < 1) return message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle("Usage:")
      .setDescription("**+leaderboard <type> <page>**")
      .setColor(client.EmbedHelper.colors.red)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  });

  assembleLeaderboard = function(page, title, db, value, unit, sortCallback) {
    let lb = [];
    sortCallback(db, lb);

    let count = 1;

    let leaderboard = "";

    let mypos = [0, 0];

    if (lb.indexOf(message.author.id) == -1) lb.push(message.author.id);

    lb.forEach(id => {
      let user = client.users.get(id);
      let amount = db.get(id)[value] || 0;
      if (amount <= 0 && id != message.author.id) return;
      if (count <= page * perPage && count > (page - 1) * perPage && user != undefined) leaderboard += `**#${count}**: ${user} with **${amount.toLocaleString()} ${unit}**\n`;
      if (id == message.author.id) {
        mypos[0] = count;
        mypos[1] = amount;
      }
      if (user != undefined) count++;
    });

    if (leaderboard === "") return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle(`The ${title} Leaderboard is only ${Math.ceil(count / perPage)} pages long!`)
        .setTimestamp()
        .setColor(client.EmbedHelper.colors.red)
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })

    message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle(`📜 | ${title} Leaderboard Page ${page}`)
        .setDescription(`${leaderboard}\n\nYou are currently position #${mypos[0]} with ${mypos[1].toLocaleString()} ${unit}.`)
        .setTimestamp()
        .setColor(client.EmbedHelper.colors.lime)
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
  }

  if (type == "balance" || type == "bal" || type == "money" || type == "currency" || type == "coin" || type == "bikecoin" || type == "c" || type == "b") {
    assembleLeaderboard(page, "Balance", client.balance, "bal", "BikeCoin", (db, lb) => {
      db.map(board => ({bal: board.bal, id: board.id}))
      .sort((a, b) => b.bal > a.bal ? 1 : -1)
      .map(user => {
        lb.push(user.id);
      });
    });
  } else if (type == "xp" || type == "points" || type == "point" || type == "p") {
    assembleLeaderboard(page, "XP", client.points, "points", "XP", (db, lb) => {
      db.map(board => ({points: board.points, id: board.id}))
      .sort((a, b) => b.points > a.points ? 1 : -1)
      .map(user => {
        lb.push(user.id);
      });
    });
  } else if (type == "level" || type == "l") {
    assembleLeaderboard(page, "Level", client.points, "level", "levels", (db, lb) => {
      db.map(board => ({level: board.level, id: board.id}))
      .sort((a, b) => b.level > a.level ? 1 : -1)
      .map(user => {
        lb.push(user.id);
      });
    });
  } else if (type === "rep" || type === "reputation" || type === "r") {
    assembleLeaderboard(page, "Reputation", client.reputation, "rep", "reputation", (db, lb) => {
      db.map(board => ({rep: board.rep, id: board.id}))
      .sort((a, b) => b.rep > a.rep ? 1 : -1)
      .map(user => {
        lb.push(user.id);
      });
    });
  } else if (type === "sentrep" || type === "sent" || type === "sentreputation" || type == "sr") {
    assembleLeaderboard(page, "Reputation", client.reputation, "sent", "sent reputation", (db, lb) => {
      db.map(board => ({sent: board.sent, id: board.id}))
      .sort((a, b) => b.sent > a.sent ? 1 : -1)
      .map(user => {
        lb.push(user.id);
      });
    });
  } else if (type === "streak" || type === "streaks" || type === "dailystreak" || type === "dailystreaks" || type === "s") {
    assembleLeaderboard(page, "Streak", client.streaks, "streak", "dailies", (db, lb) => {
      db.forEach(streak => {
        let dateStreak = new Date(client.prevDailies.get(streak.id));
        let momentStreak = moment(dateStreak);
        if (momentStreak.add(2400000, 'hours').isBefore(moment())) {
          // console.log("yes it is " + momentStreak + streak.id);
          client.streaks.set(streak.id, {streak: 0, id: streak.id});
        }
      });
      db.map(board => ({streak: board.streak, id: board.id}))
      .sort((a, b) => b.streak > a.streak ? 1 : -1)
      .map(user => {
        lb.push(user.id);
      });
    });
  } else if (type === "dailies" || type === "daily" || type === "d") {
    assembleLeaderboard(page, "Daily", client.userStats, "dailies", "dailies", (db, lb) => {
      db.map(board => ({dailies: board.dailies, id: board.id}))
      .sort((a, b) => b.dailies > a.dailies ? 1 : -1)
      .map(user => {
        lb.push(user.id);
      });
    });
  } else {
    message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle("That's not a valid leaderboard type!")
        .addField("Available types:", "balance\nxp\nlevel\nreputation\nsentreputation\nstreak\ndailies")
        .setColor(client.EmbedHelper.colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    });
  }
}

exports.conf = {
  name: 'leaderboard',
  aliases: ['lb', 'leaderboards', 'top'],
  permLevel: 0,
  usage: '+leaderboard'
};

// python is the language for codeblocks to be all colory and stuff
