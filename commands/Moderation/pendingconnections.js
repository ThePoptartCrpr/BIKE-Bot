exports.run = async (client, message, [user], perms) => {
  if (perms < 1) return message.channel.send({
    embed: client.embed()
      .setTitle('You do not have permission to view pending connections.')
      .setColor(client.EmbedHelper.colors.red)
  });
  
  let pending = Object.keys(client.connections.get('pending'));
  
  if (pending.length === 0) return message.channel.send({
    embed: client.embed()
      .setTitle('There are no currently pending connections!')
      .setColor(client.EmbedHelper.colors.orange)
  })
  
  let list = '';
  let traversed = 0, maxInList = 10;
  pending.forEach(id => {
    let user = client.users.find(user => user.id === id);
    if (user && traversed < maxInList) list += `• ${user} (${user.username}#${user.discriminator})\n`;
  });
  
  message.channel.send({
    embed: client.embed()
      .setTitle(`First ${maxInList} pending connections:`)
      .setDescription(`${list}\n\n**${pending.length}** pending connections in total.`)
      .addField('View and accept an individual user\'s pending connection with **+connection <@user>**.', '\u200B')
      .setColor(client.EmbedHelper.colors.yellow)
  });
};

exports.conf = {
  name: 'pendingconnections',
  aliases: ['connections', 'pending'],
  permLevel: 0,
  usage: '+pendingconnections'
};
