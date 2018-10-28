exports.run = (client, message, params, perms) => {
  let user = message.author;
  console.log(client.prevDailies.get(message.author.id));
  if (message.mentions.users.first()) {
    user = message.mentions.users.first();
    console.log("e");
  }
  
  let str = user.username + "'s";
  if (user === message.author) str = "Your";
  
  if (!client.balance.get(user.id) || client.balance.get(user.id) == undefined) {
    message.channel.send(`${str} current balance is ${client.emojis.find("name", "bikecoin")}0 BikeCoin.`);
  } else {
    message.channel.send(`${str} current balance is ${client.emojis.find("name", "bikecoin")}${client.balance.get(user.id).bal.toLocaleString()} BikeCoin.`);
  }
};

exports.conf = {
  name: 'balance',
  aliases: ['bal', 'credits'],
  permLevel: 0,
  usage: '+balance'
};
