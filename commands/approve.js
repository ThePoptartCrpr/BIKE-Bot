const bikeGuilds = ['Hypixel Knights', 'Defiant', 'Infamy']

exports.run = async (client, message, [user], perms) => {
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
  
  let player = await client.hypixelapi.getPlayer('uuid', uuid).then(data => data.player).catch(error => {
    client.error(error);
    return message.channel.send({
      embed: new client.embed()
        .setTitle('An error occurred.')
        .setDescription(`Please tell ${client.users.get('198466968725094400')} to check console.`)
        .setColor(client.EmbedHelper.colors.red)
    });
  });
  
  let guildId = await client.hypixelapi.findGuild('member', uuid).then(guild => guild.guild);
  let guildName = guildId ? await client.hypixelapi.getGuild(guildId).then(guild => guild.guild.name) : 'None';
  
  message.channel.send({
    embed: client.embed()
      .setTitle(`${member.user.username}#${member.user.discriminator}'s account connection request`)
      .addField('Discord account:', member)
      .addField('Username:', `**${player.displayname}**`)
      .addField('Guild:', `**${guildName}**`)
      .addField('Is in BIKE?', bikeGuilds.indexOf(guildName) != -1 ? '**Yes**' : '**No**')
      .addField('\u200B\nApprove this connection?', ' - __Y__es to approve\n - __N__o to discard\n - __cancel__ to cancel')
      .setColor(client.EmbedHelper.colors.yellow)
  });
  const filter = m => m.author === message.author && ['y', 'n', 'yes', 'no', 'cancel'].indexOf(m.content.toLowerCase()) != -1;
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
        client.modLog(
          `**Type**: Account connection approval\n**Account connection**: ${player.displayname}`,
          false,
          member.user,
          message.author,
          client.EmbedHelper.colors.orange
        );
      } else if (collected.first().content.toLowerCase() === 'cancel') {
        message.channel.send({
          embed: new client.Discord.MessageEmbed()
            .setTitle(`Account connection approval cancelled.`)
            .setDescription('You can still go back to approve it later.')
            .setColor(client.EmbedHelper.colors.red)
            .setTimestamp()
            .setFooter("BIKE Alliance", client.user.avatarURL())
        });
      } else {
        let pending = client.connections.get('pending');
        delete pending[member.id];
        client.connections.set('pending', pending);
        message.channel.send({
          embed: client.embed()
            .setTitle(`${member.user.username}#${member.user.discriminator}'s connection has been discarded.`)
            .setColor(client.EmbedHelper.colors.orange)
        });
        client.modLog(
          `**Type**: Account connection discard\n**Account connection attempted with**: ${player.displayname}`,
          false,
          member.user,
          message.author,
          client.EmbedHelper.colors.orange
        );
      }
    })
    .catch(collected => {
      console.log(collected);
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle(`Ran out of time, connection cancelled.`)
          .setDescription('You can still go back to approve it later.')
          .setColor(client.EmbedHelper.colors.red)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
    });
};

exports.conf = {
  name: 'approve',
  aliases: ['connection'],
  permLevel: 0,
  usage: '+approve'
};
