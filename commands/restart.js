const { exec } = require('child_process');

exports.run = (client, message, params, perms) => {
  if (perms < 5) return message.channel.send("You do not have permission to restart the bot.");
  message.channel.send("Restarting...")
  .then(msg => {
    client.restartMsg.set("msg", {channel: msg.channel.id, message: msg.id});
  })
  exec('refresh', (err, stdout, stderr) => {
    if (err) console.log(err);
  });
};

exports.conf = {
  name: 'restart',
  aliases: [],
  permLevel: 0,
  usage: '+restart'
};
