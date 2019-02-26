// const modlogschannelid = '414186834038489102';
const modlogschannelid = '429736568417157131';

const yesno = ["Y", "y", "N", "n"];

exports.run = (client, message, params, perms) => {
  if (perms < 2) return message.channel.send("You do not have permission to warn users.");
  
  let user = message.mentions.users.first();
  if (!user) return message.channel.send("Usage: \n+warn <@user> <reason>");
  
  params.splice(0, 1);
  if (!params || params.length === 0) return message.channel.send("Usage:\n+warn <@user> <reason>");
  
  reason = params.join(" ");
  message.channel.send(`Are you sure you want to warn **${user.username}#${user.discriminator}** for **${reason}**? (__Y__es/__N__o)`);
  
  const filter = m => m.author === message.author && yesno.indexOf(m.content) != -1;
  message.channel.awaitMessages(filter, {max: 1, time: 10000, errors: ['time']})
    .then(collected => warnUser(collected.first().content))
    .catch(collected => message.channel.send("Ran out of time, cancelled the warning."));
    
  const warnUser = function(content) {
    if (content === "Y" || content === "y") {
      message.channel.send(`Warning **${user.username}#${user.discriminator}**...`)
        .then(msg => {
          editMsg = msg;
          
          let cases = 0;
          client.cases.forEach(caseNo => {
            cases++;
          })
          
          let modlogs = client.channels.filter(c => c.type === "text").get(modlogschannelid);
          let moderator = message.author;
          let caseNo = cases;
          caseNo++;
          
          modlogs.send({embed: {
            color: 3447003,
            author: {
              name: `${user.username}#${user.discriminator} (ID ${user.id})`,
              icon_url: user.avatarURL()
            },
            // title: "",
            description: `**Type**: Warn\n**Reason**: ${reason}\n**Responsible moderator**: ${moderator.username}#${moderator.discriminator}\n`,
            // timestamp: new Date()
            footer: {
              text: `Case ${caseNo} | BIKE Moderation`
            }
          }})
          .then(modMsg => {
            client.cases.set(caseNo, {case: caseNo, id: user.id, type: "warn", length: "n/a", reason: reason, moderator: moderator.id, msgid: modMsg.id});
          });
          
          user.send(`${user}, you have been warned for **${reason}**.`);
          msg.edit(`Successfully warned **${user.username}#${user.discriminator}** for **${reason}**.`);
        })
        .catch((err) => {
          editMsg.edit("An error occurred. Please contact ThePoptartCrpr.");
          console.error(err);
        })
    } else {
      message.channel.send("Cancelled.");
    }
  }
  
};

exports.conf = {
  name: 'warn',
  aliases: [],
  permLevel: 0,
  usage: '+warn'
};
