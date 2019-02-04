const request = require('request');

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
  
  let member = message.mentions.members.first();
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
  
  request.get(`https://api.mojang.com/user/profiles/${uuid}/names`, (err, response, body) => {
    if (err || !body) return console.error(err);
    
    let data = JSON.parse(body);
    let username = data[data.length].name;
    
    // TODO: hypixel lookup as well to respond with guild info
    message.channel.send({
      embed: client.embed()
        .setTitle(`Are you sure you want to approve ${member.user.username}#${member.user.discriminator}'s connection to **${username}**?`)
        .setDescription('(__Y__es / __N__o)')
        .setColor(client.EmbedHelper.colors.yellow)
    });
    const filter = m => m.author === message.author && ['y', 'n', 'yes', 'no'].indexOf(m.content.toLowerCase()) != -1;
    message.channel.awaitMessages(filter, {max: 1, time: 10000, errors: ['time']})
      .then(collected => {
        if (collected.first().content.toLowerCase() === "y" || collected.first().content.toLowerCase() === "yes") {
          let pending = client.connections.get('pending');
          let connected = client.connections.get('connected');
          delete pending[member.id];
          connected[member.id] = { mc: uuid };
          client.connections.set('pending', pending);
          client.connections.set('connected', connected);
          message.channel.send({
            embed: client.embed()
              .setTitle(`👌 | ${member.user.username}#${member.user.discriminator}'s Minecraft account connection has been approved.`)
              .setColor(client.EmbedHelper.colors.lime)
          });
        } else {
          message.channel.send({
            embed: new client.Discord.MessageEmbed()
              .setTitle(`Account connection approval cancelled.`)
              .setColor(client.EmbedHelper.colors.red)
              .setTimestamp()
              .setFooter("BIKE Alliance", client.user.avatarURL())
          });
        }
      })
      .catch(collected => message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle(`Ran out of time, connection cancelled.`)
          .setColor(client.EmbedHelper.colors.red)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      }));
  });
};

exports.conf = {
  name: 'approve',
  aliases: [],
  permLevel: 0,
  usage: '+approve'
};
