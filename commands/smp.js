exports.run = (client, message, params, perms) => {
  if (perms < 1) return message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle("You do not have permission to grant the SMP role.")
      .setColor(client.EmbedHelper.colors.red)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  });
  
  if (!message.mentions.members.first()) return message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle("Usage:")
      .setDescription("+smp <@user>")
      .setColor(client.EmbedHelper.colors.red)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  });
  
  let member = message.mentions.members.first();
  
  let smp_role = message.guild.roles.find("name", "SMP");
  
  member.roles.add(smp_role.id);
  
  message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle(`:ok_hand: | Successfully gave the SMP role to ${member.user.username}#${member.user.discriminator}.`)
      .setColor(client.EmbedHelper.colors.lime)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  });
};

exports.conf = {
  name: 'smp',
  aliases: [],
  permLevel: 0,
  usage: '+smp'
};
