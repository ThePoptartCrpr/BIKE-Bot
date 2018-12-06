exports.run = (client, message, [type], perms) => {
  let subscriber_role = message.guild.roles.find(role => role.id === '519755106996977666');
  if (message.member.roles.find(role => role.id === subscriber_role.id)) return message.channel.send({
    embed: new Discord.RichEmbed()
      .setTitle('You are already subscribed to events!')
      .setColor(client.EmbedHelper.colors.red)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  });

  message.member.addRole(subscriber_role.id);
  message.channel.send({
    embed: new Discord.RichEmbed()
      .setTitle('👌 | You are now subscribed to event notifications.')
      .setDescription('Unsubscribe anytime with **+unsubscribe**.')
      .setColor(client.EmbedHelper.colors.lime)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  });
};

exports.conf = {
  name: 'subscribe',
  aliases: ['events', 'notifications'],
  permLevel: 0,
  usage: '+subscribe'
};
