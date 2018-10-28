exports.run = (client, message, params, perms) => {
  if (perms < 5) return message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle(`You do not have permission to reload commands.`)
      .setColor(client.EmbedHelper.colors.red)
      .setTimestamp()
  })
  let command;
  if (client.commands.has(params[0])) {
    command = params[0];
  } else if (client.aliases.has(params[0])) {
    command = client.aliases.get(params[0]);
  }
  if (!command) {
    // return message.channel.send(`There is no command by the name of ${params[0]}.`);
    return message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle(`There is no command by the name of ${param[0]}`)
        .setColor(client.EmbedHelper.colors.red)
        .setTimestamp()
    })
  } else {
    // message.channel.send(`Reloading ${command}...`)
    message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle(`Reloading command ${command}...`)
        .setColor(client.EmbedHelper.colors.yellow)
        .setTimestamp()
    })
      .then(m => {
        client.reload(command)
          .then(() => {
            // m.edit(`Successfully reloaded ${command}.`);
            m.edit({
              embed: new client.Discord.MessageEmbed()
                .setTitle(`Successfully reloaded command ${command}.`)
                .setColor(client.EmbedHelper.colors.lime)
                .setTimestamp()
            })
          })
          .catch(e => {
            // m.edit(`Reload failed for command ${command}. Please check console.`);
            m.edit({
              embed: new client.Discord.MessageEmbed()
                .setTitle(`Reload failed for command ${command}. Please check console.`)
                .setColor(client.EmbedHelper.colors.red)
                .setTimestamp()
            })
            console.error(e);
          })
      })
  }
};

exports.conf = {
  name: 'reload',
  aliases: [],
  permLevel: 0,
  usage: '+reload <command>'
};
