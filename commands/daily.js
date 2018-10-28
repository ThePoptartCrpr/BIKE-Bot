const moment = require('moment');

exports.run = (client, message, params, perms) => {
  // if (message.guild.id === '429734306966011914') return message.channel.send("This command is currently in maintenance.");
  let lastDailyClaimed = client.prevDailies.get(message.author.id);
  // console.log(lastDailyClaimed + (typeof lastDailyClaimed));
  let streak = client.streaks.get(message.author.id) || {streak: 0, id: message.author.id};
  // if (lastDailyClaimed)
  if (!lastDailyClaimed || lastDailyClaimed == undefined) {
    client.streaks.set(message.author.id, {streak: 1, id: message.author.id});
    let currStats = client.userStats.get(message.author.id) || {dailies: 0, id: message.author.id};
    currStats.dailies++;
    client.userStats.set(message.author.id, currStats);
    // console.log("no previous");
    updateBalance(message.author.id);
    client.prevDailies.set(message.author.id, moment().toString());
  } else {
    // console.log("e");
    dateObj = new Date(lastDailyClaimed);
    momentObj = moment(dateObj);
    if (momentObj.add(24, 'hours').isAfter(moment())) {
      let hoursDiff = momentObj.diff(moment(), 'hours');
      let minutesDiff = momentObj.subtract(hoursDiff, 'hours');
      minutesDiff = minutesDiff.diff(moment(), 'minutes');
      let secondsDiff = momentObj.subtract(minutesDiff, 'minutes');
      secondsDiff = secondsDiff.diff(moment(), 'seconds');
      // message.channel.send(`You can claim your daily rewards again in ${hoursDiff} hours, ${minutesDiff} minutes and ${secondsDiff} seconds.`)
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle(`You can claim your daily rewards again in ${hoursDiff} hours, ${minutesDiff} minutes and ${secondsDiff} seconds.`)
          .setColor(client.EmbedHelper.colors.red)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      })
    } else {
      let currStats = client.userStats.get(message.author.id) || {dailies: 0, id: message.author.id};
      currStats.dailies++;
      client.userStats.set(message.author.id, currStats);
      let dateStreak = new Date(lastDailyClaimed);
      let momentStreak = moment(dateStreak);
      if (momentStreak.add(2400000, 'hours').isAfter(moment())) {
        streak.streak++;
        client.streaks.set(message.author.id, streak);
      } else {
        client.streaks.set(message.author.id, {streak: 1, id: message.author.id});
      }
      client.prevDailies.set(message.author.id, moment().toString());
      updateBalance(message.author.id);
    }
  }
  
  function updateBalance(author) {
    console.log(client.balance.get(author))
    let toAdd = 500;
    let currStreak = client.streaks.get(message.author.id) || {streak: 0};
    let shouldStreak = currStreak.streak % 5 == 0;
    // let streakAdd = Math.floor(0.3 * currStreak.streak) * 100;
    let streakAdd = 0;
    if (shouldStreak) streakAdd = Math.floor(Math.random() * (600 - 400 + 1)) + 400;
    // message.channel.send(shouldStreak);
    toAdd += streakAdd;
    if (!client.balance.get(author) || client.balance.get(author) == undefined) {
      client.balance.set(author, {bal: toAdd, id: author});
    } else {
      let balance = parseInt(client.balance.get(author).bal);
      balance += toAdd;
      client.balance.set(author, {bal: balance, id: author});
    }
    // let str = `You've claimed your daily ${client.emojis.find("name", "bikecoin")}${toAdd} BikeCoin. Check back in 24 hours!`;
    // if (streakAdd != 0) str += `\n\nYou got an additional ${streakAdd} BikeCoin from your current streak of ${streak.streak}!`;
    // str += `\n\nCurrent streak: ${currStreak.streak}`;
    // if (streakAdd != 0) str += `\n\nYou completed a streak of 5 and got an additional bonus of ${streakAdd} BikeCoin!`;
    // else str += `\n\nCurrent streak: ${currStreak.streak}`;
    // message.channel.send(str);
    let description = `Current streak: ${currStreak.streak}`;
    if (streakAdd != 0) description += `\n\nYou completed a streak of 5 and got an additional bonus of ${streakAdd} BikeCoin!`;
    message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle(`You've claimed your daily ${client.emojis.find("name", "bikecoin")}${toAdd} BikeCoin. Check back in 24 hours!`)
        .setDescription(description)
        .setColor(client.EmbedHelper.colors.gold)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    });
    // console.log("e");
  }
  
  /*if (moment().add(5, 'seconds').isAfter(moment())) {
    message.channel.send(`You can use this command again in ${momentObj.diff(moment(), 'seconds')} seconds.`);
    console.log(now);
  } else {
    now = moment();
    client.prevDailies.set(message.author.id, moment());
    message.channel.send("e");
    
    sql.get(`SELECT * FROM prevdailies WHERE userId = "${message.author.id}"`).then(row => {
      if (!row) {
        sql.run("INSERT INTO prevdailies (userId, points, level) VALUES (?, ?, ?)", [message.author.id, moment().toString()]);
      } else {
        sql.run(`UPDATE prevdailies SET lastdaily = ${moment()} WHERE userId = ${message.author.id}`);
      }
    }).catch(() => {
      console.error;
      sql.run("CREATE TABLE IF NOT EXISTS prevdailies (userId TEXT, lastdaily TEXT)").then(() => {
        sql.run("INSERT INTO prevdailies (userId, points, level) VALUES (?, ?, ?)", [message.author.id, moment().toString()]);
      })
    });
    
  }*/
  
};

exports.conf = {
  name: 'daily',
  aliases: ['d', 'dailies'],
  permLevel: 0,
  usage: '+daily'
};
