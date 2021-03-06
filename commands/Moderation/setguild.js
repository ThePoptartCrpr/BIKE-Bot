let guilds = ["hypixel knights", "hk", "infamy", "defiant", "def", "guest"];

exports.run = (client, message, params, perms) => {
  // let mod_role = message.guild.roles.find('name', "Moderator");
  // if (mod_role && message.member.roles.has(mod_role.id)) permlvl = 2;
  
  if (perms < 1) return message.channel.send("You do not have permission to set a user's guild role.");
  if (!message.mentions.members.first() || !params[1]) return message.channel.send("Usage:\n+setguild <@user> <guildname|Guest>");
  
  let user = message.mentions.members.first();
  let givenGuild = params;
  givenGuild.splice(0, 1);
  givenGuild = givenGuild.join(" ");
  givenGuild = givenGuild.toLowerCase();
  console.log(givenGuild);
  
  // if (guilds.indexOf(givenGuild) == -1) return message.channel.send("That's not a valid guild role.");
  if (guilds.indexOf(givenGuild) == -1) return message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle("That's not a valid guild role.")
      .setColor(client.EmbedHelper.colors.red)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  });
  
  let hk_role = message.guild.roles.find(role => role.name === "Hypixel Knights");
  let defiant_role = message.guild.roles.find(role => role.name === "Defiant");
  let infamy_role = message.guild.roles.find(role => role.name === "Infamy");
  let guest_role = message.guild.roles.find(role => role.name === "Guest");
  let awaiting_role = message.guild.roles.find(role => role.name === "Awaiting Roles");
  
  let guild_role;
  let color;
  
  if (givenGuild == "hypixel knights" || givenGuild == "hk") { 
    guild_role = hk_role;
  } else if (givenGuild == "infamy") {
    guild_role = infamy_role;
  } else if (givenGuild == "defiant" || givenGuild == "def") {
    guild_role = defiant_role;
  } else {
    guild_role = guest_role;
  }
  
  if (user.roles.has(guest_role.id)) user.roles.remove(guest_role.id);
  if (user.roles.has(awaiting_role.id)) user.roles.remove(awaiting_role.id);
  if (user.roles.has(hk_role.id)) user.roles.remove(hk_role.id);
  if (user.roles.has(defiant_role.id)) user.roles.remove(defiant_role.id);
  if (user.roles.has(infamy_role.id)) user.roles.remove(infamy_role.id);
  
  user.roles.add(guild_role.id);
  
  message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle(`\👌 | Successfully updated roles for ${user.user.username}.`)
      .setColor(guild_role.hexColor)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  })
};

exports.conf = {
  name: 'setguild',
  aliases: ['sg'],
  permLevel: 0,
  usage: '+setguild'
};
