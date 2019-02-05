exports.run = (client, message, params, perms) => {
  if (perms < 3) return message.channel.send("You do not have permission to modify a user's balance.");
  amount = parseInt(params[1]);
  if (!params[1] || !message.mentions.users.first() || isNaN(amount)) return message.channel.send("Usage:\n+grant <@user> <amount>");
  let currBal = client.balance.get(message.mentions.users.first().id) || {bal: 0, id: message.mentions.users.first().id};
  currBal.bal += amount;
  client.balance.set(message.mentions.users.first().id, currBal);
  message.channel.send(`👌 | Successfully updated balance for **${message.mentions.users.first().username}**.`);
};

exports.conf = {
  name: 'grant',
  aliases: ["reward", "addbal"],
  permLevel: 0,
  usage: '+grant'
};
