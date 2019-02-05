const request = require('request');

exports.run = (client, message, args) => {
  request.get(`http://api.urbandictionary.com/v0/define?term=${args[0]}`, (err, response, body) => {
    if (err) return message.channel.send({
      embed: client.embed()
        .setTitle('An error occurred')
        .setDescription('Please try again later.')
        .setColor(client.EmbedHelper.colors.red)
    });
    
    let data = JSON.parse(body);
    let result = data.list[0];
    if (!result) return message.channel.send({
      embed: client.embed()
        .setTitle('Your search query didn\'t yield any results.')
        .setDescription('Please try again.')
        .setColor(client.EmbedHelper.colors.red)
    });
    
    message.channel.send({
      embed: client.embed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle(`Urban Dictionary: ${result.word.replace(/[\[\]]/g, '')}`)
        .setDescription(`${result.definition.replace(/[\[\]]/g, '')}`)
        .addField('Example', `${result.example.replace(/[\[\]]/g, '')}`)
        .addField('Rating', `:thumbsup: ${result.thumbs_up} - :thumbsdown: ${result.thumbs_down}`)
        .setColor(client.EmbedHelper.colors.blue)
    });
  });
};

exports.conf = {
  name: 'urbandictionary',
  aliases: ['urban', 'ud']
};

exports.help = {
  friendlyName: 'Urban Dictionary',
  description: 'Look up a term on the Urban Dictionary.',
  usage: '+urban <query>'
}
