let moment = require('moment');
const yesno = ["y", "n", "yes", "no"];

exports.run = (client, message, params, perms) => {
  let user = message.mentions.users.first();
  if (user && user.bot) return message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle(`You cannot give reputation points to a bot!`)
      .setColor(client.EmbedHelper.colors.red)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  })
  
  let lastRepStr = client.prevReps.get(message.author.id);
  if (!lastRepStr) lastRepStr = moment().subtract(1, 'months').toString();
  
  let dateObj = new Date(lastRepStr);
  let lastRep = moment(dateObj);
  
  if (lastRep.add(24, 'hours').isAfter(moment())) {
    let hoursDiff = lastRep.diff(moment(), 'hours');
    let minutesDiff = lastRep.subtract(hoursDiff, 'hours');
    minutesDiff = lastRep.diff(moment(), 'minutes');
    let secondsDiff = lastRep.subtract(minutesDiff, 'minutes');
    secondsDiff = lastRep.diff(moment(), 'seconds');
    // message.channel.send(`You can give a reputation point again in ${hoursDiff} hours, ${minutesDiff} minutes and ${secondsDiff} seconds.`);
    message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle(`You can give a reputation point again in ${hoursDiff} hours, ${minutesDiff} minutes and ${secondsDiff} seconds.`)
        .setColor(client.EmbedHelper.colors.yellow)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
  } else {
    if (!user && params[0]) {
      let search = params.join(" ");
      user = message.guild.members.find(val => val.user.username.toLowerCase() === params[0].toLowerCase());
      if (!user) user = message.guild.members.find(val => val.user.username.toLowerCase().indexOf(params[0].toLowerCase()) != -1);
      // if (!user) user = message.guild.members.find(val => { if (val.nickname) { if (val.nickname.toLowerCase().indexOf(params[0].toLowerCase()) != -1) return true; return false; } });
      if (!user) user = message.guild.members.find(m => m.nickname ? (m.nickname.toLowerCase().indexOf(params[0].toLowerCase()) > -1) : false);
      // if (!user) user = message.guild.members.find(val => val.nickname.toLowerCase().indexOf(params[0].toLowerCase()) != -1 || val.user.username.toLowerCase().indexOf(params[0].toLowerCase()) != -1);
      // console.log(user);
      // if (!user) return message.channel.send("Invalid user!");
      if (!user) return message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle(`Please mention a valid user.`)
          .setColor(client.EmbedHelper.colors.red)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      })
      // if (user.user.bot) return message.channel.send("You cannot give reputation to a bot!");
      if (user.user.bot) return message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle(`You cannot give reputation points to a bot!`)
          .setColor(client.EmbedHelper.colors.red)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      })
      
      user = user.user;
      
      // message.channel.send(`Are you sure you want to give a reputation point to ${user.username}#${user.discriminator}? (__Y__es / __N__o)`);
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle(`Are you sure you want to give a reputation point to ${user.username}#${user.discriminator}?`)
          .setDescription("(__Y__es / __N__o)")
          .setColor(client.EmbedHelper.colors.yellow)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      })
      const filter = m => m.author === message.author && yesno.indexOf(m.content.toLowerCase()) != -1;
      message.channel.awaitMessages(filter, {max: 1, time: 10000, errors: ['time']})
        .then(collected => {
          if (collected.first().content.toLowerCase() === "y" || collected.first().content.toLowerCase() === "yes") {
            giveRep();
          } else {
            // message.channel.send("Cancelled.");
            message.channel.send({
              embed: new client.Discord.MessageEmbed()
                .setTitle(`Reputation cancelled.`)
                .setColor(client.EmbedHelper.colors.red)
                .setTimestamp()
                .setFooter("BIKE Alliance", client.user.avatarURL())
            })
          }
        })
        // .catch(collected => message.channel.send("Ran out of time, cancelled."));
        .catch(collected => message.channel.send({
          embed: new client.Discord.MessageEmbed()
            .setTitle(`Ran out of time, reputation cancelled.`)
            .setColor(client.EmbedHelper.colors.red)
            .setTimestamp()
            .setFooter("BIKE Alliance", client.user.avatarURL())
        }))
    } else {
      giveRep();
    }
  }
  
  function giveRep() {
    // if (!user) return message.channel.send("Usage: \n+rep <@user>");
    if (!user) return message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle(`You can award a reputation point!`)
        .setDescription("Usage: +rep <@user>")
        .setColor(client.EmbedHelper.colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    // if (user === message.author) return message.channel.send("You cannot give yourself a reputation point.");
    if (user === message.author) return message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle(`You cannot give reputation points to yourself!`)
        .setColor(client.EmbedHelper.colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    let sentRep = client.reputation.get(message.author.id) || {rep: 0, sent: 0, id: message.author.id};
    let currRep = client.reputation.get(user.id) || {rep: 0, sent: 0, id: user.id};
    currRep.rep++;
    sentRep.sent++;
    client.reputation.set(message.author.id, sentRep);
    client.reputation.set(user.id, currRep);
    client.prevReps.set(message.author.id, moment().toString());
    message.channel.send(`\:100: | ${message.author.username} has given a reputation point to ${user}.`);
    /*message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle(`💯 | ${message.author.username} has given a reputation point to ${user}!`)
        .setColor(client.EmbedHelper.colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })*/
  }
  
};

exports.conf = {
  name: 'rep',
  aliases: ['r', 'reputation'],
  permLevel: 0,
  usage: '+rep'
};
