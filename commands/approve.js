exports.run = (client, message, [user], perms) => {
  
  /*
  pending: {
    discord-id: {
      uuid: mc-uuid;
    }
  }
   */
  if (perms < 1) return message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle('You do not have permission to accept account connections.')
      .setColor(client.EmbedHelper.colors.red)
      .setTimestamp()
      .setFooter('BIKE Alliance', client.user.avatarURL())
  });
  
  let member = message.mentions.member.first();
  if (!member) return message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle('Usage:')
      .setDescription('**+approve <@user>**')
      .setColor(client.EmbedHelper.colors.red)
      .setTimestamp()
      .setFooter('BIKE Alliance', client.user.avatarURL())
  });
  
  if (!client.connections.get('pending')[member.id]) return message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle('That user has not requested a new connection!')
      .setDescription('If you would like to force override their existing account connection, please use **+connect <@user> <MC username>**')
      .setColor(client.EmbedHelper.colors.yellow)
      .setTimestamp()
      .setFooter('BIKE Alliance', client.user.avatarURL())
  });
  
  let uuid = client.connections.get('pending')[member.id].mc;
};

exports.conf = {
  name: 'approve',
  aliases: [],
  permLevel: 0,
  usage: '+approve'
};
