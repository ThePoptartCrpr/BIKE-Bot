const moment = require('moment');

exports.run = (client, message, guild, params) => {
  message.channel.send({embed: {
    color: 3447003,
    author: {
      name: 'Help',
      icon_url: client.user.avatarURL()
    },
    title: "",
    description: "For more info on a command, use +help <command>. *not implemented yet*",
    fields: [{
        name: "General",
        value: "• +ping\n• +help"
      },
      {
        name: "Fun",
        value: "• +choose <option1|option2|etc>"
      },
      {
        name: "Games",
        value: "• +trivia\n• +slots"
      },
      {
        name: "Social",
        value: "• +daily\n• +balance [@user]\n• +rep <user>\n• +level [user]\n• +lb [leaderboard]"
      },
      {
        name: "Utility",
        value: "• +remind <reminder> in <amount> <unit>\n• +remind list\n• +timer <seconds>\n• +poll <question>|<option1>|<option2>|[etc]"
      },
      {
        name: "Music",
        value: "• +music play <url/search>\n• +music queue\n• +music skip"
      },
      {
        name: "Moderation",
        value: "• +event\n• +open <event>\n• +close <event>\n• +lock <event>\n• +unlock <event>\n• +setbal <@user> <amount>\n• +warn <@user> <reason>\n• +setguild <@user> <guild>\n• +announce"
      }
    ],
    timestamp: Date.now()
  }});
};

exports.conf = {
  name: 'help',
  aliases: [],
  permLevel: 0,
  usage: '+help'
};
