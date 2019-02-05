exports.run = (client, message, params, perms) => {
  let temp = parseInt(params[0]);
  if (Number.isInteger(temp)) {
    let time = temp;
    if (time > 1800) return message.channel.send("Sorry, your timer cannot be over half an hour at this time.");
    message.channel.send(`Got it! Your timer will go off in ${time} seconds!`)
    setTimeout(function() {
      message.channel.send(`:alarm_clock: Time's up, ${message.author}!`)
    }, time * 1000)
  } else {
    message.channel.send("Usage:\n+timer <length in seconds>");
  }
};

exports.conf = {
  name: 'timer',
  aliases: [],
  permLevel: 0,
  usage: '+timer <length>'
};
