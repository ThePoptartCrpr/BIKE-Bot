const moment = require('moment');

module.exports = message => {
  let client = message.client;
  
  if (message.author.bot) return;
  
  if (message.channel.type !== "text") return;
  if (message.guild.id != "271368793865977856" && message.guild.id != "269652484274913282" && message.guild.id != "429734306966011914" && message.guild.id != "452884059459158036") return;

  if (message.mentions.everyone && message.author.id === "198466968725094400") {
    message.react(client.emojis.find("name", "pingsock"));
  }
  
  function updatePoints(message) {
    if (message.content.startsWith(client.prefix)) return;
    
    let momentObj = moment().subtract(10, 'minutes');;
    
    if (client.points.get(message.author.id) || client.points.get(message.author.id) != undefined) {
      let dateObj = new Date(client.points.get(message.author.id).lastsent);
      momentObj = moment(dateObj);
    }
    
    if (momentObj.add(2, 'minutes').isAfter(moment())) return;
    
    let currPoints = client.points.get(message.author.id) || {points: 0, level: 0, lastsent: moment().toString(), id: message.author.id};
    let currBalance = client.balance.get(message.author.id) || {bal: 0, id: message.author.id};
    let randPoints = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
    let randBal = Math.floor(Math.random() * 2);
    currPoints.points += randPoints;
    currBalance.bal += randBal;
    client.balance.set(message.author.id, currBalance);
    let currLevel = Math.floor(0.1 * Math.sqrt(currPoints.points));
    if (currPoints.level < currLevel) {
      // let av = Math.floor(120 * Math.sqrt(currLevel));
      // let av = Math.floor(Math.pow(Math.sqrt(20), 3.5) * 3.5);
      let av = Math.floor(Math.pow(Math.sqrt(currLevel), 2.5) * 15);
      let min = av - 50;
      if (min <= 0) min = 1;
      let max = av + 50;
      let balAdd = Math.floor(Math.random() * (max - min + 1)) + min;
      
      let currBal = client.balance.get(message.author.id) || {bal: 0, id: message.author.id};
      currBal.bal += balAdd;
      client.balance.set(message.author.id, currBal);
      message.channel.send(`Congratulations, ${message.author}! You are now level **${currLevel}**! Here's a bonus of ${balAdd} BikeCoin!`);
      currPoints.level = currLevel;
    }
    currPoints.lastsent = moment().toString();
    
    client.points.set(message.author.id, currPoints);
    
    /*if (!client.points.get(message.author) || client.points.get(message.author) == undefined) {
      client.points.set(message.author, {points: randPoints, level: 0, lastsent: moment().toString(), id: message.author.id});
    } else {
      
    }*/
  }
  
  updatePoints(message);
  
  /*function updateBalance(author) {
    console.log(client.balance.get(author))
    if (!client.balance.get(author) || client.balance.get(author) == undefined) {
      client.balance.set(author, {bal: 500, id: author});
    } else {
      let balance = parseInt(client.balance.get(author).bal);
      balance += 500;
      client.balance.set(author, {bal: balance, id: author});
    }
  }*/

  if (!message.content.startsWith(client.prefix)) return;
  let command = message.content.split(' ')[0].slice(client.prefix.length).toLowerCase();
  let params = message.content.split(' ').slice(1);

  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  } else {
    // message.channel.send(`Unknown command. Try ${client.prefix}help for a list of commands.`);
    message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle("Unknown command.")
        .setDescription(`Try ${client.prefix}help for a list of commands.`)
        .setColor(client.EmbedHelper.colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
  }

  if (cmd) {
    if (perms < cmd.conf.permLevel) return message.channel.send('You do not have permission to run that command.');
    try { 
      cmd.run(client, message, params, perms);
    } catch(e) {
      console.error(e);
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("An error occurred while performing this command.")
          .setDescription(`Please tell ${client.users.get('198466968725094400')} to check console.`)
          .setColor(client.EmbedHelper.colors.red)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      })
    }
  }

  // console.log(`[${new Date().toLocaleTimeString()}]: ${command} ${params.join(" ")}`);
  client.log(`${message.author.username}#${message.author.discriminator}: ${command} ${params.join(" ")}`);
}
