const { exec } = require('child_process');

exports.run = (client, message, params, perms) => {
  if (perms < 5) return message.channel.send("You do not have permission to make backups.");
  message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle("Starting backup...")
      .setColor(client.EmbedHelper.colors.yellow)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
  })
  .then(msg => {
    client.restartMsg.set("msg", {channel: msg.channel.id, message: msg.id});
    exec('zip -r .data.zip .data/', (err, stdout, stderr) => {
      if (err) console.log(err);
      message.channel.send({
        files: [{
          attachment: '.data.zip',
          name: '.data.zip'
        }]
      }).then(mesg => {
        exec('rm .data.zip', (err, stdout, stderr) => {
          if (err) console.log(err);
          msg.edit({
            embed: new client.Discord.MessageEmbed()
              .setTitle("Backup finished.")
              .setColor(client.EmbedHelper.colors.lime)
              .setTimestamp()
              .setFooter("BIKE Alliance", client.user.avatarURL())
          })
        })
      })
    });
  });

};

exports.conf = {
  name: 'backup',
  aliases: [],
  permLevel: 0,
  usage: '+backup'
};
