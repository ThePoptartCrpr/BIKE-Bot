const events = ["trivia"];
const fs = require('fs');

let eventPersistence = {
  "active": false,
  "type": "inactive"
};

let eventScores = {};
let blankScores = {};

let currPersistence;

exports.run = (client, message, params, perms) => {
  if (params[0] === "start") {
    if (perms < 2) return message.channel.send("You don't have permission to start events.");
    if (!params[1]) return message.channel.send("Usage:\n+event start <event>");
    if (events.indexOf(params[1]) == -1) return message.channel.send(`Invalid event provided. Current supported events:\n\n${events}`);
    startEvent(params[1], message);
  } else if (params[0] === "stop" || params[0] === "end") {
    if (perms < 2) return message.channel.send("You don't have permission to stop events.");
    stopEvent(message);
  } else if (params[0] === "scores") {
    currPersistence = JSON.parse(fs.readFileSync("./.data/files/event_persistence.json"));
    if (currPersistence.active === false) return message.channel.send(`No event is currently in progress.`);
    eventScores = JSON.parse(fs.readFileSync("./.data/files/trivia_event_stats.json"));
    
    var scorearr = Object.keys(eventScores).sort(function(a,b){return eventScores[a]-eventScores[b]});
    var scorestr = "";
    
    var count = 1;
    for (var i = scorearr.length - 1; i >= 0; i--) {
      scorestr += `**#${count}.** ${scorearr[i]}: ${eventScores[scorearr[i]]} Points\n`;
      count++;
    }
    
    if (scorestr === "") scorestr = "Nobody!";
    
    // message.channel.send(`Current scores:\n\n\`\`\`${scorestr}\`\`\``);
    message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle(`📜 | **Current scores:**`)
        .setDescription(`${scorestr}`)
        .setColor(client.EmbedHelper.colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    
  } else {
    message.channel.send("Usage:\n+event start <event>\n+event stop\n+event scores");
  }
  
  function startEvent(event, message) {
    let currPersistence = JSON.parse(fs.readFileSync("./.data/files/event_persistence.json"));
    if (currPersistence.active === true) return message.channel.send(`A ${currPersistence.type} event is already in progress.`);
    eventPersistence.active = true;
    eventPersistence.type = "trivia";
    fs.writeFile("./.data/files/event_persistence.json", JSON.stringify(eventPersistence), (err) => {
      if (err) console.error(err);
    });
    // message.channel.send(`A ${event} event has been started.`);
    message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle(`A ${event} has been started.`)
        .setColor(client.EmbedHelper.colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
  }
  
  function stopEvent(message) {
    currPersistence = JSON.parse(fs.readFileSync("./.data/files/event_persistence.json"));
    if (currPersistence.active === false) return message.channel.send(`No event is currently in progress.`);
    eventPersistence.active = false;
    eventPersistence.type = "inactive";
    
    eventScores = JSON.parse(fs.readFileSync("./.data/files/trivia_event_stats.json"));
    
    var scorearr = Object.keys(eventScores).sort(function(a,b){return eventScores[a]-eventScores[b]});
    var scorestr = "";
    
    var count = 1;
    for (var i = scorearr.length - 1; i >= 0; i--) {
      scorestr += `${count}. ${scorearr[i]}: ${eventScores[scorearr[i]]} Points\n`;
      count++;
    }
    
    if (scorestr === "") scorestr = "Nobody!";
    
    // message.channel.send(`Event over. Final scores:\n\n\`\`\`${scorestr}\`\`\``);
    
    message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle(`📜 | **Final scores:**`)
        .setDescription(`${scorestr}`)
        .setColor(client.EmbedHelper.colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    
    fs.writeFile("./.data/files/event_persistence.json", JSON.stringify(eventPersistence), (err) => {
      if (err) console.error(err);
    });
    fs.writeFile("./.data/files/trivia_event_stats.json", JSON.stringify(blankScores), (err) => {
      if (err) console.error(err);
    });
  }
};

exports.conf = {
  name: 'event',
  aliases: [],
  permLevel: 0,
  usage: '+event'
};
