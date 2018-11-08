const moment = require('moment');

module.exports = client => {
  // console.log(`${new Date().toLocaleTimeString()} Initialized.`);
  client.log("Initialized.");
  if (client.restartMsg.get("msg")) {
    let channelId = client.restartMsg.get("msg").channel;
    let channel = client.channels.filter(c => c.type === "text").get(channelId);

    let msgId = client.restartMsg.get("msg").message;

    channel.messages.fetch(msgId)
    .then(msg => {
      msg.edit({
        embed: new client.Discord.MessageEmbed()
          .setTitle("Successfully restarted. Back online.")
          .setColor(client.EmbedHelper.colors.lime)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
      client.restartMsg.delete("msg");
    })
    .catch(e => {
      console.error(e);
    })
  }
  client.user.setActivity(`${client.prefix}help`);

  /*console.log(client.reminders);
  test = client.reminders.get('Thu Feb 15 2018 19:29:47 GMT-0800').timestamp;
  console.log(moment(new Date(client.reminders.get('Thu Feb 15 2018 19:29:47 GMT-0800').timestamp)));


  client.reminders.forEach(reminder => {
    console.log(moment(new Date(reminder.timestamp)));
    console.log(moment());
  })*/

  setInterval(() => {
    // const toRemind = client.reminders.filter(r => r.timestamp <= Date.now());
    const toRemind = client.reminders.filter(r => moment(new Date(r.timestamp)).isBefore(moment()));
    toRemind.forEach(reminder => {
      // client.users.get(reminder.id).send(`⏰ | Reminder: ${reminder.reminder}`);
      client.users.get(reminder.id).send({
        embed: new client.Discord.MessageEmbed()
          .setTitle(`⏰ | Reminder:`)
          .setDescription(reminder.reminder)
          .setColor(client.EmbedHelper.colors.yellow)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      })
      client.reminders.delete(`${reminder.timestamp}`);
    })
  }, 10000);
}
