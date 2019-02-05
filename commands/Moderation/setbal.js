exports.run = (client, message, params, perms) => {
  if (perms < 2) return message.channel.send("You do not have permission to set balances.");
  amount = parseInt(params[1])
  if (!params[1] || !message.mentions.users.first() || isNaN(amount)) return message.channel.send("Usage:\n+setbal <@user> <balance>");
  client.balance.set(message.mentions.users.first().id, {bal: amount, id: message.mentions.users.first().id});
  message.channel.send(`👌 | Successfully updated balance for **${message.mentions.users.first().username}**.`);
};

exports.conf = {
  name: 'setbal',
  aliases: [],
  permLevel: 0,
  usage: '+setbal'
};
