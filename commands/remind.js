const moment = require('moment');

exports.run = (client, message, params, perms) => {
  if (params[0] === "list" && !params[1]) {
    const reminders = client.reminders.filter(r => r.id === message.author.id);
    console.log(Array.from(reminders).length);
    if (Array.from(reminders).length === 0) return message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle("You do not have any active reminders!")
        .setDescription("Create a new reminder with **+remind <reminder> in <time>**")
        .setColor(client.EmbedHelper.colors.yellow)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    });
    // str = "Your current reminders: \n";
    str = "";
    reminders.forEach(reminder => {
      console.log(reminder);
      let dateObj = new Date(reminder.timestamp);
      let momentObj = moment(dateObj);
      let hoursDiff = momentObj.diff(moment(), 'hours');
      let minutesDiff = momentObj.subtract(hoursDiff, 'hours');
      minutesDiff = minutesDiff.diff(moment(), 'minutes');
      let secondsDiff = momentObj.subtract(minutesDiff, 'minutes');
      secondsDiff = secondsDiff.diff(moment(), 'seconds');
      str += `\n**${reminder.reminder}** in ${hoursDiff} hours, ${minutesDiff} minutes and ${secondsDiff} seconds`;
    })
    // message.channel.send(`${str}`);
    message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle("Your current reminders:")
        .setDescription(str)
        .setColor(client.EmbedHelper.colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
  } else {
    // if (!params[0]) return message.channel.send('Usage:\n+remind <reminder> in <amount> <unit>\n+remind list\n\nExample:\n+remind This is a test reminder! in 12 minutes');
    if (!params[0]) return message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle("Usage:")
        .setDescription("+remind <reminder> in <amount> <unit>\n+remind list\n\nExample:\n+remind This is a test reminder! in 12 minutes")
        .setColor(client.EmbedHelper.colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    args = params.join(' ');
    args = args.split(" in ");
    console.log(args);
    if (args.length === 1) return message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle("Usage:")
        .setDescription("+remind <reminder> in <amount> <unit>\n+remind list\n\nExample:\n+remind This is a test reminder! in 12 minutes")
        .setColor(client.EmbedHelper.colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    let reminder = args[0];
    console.log(args[1]);
    if (!args[1].endsWith("hours") && !args[1].endsWith("hour") && !args[1].endsWith("minutes") && !args[1].endsWith("minute") && !args[1].endsWith("seconds") && !args[1].endsWith("second")) return message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle("Usage:")
        .setDescription("+remind <reminder> in <amount> <unit>\n+remind list\n\nExample:\n+remind This is a test reminder! in 12 minutes")
        .setColor(client.EmbedHelper.colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    time = args[1];
    args = time.split(' ');
    unit = args[1];
    length = parseInt(args[0]);
    if (isNaN(length)) return message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle("Usage:")
        .setDescription("+remind <reminder> in <amount> <unit>\n+remind list\n\nExample:\n+remind This is a test reminder! in 12 minutes")
        .setColor(client.EmbedHelper.colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    // message.channel.send(`I'll remind you in ${length} ${unit}.`);
    message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle("Got it!")
        .setDescription(`I'll remind you to **${reminder}** in ${length} ${unit}.`)
        .setColor(client.EmbedHelper.colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    momentStamp = moment();
    if (unit === "hour" || unit === "hours") {
      momentStamp = momentStamp.add(length, 'hours');
    } else if (unit === "minute" || unit === "minutes") {
      momentStamp = momentStamp.add(length, 'minutes');
    } else if (unit === "second" || unit === "seconds") {
      momentStamp = momentStamp.add(length, 'seconds');
    }

    /*let testMomentStamp = moment();
    let testDateStamp = testMomentStamp.toDate();
    let testDateStamp2 = Date.now();

    console.log(testMomentStamp);
    console.log(testDateStamp);
    console.log(testDateStamp2);*/

    client.reminders.set(`${momentStamp.toString()}`, {
      id: message.author.id,
      reminder: reminder,
      timestamp: momentStamp.toString()
    });

  }
};

exports.conf = {
  name: 'remind',
  aliases: ['reminder', 'remindme'],
  permLevel: 0,
  usage: '+remind'
};
