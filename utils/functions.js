module.exports = (client => {
  Object.equals = function( x, y ) {
    if ( x === y ) return true;
      // if both x and y are null or undefined and exactly the same

    if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
      // if they are not strictly equal, they both need to be Objects

    if ( x.constructor !== y.constructor ) return false;
      // they must have the exact same prototype chain, the closest we can do is
      // test there constructor.

    for ( var p in x ) {
      if ( ! x.hasOwnProperty( p ) ) continue;
        // other properties were tested using x.constructor === y.constructor

      if ( ! y.hasOwnProperty( p ) ) return false;
        // allows to compare x[ p ] and y[ p ] when set to undefined

      if ( x[ p ] === y[ p ] ) continue;
        // if they have the same strict value or identity then they are equal

      if ( typeof( x[ p ] ) !== "object" ) return false;
        // Numbers, Strings, Functions, Booleans must be strictly equal

      if ( ! Object.equals( x[ p ],  y[ p ] ) ) return false;
        // Objects and Arrays must be tested recursively
    }

    for ( p in y ) {
      if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
        // allows x[ p ] to be set to undefined
    }
    return true;
  }
  
  // Mod log utilities
  client.embed = () => {
    return new client.Discord.MessageEmbed()
      .setTimestamp()
      .setFooter('BIKE Alliance', client.user.avatarURL())
  }
  
  client.modLog = (description, isModCase, member, moderator, color) => {
    let channel = client.channels.find(channel => channel.id === process.env.MODLOG_CHANNEL);
    if (!channel) return client.log('ERROR | NO MODLOGS CHANNEL');
    
    type = isModCase ? 'case' : 'action';
    caseNo = 0;
    
    if (moderator) description += `\n**Responsible moderator**: ${moderator.username}#${moderator.discriminator}`
    
    channel.send({
      embed: client.embed()
        .setAuthor(`${member.username}#${member.discriminator} (ID ${member.id})`, member.avatarURL())
        .setDescription(description)
        .setColor(color ? color : client.EmbedHelper.colors.orange)
        .setFooter(type === 'case' ? `Case ${caseNo} | BIKE Moderation` : `Action Record | Bike Moderation`, client.user.avatarURL())
    }).then(modMsg => {
      
      // Work in progress dynamic case system, just leaving here for now
      /*let cases = 0;
      client.cases.forEach(caseNo => cases = caseNo.case);
      let moderator = message.author;
      let caseNo = cases;
      caseNo++;
      let obj = info;
      info.case = caseNo;
      info.id = user.id;
      info.type = type;
      
      client.cases.set(caseNo, {case: caseNo, id: user.id, type: "warn", length: "n/a", reason: reason, moderator: moderator.id, msgid: modMsg.id});*/
    })
  }
  
  // Role utilities
  client.updateRoles = async (userId, uuid) => {
    let guild = client.guilds.find(guild => guild.id === '429734306966011914');
    // let guild = client.guilds.find(guild => guild.id === '269652484274913282');
    if (!guild) return;
    
    let member = guild.members.find(user => user.id === userId);
    if (!member) return console.log('User not found: ' + userId);
    
    let guildId = await client.hypixelapi.findGuild('member', uuid).then(guild => guild.guild);
    let guildName = guildId ? await client.hypixelapi.getGuild(guildId).then(guild => guild.guild.name) : 'none';
    
    let guildNameRoleMap = {
      'Hypixel Knights': 'Hypixel Knights',
      'Infamy': 'Infamy',
      'Defiant': 'Defiant',
      'none': 'Guest'
    }
    
    let getGuild = name => {
      return Object.keys(guildNameRoleMap).indexOf(name) != -1 ? guildNameRoleMap[name] : 'Guest';
    }
    
    let linked_role = guild.roles.find(role => role.name === 'Linked');
    if (!member.roles.has(linked_role).id) member.roles.add(linked_role.id);
    
    let toAssign = guild.roles.find(role => role.name === getGuild(guildName)).id;
    if (member.roles.has(toAssign)) return console.log('Skipping ' + userId + ': roles already assigned properly');
    
    let hk_role = guild.roles.find(role => role.name === "Hypixel Knights");
    let emplify_role = guild.roles.find(role => role.name === "Ex-Emplify");
    let disowned_role = guild.roles.find(role => role.name === "Ex-Disowned");
    let defiant_role = guild.roles.find(role => role.name === "Defiant");
    let infamy_role = guild.roles.find(role => role.name === "Infamy");
    let guest_role = guild.roles.find(role => role.name === "Guest");
    let awaiting_role = guild.roles.find(role => role.name === "Awaiting Roles");
    
    if (member.roles.has(guest_role.id)) member.roles.remove(guest_role.id);
    if (member.roles.has(awaiting_role.id)) member.roles.remove(awaiting_role.id);
    if (member.roles.has(hk_role.id)) member.roles.remove(hk_role.id);
    if (member.roles.has(disowned_role.id)) member.roles.remove(disowned_role.id);
    if (member.roles.has(emplify_role.id)) member.roles.remove(emplify_role.id);
    if (member.roles.has(defiant_role.id)) member.roles.remove(defiant_role.id);
    if (member.roles.has(infamy_role.id)) member.roles.remove(infamy_role.id);
    
    member.roles.add(toAssign);
    
    client.modLog(
      `**Type**: Automatic role update\n**Reason**: User changed guilds and roles were reassigned\n**New guild role assigned**: ${getGuild(guildName)}`,
      false,
      member.user,
      client.user,
      client.EmbedHelper.colors.lime
    );
  }
  
});
