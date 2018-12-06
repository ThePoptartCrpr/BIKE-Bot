exports.run = (client, message, [role], perms) => {
  if (perms < 1) return message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle('You do not have permission to make roles mentionable.')
      .setColor(client.EmbedHelper.colors.red)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  });
  if (!role) return message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle('Usage:')
      .setDescription('**+mentionable <role>**')
      .setColor(client.EmbedHelper.colors.red)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  });

  let mentionable_role;

  if (role === 'events') mentionable_role = message.guild.roles.find(role => role.id === '519755106996977666');

  if (!mentionable_role) return message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle('No modifiable role by that name was found!')
      .setDescription('Current available roles:\n\n• Events')
      .setColor(client.EmbedHelper.colors.red)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  });

  if (mentionable_role.mentionable) return message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle(`The ${role} role is already mentionable!`)
      .setColor(client.EmbedHelper.colors.red)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  });

  mentionable_role.setMentionable(true, `Set to mentionable by ${message.author.username}`);
  message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle(`👌 | The ${role} role will now be mentionable until next use.`)
      .setColor(client.EmbedHelper.colors.lime)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  });
};

exports.conf = {
  name: 'mentionable',
  aliases: [],
  permLevel: 0,
  usage: '+mentionable'
};
