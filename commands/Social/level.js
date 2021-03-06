exports.run = async (client, message, params, perms) => {
  let user = message.author;
  let tempUser = null;
  if (message.mentions.users.first()) tempUser = message.mentions.members.first();
  if (!tempUser && params[0]) {
    tempUser = message.guild.members.find(val => val.user.username.toLowerCase() === params[0].toLowerCase());
    if (!tempUser) tempUser = message.guild.members.find(val => val.user.username.toLowerCase().indexOf(params[0].toLowerCase()) != -1);
  }
  if (tempUser !== null) user = tempUser.user;

  let points = 0;
  let level = 0;
  let balance = 0;

  if (client.points.get(user.id) != undefined) {
    points = client.points.get(user.id).points;
    level = client.points.get(user.id).level;
  }

  if (client.balance.get(user.id) != undefined) {
    balance = client.balance.get(user.id).bal;
  }

  let streak = client.streaks.get(user.id) || {streak: 0};
  let currStats = client.userStats.get(user.id) || {dailies: 0};

  let rep = client.reputation.get(user.id) || {rep: 0, sent: 0};

  let currPoint = points;
  let nextlevelpoints = 0;

  while (Math.floor(0.1 * Math.sqrt(currPoint)) < (level + 1)) {
    currPoint++;
    nextlevelpoints = currPoint;
  }

  let minPoint = points;
  let prevlevelpoints = 0;

  while (Math.floor(0.1 * Math.sqrt(minPoint)) > (level - 1)) {
    minPoint--;
    prevlevelpoints = minPoint + 1;
  }

  progressNextPoints = nextlevelpoints - prevlevelpoints;
  progressPoints = points - prevlevelpoints;

  let pointsLeft = nextlevelpoints - points;

  let getPercentBar = percent => {
    let thick = Math.floor(percent / 10);
    let thin = Math.ceil((100 - percent) / 10) * 3;
    let str = "[";

    for (let i = 0; i < thick; i++) str += "▬";
    for (let i = 0; i < thin; i++) str += "-";

    str += "]";

    return str;
  }
  
  let embed = client.embed()
    .setAuthor(user.username, user.avatarURL())
    .addField("Level", `${level}\n\u200B`, true)
    .addField("Total XP", points.toLocaleString(), true)
    .addField("Progress", `XP required for level **${level + 1}**: ${nextlevelpoints.toLocaleString()}\n**Progress**: ${progressPoints.toLocaleString()}/${progressNextPoints.toLocaleString()} (${Math.round(progressPoints/progressNextPoints * 100)}%), ${pointsLeft.toLocaleString()} XP left`, true)
    .addField(getPercentBar(Math.round(progressPoints/progressNextPoints * 100)), '\u200B')
    .addField("Reputation", `**Received: ${rep.rep}**\n**Sent**: ${rep.sent}`)
    .addField("Balance", `${client.emojis.find(emoji => emoji.name === "bikecoin")}${balance.toLocaleString()}`, true)
    .addField("Stats", `**Dailies claimed**: ${currStats.dailies}\n**Current streak**: ${streak.streak}`, true)
    .setColor(client.EmbedHelper.colors.blue)
  
  if (client.connections.get('connected')[user.id]) await client.hypixelapi.getPlayer('uuid', client.connections.get('connected')[user.id].mc).then(data => {
    embed.addField('\u200B\nConnected Minecraft account:', data.player.displayname);
  });

  message.channel.send({
    embed: embed
  });

};

exports.conf = {
  name: 'level',
  aliases: ['rank', 'profile'],
  permLevel: 0,
  usage: '+level'
};
