class EmbedHelper {
  constructor() {
    
    this.colors = {
      lime: 0x55ff55,
      red: 0xe30022,
      light_red: 0xff5555,
      yellow: 0xfff600,
      orange: 0xffa500,
      blue: 0x1ca9c9,
      purple: 0x71368a,
      gold: 0xcba135
    }
    
    this.prebuiltEmbeds = {
      noPermission: new EmbedBuilder()
        .setTitle("You do not have permission to use this command.")
        .setColor(this.colors.red)
        .getEmbed(),
    }
    
    this.EmbedBuilder = EmbedBuilder;
    
  }
  
}

class EmbedBuilder {
  constructor() {
    this.embed = {
      timestamp: new Date().toISOString()
    }
    
    return this;
  }
  
  setTitle(text) {
    this.embed.title = text;
    return this;
  }
  
  setDescription(text) {
    this.embed.description = text;
    return this;
  }
  
  addField(title, text) {
    if (!this.embed.fields) this.embed.fields = [];
    this.embed.fields += {
      name: title,
      value: text
    }
    return this;
  }
  
  setColor(color) {
    this.embed.color = color;
    return this;
  }
  
  getEmbed() {
    return this.embed;
  }
  
  send(channel) {
    this.embed.footer = {
      icon_url: channel.client.user.avatarURL()
    }
    console.log(this.embed);
    channel.send({embed: this.embed});
  }
  
  reply(message) {
    this.embed.footer = {
      icon_url: message.client.user.avatarURL()
    }
    message.channel.send({embed: this.embed});
  }
  
}

module.exports = new EmbedHelper();
