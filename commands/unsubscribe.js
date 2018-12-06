exports.run = (client, message, [type], perms) => {
  let subscriber_role = message.guild.roles.find(role => role.id === '519755106996977666');
  if (!message.member.roles.find(role => role.id === subscriber_role.id)) return message.channel.send({
    embed: new Discord.RichEmbed()
      .setTitle('You not subscribed to event notifications!')
      .setDescription('You can subscribe anytime with **+subscribe**.')
      .setColor(client.EmbedHelper.colors.red)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  });

  message.member.roles.remove(subscriber_role.id);
  message.channel.send({
    embed: new Discord.RichEmbed()
      .setTitle('👌 | You are no longer subscribed to event notifications.')
      .setDescription('You can subscribe again with **+subscribe**.')
      .setColor(client.EmbedHelper.colors.lime)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  });
};

exports.conf = {
  name: 'unsubscribe',
  aliases: [],
  permLevel: 0,
  usage: '+unsubscribe'
};
