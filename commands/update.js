const child = require('child_process');

const exec = child.exec;

let editMsg;

exports.run = (client, message, params, perms) => {
  if (perms < 5) return message.channel.send("You do not have permission to restart the bot.");
  message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle("Fetching latest update...")
      .setColor(client.EmbedHelper.colors.yellow)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  })
  .then(msg => {
    editMsg = msg;
    client.restartMsg.set("msg", {channel: msg.channel.id, message: msg.id});
  });

  exec('git fetch', (err, stdout, stderr) => {
    if (err) console.log(err);
    exec('git reset --hard origin/master', (err, stdout, stderr) => {
      if (err) console.log(err);
      editMsg.edit({
        embed: new client.Discord.MessageEmbed()
          .setTitle("Now on latest commit. Restart ready.")
          .setColor(client.EmbedHelper.colors.lime)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
    });
  });

  // aaa please work
  // E
  // ....
  // swear if this doesn't work
};

exports.conf = {
  name: 'update',
  aliases: [],
  permLevel: 0,
  usage: '+update'
};
