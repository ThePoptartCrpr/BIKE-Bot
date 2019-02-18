exports.run = (client, message, params, perms) => {
  let guild = params.join('').toLowerCase();
  let verbose = false;
  
  // Clean
  if (guild.indexOf('verbose') != -1) {
    guild = guild.slice(0, guild.indexOf('verbose'));
    verbose = true;
  }
  guild = guild === 'blank' ? null : guild;
  if (!client.bikeguilds.get(guild)) {
    // Aliases
    if (guild === 'hk') guild = 'hypixelknights';
  }
  
  guild = client.bikeguilds.get(guild);
  if (!guild) return message.channel.send({
    embed: client.embed()
      .setTitle('Guild not found!')
      .setDescription('Usage: \n**+guild <guild> [verbose]**')
      .setColor(client.EmbedHelper.colors.red)
  });
  
  let guildId = '429734306966011914';
  let guildRole = client.guilds.find(guild => guild.id === guildId).roles.find(role => role.id === `${guild.roleId}`);
  message.channel.send({
    embed: client.embed()
      .setAuthor(guild.displayName, guild.art.iconUrl, guild.social.thread)
      .setImage(guild.art.bannerUrl)
      .setColor(guildRole.hexColor)
  });
  
  let msg = `**Discord invite**: ${guild.social.discord}`;
  if (verbose) {
    let toAdd = '';
    if (guild.social.youtube) toAdd += `\n**YouTube channel**:\n${guild.social.youtube}`;
    if (guild.social.twitter) toAdd += `\n**Twitter account**:\n${guild.social.twitter}`;
    toAdd += `\n**Forum thread**:\n${guild.social.thread}\n\n---`
    
    msg = `${toAdd}\n\n${msg}`;
  }
  message.channel.send(msg);
}

exports.conf = {
  name: 'guild',
  aliases: ['g'],
}
