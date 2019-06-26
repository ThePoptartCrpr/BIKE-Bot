const request = require('request');

exports.run = (client, message, [username], perms) => {
  if (!username) return message.channel.send({
    embed: client.embed()
      .setTitle('Usage:')
      .setDescription('**+connect <MC username>**')
      .setColor(client.EmbedHelper.colors.red)
  });
  
  request.get(`https://api.mojang.com/users/profiles/minecraft/${username}`, (err, response, body) => {
    if (err) return console.error(err);
    
    if (!body) return message.channel.send({
      embed: client.embed()
        .setTitle('Invalid username.')
        .setDescription('Please try again.')
        .setColor(client.EmbedHelper.colors.red)
    });
    
    let data = JSON.parse(body);
    let uuid = data.id;
    if (!uuid) return message.channel.send({
      embed: client.embed()
        .setTitle('Invalid username.')
        .setDescription('Please try again.')
        .setColor(client.EmbedHelper.colors.red)
    }).then(msg => {
      setTimeout(() => {
        msg.delete();
      }, 5000);
    });
    
    /*message.channel.send({
      embed: client.embed()
        .setTitle(`Are you sure you want to connect your Discord account to the Minecraft account **${username}**?`)
        .setDescription('(__Y__es / __N__o)')
        .setColor(client.EmbedHelper.colors.yellow)
    });
    const filter = m => m.author === message.author && ['y', 'n', 'yes', 'no'].indexOf(m.content.toLowerCase()) != -1;
    message.channel.awaitMessages(filter, {max: 1, time: 10000, errors: ['time']})
      .then(collected => {
        if (collected.first().content.toLowerCase() === "y" || collected.first().content.toLowerCase() === "yes") {
          let pending = client.connections.get('pending');
          pending[message.author.id] = { mc: uuid };
          client.connections.set('pending', pending);
          message.channel.send({
            embed: client.embed()
              .setTitle(`👌 | Your Minecraft account connection has been confirmed.`)
              .setDescription('A staff member will approve it shortly.')
              .setColor(client.EmbedHelper.colors.lime)
          });
        } else {
          message.channel.send({
            embed: new client.Discord.MessageEmbed()
              .setTitle(`Account connection cancelled.`)
              .setColor(client.EmbedHelper.colors.red)
              .setTimestamp()
              .setFooter("BIKE Alliance", client.user.avatarURL())
          })
        }
      })
      .catch(collected => message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle(`Ran out of time, connection cancelled.`)
          .setColor(client.EmbedHelper.colors.red)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      }));
  });
};*/

let pending = client.connections.get('pending');
pending[message.author.id] = { mc: uuid };
client.connections.set('pending', pending);
message.author.send({
  embed: new client.embed()
    .setTitle(`👌 | Your Minecraft account connection to **${username}** has been confirmed.`)
    .setDescription('A staff member will approve it shortly.')
    .setColor(client.EmbedHelper.colors.lime)
}).then(msg => {
  setTimeout(() => {
    msg.delete();
  }, 5000);
});

let channel = client.channels.find(channel => channel.id === process.env.STAFF_CHANNEL);
channel.send({
  embed: client.embed()
    .setTitle(`🔔 | ${message.author.username}#${message.author.discriminator} has just requested an account connection to ${username}.`)
    .setDescription('View pending connections with **+connections**.')
    .setColor(client.EmbedHelper.colors.gold)
});

exports.conf = {
  name: 'connect',
  aliases: ['link', 'link', 'linkaccount'],
  permLevel: 0,
  usage: '+connect'
};
