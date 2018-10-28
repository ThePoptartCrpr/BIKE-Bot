exports.run = (client, message, guild, params) => {
  message.channel.send('Ping?').then(msg => {
    msg.edit(`Response time: \`${msg.createdTimestamp - message.createdTimestamp}ms\``);
  });
};

exports.conf = {
  name: 'ping',
  aliases: [],
  permLevel: 0,
  usage: '+ping'
};
