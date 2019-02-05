// let triviaChannelId = "410629393371889664";
// let triviaChannelId = "429736096797163521";
let triviaChannelId = "498201991026180098";

exports.run = (client, message, params, perms) => {
  if (params[0] === "trivia") {
    if (perms < 2) return message.channel.send("You do not have permission to open event channels.");
    let everyoneRole = message.guild.roles.find(role => role.name === "@everyone");
    let triviaChannel = client.channels.filter(c => c.type === "text").get(triviaChannelId);
    if (triviaChannel.permissionsFor(everyoneRole).serialize().VIEW_CHANNEL === true) return message.channel.send("Trivia channel already open.");
    
    triviaChannel.overwritePermissions(everyoneRole, {
      VIEW_CHANNEL: true
    })
      .then(() => message.channel.send("Trivia channel opened."))
      .catch(function(error) {
        console.log(error);
        message.channel.send("There was an error while opening the trivia channel. Please contact <@198466968725094400>.");
      });
  } else {
    message.channel.send("Usage:\n+open <event>");
  }
};

exports.conf = {
  name: 'open',
  aliases: [],
  permLevel: 0,
  usage: '+open'
};
