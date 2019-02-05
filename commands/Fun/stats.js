// const request = require('request');

exports.run = (client, message, params, perms) => {
  if (params.length < 2) return message.channel.send("Usage: +stats <username> <game>");
  let name = params[0];
  let game = params[1];
  
  message.channel.startTyping();
  
  // request.get(`http://hypixel.kerbybit.com/stats/`)
};

exports.conf = {
  name: 'stats',
  aliases: [],
  permLevel: 0,
  usage: '+stats'
};
