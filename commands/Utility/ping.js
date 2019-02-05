exports.run = (client, message, guild, params) => {
  message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle("Ping?")
      .setColor(client.EmbedHelper.colors.yellow)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  }).then(msg => {
    msg.edit({
      embed: new client.Discord.MessageEmbed()
        .setTitle("Response time:")
        .setDescription(`${msg.createdTimestamp - message.createdTimestamp}ms`)
        .setColor(client.EmbedHelper.colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    });
  });
};

exports.conf = {
  name: 'ping',
  aliases: [],
  permLevel: 0,
  usage: '+ping'
};
