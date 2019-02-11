const puppy = require('random-puppy');

exports.run = (client, message, args) => {
  const possibleSubreddits = ['me_irl', 'prequelmemes', 'deepfriedmemes', 'surrealmemes', 'hypixelmemes', 'wackytictacs', 'bonehurtingjuice', 'MemeEconomy', 'memes'];
  let subreddit;
  
  const getAvailableSubreddits = () => {
    let str = '';
    possibleSubreddits.forEach(sub => {
      str += `• ${sub}\n`;
    });
    str += '\u200B';
    return str;
  }
  
  if (args[0]) {
    if (possibleSubreddits.indexOf(args[0]) != -1) subreddit = possibleSubreddits[possibleSubreddits.indexOf(args[0])];
    else {
      possibleSubreddits.forEach(sub => {
        if (sub.indexOf(args[0]) != -1) subreddit = sub;
      });
      if (!subreddit) return message.channel.send({
        embed: client.embed()
          .setTitle(`That subreddit isn't recognized!`)
          .addField('Available subreddits', `${getAvailableSubreddits()}`)
          .addField('Don\'t see your favorite meme subreddit on there?', 'Let us know!')
          .setColor(client.EmbedHelper.colors.red)
      });
    }
  } else subreddit = possibleSubreddits[Math.floor(Math.random() * possibleSubreddits.length)];
  
  puppy(subreddit).then(url => {
    message.channel.send({
      embed: client.embed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle(`Random Meme from r/${subreddit}`)
        .setImage(url)
        .setColor(client.EmbedHelper.colors.gold)
    });
  });
};

exports.conf = {
  name: 'meme',
  aliases: []
};

exports.help = {
  friendlyName: 'Meme',
  description: 'Fetch a random meme from a random subreddit.',
  usage: '+meme [subreddit]'
};
