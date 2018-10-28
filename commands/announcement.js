const Discord = require('discord.js');

exports.run = (client, message, params, perms) => {
  
  const colors = client.EmbedHelper.colors;
  
  if (!client.announcement) client.announcement = {
    
  }
  
  if (perms < 1) {
    let nick = message.member.nickname || message.author.username;
    return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle(`${nick}, you do not have permission to create announcements.`)
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
        .getEmbed()
    });
  }
  
  if (!params[0]) {
    if (Object.equals(client.announcement, {})) return message.channel.send({embed: new Discord.MessageEmbed()
      .setTitle("No announcement is currently in progress!")
      .setDescription("Create an announcement with **+announcement create**.")
      .setColor(colors.red)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    if (client.announcement.embed.title == null) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Your announcement does not have a title yet!")
        .setDescription("Set the title with **+announcement title <title>.**")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    if (client.announcement.embed.description == null) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Your announcement does not have a description yet!")
        .setDescription("Set the title with **+announcement description <description>.**")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    message.channel.send({embed: buildAnnouncement()});
  } else if (params[0] === "create" || params[0] === "start" || params[0] === "new") {
    if (!Object.equals(client.announcement, {})) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("An announcement is already in progress!")
        .setDescription("View it with **+announcement**.\n\nIf you would like to restart the current announcement, use **+announcement clear**.")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    client.announcement = {
      confirm: false,
      pending: false,
      channel: null,
      embed: {
        title: null,
        description: null,
        color: colors.blue,
        fields: null
      }
    }
    message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Successfully created an announcement.")
        .setDescription("View it with **+announcement**.")
        .setColor(colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
  } else if (params[0] === "clear") {
    if (Object.equals(client.announcement, {})) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("No announcement is currently in progress!")
        .setDescription("Create an announcement with **+announcement create**.")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    client.announcement = {};
    message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Successfully cleared the current announcement.")
        .setDescription("Create a new announcement with **+announcement create**.")
        .setColor(colors.yellow)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
  } else if (params[0] === "title") {
    if (!params[1]) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Usage: +announcement title <title>")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    if (Object.equals(client.announcement, {})) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("No announcement is currently in progress!")
        .setDescription("Create an announcement with **+announcement create**.")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    let title = params.slice(1);
    title = title.join(" ");
    client.announcement.embed.title = title;
    message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Successfully set announcement title.")
        .setDescription("View it with **+announcement**.")
        .setColor(colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
  } else if (params[0] === "description") {
    if (!params[1]) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Usage: +announcement description <description>")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    if (Object.equals(client.announcement, {})) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("No announcement is currently in progress!")
        .setDescription("Create an announcement with **+announcement create**.")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    let description = params.slice(1);
    description = description.join(" ");
    client.announcement.embed.description = description;
    message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Successfully set announcement description.")
        .setDescription("View it with **+announcement**.")
        .setColor(colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
  } else if (params[0] === "field" || params[0] === "fields") {
    if (!params[1]) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Usage: +announcement field <field title|field content>")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    if (Object.equals(client.announcement, {})) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("No announcement is currently in progress!")
        .setDescription("Create an announcement with **+announcement create**.")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    let fields = params.slice(1);
    fields = fields.join(" ");
    fields = fields.split("|");
    
    if ((!fields[1]) || (fields[2])) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Usage: +announcement field <field title|field content>")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    
    fields[0] = fields[0].trim();
    fields[1] = fields[1].trim();
    
    if (client.announcement.embed.fields == null) client.announcement.embed.fields = [];
    
    embedFields = {
      name: fields[0],
      value: fields[1]
    };
    
    client.announcement.embed.fields.push(embedFields);
    
    message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Successfully added announcement field.")
        .setDescription("View it with **+announcement**.")
        .setColor(colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
  } else if (params[0] === "blankfield" || params[0] === "blank") {
    if (params[1]) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Usage: +announcement blankfield")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    if (Object.equals(client.announcement, {})) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("No announcement is currently in progress!")
        .setDescription("Create an announcement with **+announcement create**.")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    
    if (client.announcement.embed.fields == null) client.announcement.embed.fields = [];
    
    embedFields = {
      name: '\u200B',
      value: '\u200B'
    };
    
    client.announcement.embed.fields.push(embedFields);
    
    message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Successfully added blank announcement field.")
        .setDescription("View it with **+announcement**.")
        .setColor(colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
  } else if (params[0] === "color") {
    if (!params[1]) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Usage: +announcement color <color>")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    if (Object.equals(client.announcement, {})) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("No announcement is currently in progress!")
        .setDescription("Create an announcement with **+announcement create**.")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    let color = colors[params[1]];
    if (!color) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Color not found!")
        .setDescription("Please try a different color.")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    client.announcement.embed.color = color;
    message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Successfully set announcement color.")
        .setDescription("View it with **+announcement**.")
        .setColor(colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
  } else if (params[0] === "colors") {
    message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Available colors:")
        .setDescription(`${Object.keys(colors).join("\n")}`)
        .setColor(colors.blue)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
  } else if (params[0] === "channel") {
    if (!message.mentions.channels.first()) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Usage: +announcement channel <#channel>")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    if (Object.equals(client.announcement, {})) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("No announcement is currently in progress!")
        .setDescription("Create an announcement with **+announcement create**.")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    let channel = message.mentions.channels.first().id;
    client.announcement.embed.channel = channel;
    message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Successfully set announcement channel.")
        .setDescription("View it with **+announcement**.")
        .setColor(colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
  } else if (params[0] === "send") {
    if (Object.equals(client.announcement, {})) return message.channel.send({embed: new Discord.MessageEmbed()
      .setTitle("No announcement is currently in progress!")
      .setDescription("Create an announcement with **+announcement create**.")
      .setColor(colors.red)
      .setTimestamp()
      .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    if (client.announcement.embed.title == null) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Your announcement does not have a title yet!")
        .setDescription("Set the title with **+announcement title <title>.**")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    if (client.announcement.embed.description == null) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Your announcement does not have a description yet!")
        .setDescription("Set the title with **+announcement description <description>.**")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    if (client.announcement.embed.channel == null) return message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Your announcement does not have a channel yet!")
        .setDescription("Set the title with **+announcement channel <#channel>.**")
        .setColor(colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    
    let channel = client.channels.filter(c => c.type === "text").get(client.announcement.embed.channel);
    
    channel.send({embed: buildAnnouncement()})
    
    message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle(":ok_hand: | Successfully sent your announcement.")
        .setColor(colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
    client.announcement = {
      
    };
  }
  
  buildAnnouncement = function() {
    let nick = message.member.nickname || message.author.username;
    let embed = new Discord.MessageEmbed()
      .setTitle(client.announcement.embed.title)
      .setDescription(client.announcement.embed.description)
      .setTimestamp()
      .setFooter(nick, message.author.avatarURL())
    
    if (client.announcement.embed.color != null) embed.setColor(client.announcement.embed.color);
    if (client.announcement.embed.fields != null) {
      for (let i = 0; i < client.announcement.embed.fields.length; i++) {
        embed.addField(client.announcement.embed.fields[i].name, client.announcement.embed.fields[i].value);
      }
    }
    
    return embed;
  }
  
};

exports.conf = {
  name: 'announcement',
  aliases: ["announce"],
  permLevel: 0,
  usage: '+announce'
};
