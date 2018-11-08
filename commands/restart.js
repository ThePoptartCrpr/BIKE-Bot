const { exec } = require('child_process');

exports.run = (client, message, params, perms) => {
  if (perms < 5) return message.channel.send("You do not have permission to restart the bot.");
  message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle("Restarting...")
      .setColor(client.EmbedHelper.colors.yellow)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  })
  .then(msg => {
    client.restartMsg.set("msg", {channel: msg.channel.id, message: msg.id});
    process.exit();
  })

};

exports.conf = {
  name: 'restart',
  aliases: [],
  permLevel: 0,
  usage: '+restart'
};
