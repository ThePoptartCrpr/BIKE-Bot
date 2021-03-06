exports.run = (client, message, params, perms) => {
  if (perms < 5) return message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle(`You do not have permission to reload commands.`)
      .setColor(client.EmbedHelper.colors.red)
      .setTimestamp()
  })
  if (!params[0]) return message.channel.send({
    embed: new client.Discord.MessageEmbed()
      .setTitle("Usage:")
      .setDescription("+reload <command>")
      .setColor(client.EmbedHelper.colors.red)
      .setTimestamp()
  })
  let command, category;
  if (client.commands.has(params[0])) {
    command = params[0];
    category = client.commands.get(command).category;
  } else if (client.aliases.has(params[0])) {
    command = client.aliases.get(params[0]);
    category = client.commands.get(command).category;
  }
  if (!command) {
    return message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle(`There is no command by the name of ${params[0]}`)
        .setColor(client.EmbedHelper.colors.red)
        .setTimestamp()
    })
  } else {
    message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle(`Reloading command ${command}...`)
        .setColor(client.EmbedHelper.colors.yellow)
        .setTimestamp()
    })
      .then(m => {
        client.reload(command, category)
          .then(() => {
            m.edit({
              embed: new client.Discord.MessageEmbed()
                .setTitle(`Successfully reloaded command ${command}.`)
                .setColor(client.EmbedHelper.colors.lime)
                .setTimestamp()
            })
          })
          .catch(e => {
            m.edit({
              embed: new client.Discord.MessageEmbed()
                .setTitle(`Reload failed for command ${command}. Please check console.`)
                .setColor(client.EmbedHelper.colors.red)
                .setTimestamp()
            })
            client.error(e);
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
