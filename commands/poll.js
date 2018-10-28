exports.run = (client, message, params, perms) => {
  if (perms < 2) return message.channel.send("Sorry, only staff are allowed to create polls at this time. Please contact a moderator if you would like to start a poll.");
  if (!params[0]) return message.channel.send("Usage:\n+poll start <question> <choices>\n+poll check\n+poll end");
  if ((params[0] === "end" || params[0] === "stop") && !params[1]) return stopPoll();
  if (params[0] === "check") return checkPoll();
  if (params[0] === "start") {
    let args = params;
    args.shift();
    args = args.join(" ");
    if (args.indexOf("|") == -1) return message.channel.send("At least one question and one choice must be provided. Please separate your question and choices with pipe characters, e.g. `+poll Question|choice1|choice2|choice3`");
    if (((args.match(/\|/g) || []).length) > 6) return message.channel.send("Only up to six choices are supported at this time.");
    message.delete();
    args = args.split("|");
    let question = args[0];
    let str = "";
    let count = 0;
    for (var i = 1; i < args.length; i++) {
      if (count == 0) str += ":regional_indicator_a: - ";
      if (count == 1) str += ":regional_indicator_b: - ";
      if (count == 2) str += ":regional_indicator_c: - ";
      if (count == 3) str += ":regional_indicator_d: - ";
      if (count == 4) str += ":regional_indicator_e: - ";
      if (count == 5) str += ":regional_indicator_f: - ";
      str += args[i].trim() + "\n";
      count++;
    }
    let responses = args.splice(0, 1);
    // console.log(args);
    message.channel.send(`**${question}**\n\n${str}`).then(function(msg) {
      try {
        client.currPoll.set("poll", {channel: message.channel.id, message: msg.id, question: question, choices: args})
      } catch(e) {
        console.log(e);
      }
      if (count > 0) msg.react("🇦").then(() => {
        if (count > 1) msg.react("🇧").then(() => {
          if (count > 2) msg.react("🇨").then(() => {
            if (count > 3) msg.react("🇩").then(() => {
              if (count > 4) msg.react("🇪").then(() => {
                if (count > 5) msg.react("🇫")
              })
            })
          });
        });
      });
    }).catch(function() {
      console.error;
    });
  } else {
    message.channel.send("Usage:\n+poll start <question> <choices>\n+poll check\n+poll end");
  }
  
  function stopPoll() {
    if (!client.currPoll.get("poll")) return message.channel.send("No poll is active at this time.");
    let channelId = client.currPoll.get("poll").channel;
    let channel = client.channels.filter(c => c.type === "text").get(channelId);
    
    if (!channel) return message.channel.send("Poll channel not found.");
    
    let msgId = client.currPoll.get("poll").message;
    
    channel.messages.fetch(msgId)
    .then(msg => {
      if (!msg) return message.channel.send("Poll message not found.");
      // msg.edit("e");
      
      let pollQuestion = client.currPoll.get("poll").question;
      let pollChoices = client.currPoll.get("poll").choices;
      
      let str = "";
      
      let arr = msg.reactions.array();
      let firstKey = arr[0];
      
      /*msg.reactions.every(val => {
        console.log(val._emoji);
      });*/
      
      // console.log(msg.reactions.get('🇦').count, "is the reaction");
      
      for (let i = 0; i < pollChoices.length; i++) {
        let currEmoji = "🇦";
        if (i == 0) currEmoji = "🇦";
        if (i == 1) currEmoji = "🇧";
        if (i == 2) currEmoji = "🇨";
        if (i == 3) currEmoji = "🇩";
        if (i == 4) currEmoji = "🇪";
        if (i == 5) currEmoji = "🇫";
        // message.channel.send(currEmoji);
        let votes = msg.reactions.get(currEmoji).count - 1 | 0;
        str += `\n${currEmoji} - ${pollChoices[i]}: ${votes} votes`;
      }
      
      message.channel.send(`Final results:\n\n**${pollQuestion}**\n\n${str}`);
      client.currPoll.delete("poll");
    })
    .catch(console.error);
  }
  
  function checkPoll() {
    if (!client.currPoll.get("poll")) return message.channel.send("No poll is active at this time.");
    let channelId = client.currPoll.get("poll").channel;
    let channel = client.channels.filter(c => c.type === "text").get(channelId);
    
    if (!channel) return message.channel.send("Poll channel not found.");
    
    let msgId = client.currPoll.get("poll").message;
    
    channel.messages.fetch(msgId)
    .then(msg => {
      if (!msg) return message.channel.send("Poll message not found.");
      
      let pollQuestion = client.currPoll.get("poll").question;
      let pollChoices = client.currPoll.get("poll").choices;
      
      let str = "";
      
      let arr = msg.reactions.array();
      let firstKey = arr[0];
      
      for (let i = 0; i < pollChoices.length; i++) {
        let currEmoji = "🇦";
        if (i == 0) currEmoji = "🇦";
        if (i == 1) currEmoji = "🇧";
        if (i == 2) currEmoji = "🇨";
        if (i == 3) currEmoji = "🇩";
        if (i == 4) currEmoji = "🇪";
        if (i == 5) currEmoji = "🇫";
        let votes = msg.reactions.get(currEmoji).count - 1 | 0;
        str += `\n${currEmoji} - ${pollChoices[i]}: ${votes} votes`;
      }
      
      message.channel.send(`Current results:\n\n**${pollQuestion}**\n\n${str}`);
    })
    .catch(console.error);
  }
  
};

exports.conf = {
  name: 'poll',
  aliases: [],
  permLevel: 0,
  usage: '+poll <question> <choices>'
};
