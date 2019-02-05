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
  client.updateRoles = (userId, uuid) => {
    let user = client.users.get(user => user.id === userId);
    if (!user) return;
    
    
  }
  
});
