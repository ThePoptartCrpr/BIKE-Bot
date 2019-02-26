const moment = require('moment');

module.exports = client => {
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
  
  if (!client.connections.get('pending')) client.connections.set('pending', {});
  if (!client.connections.get('connected')) client.connections.set('connected', {});

  // Notifications
  let notifyStaffConnections = () => {
    let lastNotified = client.notifications.get('connections') || { date: new Date('December 17, 1995 03:24:00') };
    if (new Date(lastNotified.date).getDate() != new Date().getDate()) {
      console.log('new day');
      let pending = Object.keys(client.connections.get('pending'));
      if (pending.length != 0) {
        let channel = client.channels.find(channel => channel.id === process.env.STAFF_CHANNEL);
        
        // TODO: make a universal notify function
        channel.send({
          embed: client.embed()
            .setTitle(`🔔 | There are still ${pending.length} pending connections!`)
            .setDescription('View pending connections with **+connections**.')
            .setColor(client.EmbedHelper.colors.gold)
        });
      }
      
      client.notifications.set('connections', { date: new Date()});
    }
    
    setTimeout(() => {
      notifyStaffConnections();
    }, 1200000);
  }
  
  notifyStaffConnections();

  setInterval(() => {
    const toRemind = client.reminders.filter(r => moment(new Date(r.timestamp)).isBefore(moment()));
    toRemind.forEach(reminder => {
      let user = client.users.get(reminder.id);
      if (user) user.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle(`⏰ | Reminder:`)
          .setDescription(reminder.reminder)
          .setColor(client.EmbedHelper.colors.yellow)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
      client.reminders.delete(`${reminder.timestamp}`);
    });
  }, 10000);
  
  
  // Update roles
  let updateRoles = () => {
    let connections = client.connections.get('connected');
    Object.keys(connections).forEach(id => {
      client.updateRoles(id, connections[id].mc);
    });
    
    setTimeout(() => {
      updateRoles();
    }, 1200000);
  }
  
  updateRoles();
}
