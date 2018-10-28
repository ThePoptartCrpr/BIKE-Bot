exports.run = (client, message, params, perms) => {
  if (!params[0]) return message.channel.send("Usage: \n+choose <option1|option2|etc>");
  args = params.join(" ");
  args = args.split("|");
  if (!args[1]) return message.channel.send("Please specify at least two choices, separated with pipe characters.");
  let choice = args[Math.floor(Math.random() * args.length)];
  message.channel.send(`\:thinking: | I choose ${choice.trim()}.`);
};

exports.conf = {
  name: 'choose',
  aliases: [],
  permLevel: 0,
  usage: '+choose'
};
