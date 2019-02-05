const clean = text => {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)).replace(/dwald/g, "ThePoptartCrpr");
  else
      return text;
}

exports.run = (client, message, params, perms) => {
  if (message.author.id != '198466968725094400') return;
  if (!params) return;
  try {
    const code = params.join(" ");
    let evaled = eval(code);
    
    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
    message.channel.send(clean(evaled), {code: "x1"});
  } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
  }
};

exports.conf = {
  name: 'execute',
  aliases: ['exec', 'eval', 'evaluate'],
  permLevel: 0,
  usage: '+execute'
};
