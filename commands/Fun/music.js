let channel = "0";
let playing = false;
let paused = false;

let queue = {
  songs: []
};

let repeat = "off";

const yt = require('ytdl-core');
const fs = require('fs');
const search = require('youtube-search');

var opts = {
  maxResults: 1,
  key: process.env.YOUTUBE_KEY,
}

let dispatcher;

const connectToVoiceChannel = function(message) {
  return new Promise((resolve, reject) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel || voiceChannel.type !== 'voice') return /*message.client.musicjoin[message.guild.id] = "false"*/;
    channel = voiceChannel;
    voiceChannel.join().then(connection => {
      resolve(connection);
    }).catch(err => reject(err));
  });
};

const isValidWatchUrl = function(url) {
  const regexStr = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/watch\?v=+./
  if (!url.match(regexStr)) return false;
  return true;
}

exports.run = (client, message, params, perms) => {

  const playSong = function(song) {
    try {
      if (song === undefined) return message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("Queue concluded.")
          .setColor(client.EmbedHelper.colors.orange)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      }).then(() => {
        playing = false;
        channel.leave();
        channel = "0";
      })
      /*message.channel.send(`Now playing **${song.title}**\nRequested by **${song.requester}**`);*/

      let imgUrl;

      var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var match = song.url.match(regExp);
      if (match && match[2].length == 11) {
        imgUrl = match[2];
      }

      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("Now playing:")
          .setDescription(`**${song.title}**`)
          .addField("Requested by:", song.requester)
          .setImage(`https://img.youtube.com/vi/${imgUrl}/maxresdefault.jpg`)
          .setColor(client.EmbedHelper.colors.lime)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });

      // dispatcher = message.guild.voiceConnection.play('http://www.sample-videos.com/audio/mp3/wave.mp3');
      dispatcher = message.guild.voiceConnection.play(yt(song.url, { filter: "audioonly" }), {passes: 3});

      dispatcher.on('end', () => {
        if (repeat === "playlist") {
          queue.songs.push(queue.songs[0]);
        }
        if (repeat !== "single") {
          queue.songs.shift();
        }
        playSong(queue.songs[0]);
      });
      dispatcher.on('error', (err) => {
        return message.channel.send({
          embed: new client.Discord.MessageEmbed()
            .setTitle("An error occurred.")
            .setDescription(`Please tell ${client.users.get('198466968725094400')} to check console.`)
            .setColor(client.EmbedHelper.colors.red)
            .setTimestamp()
            .setFooter("BIKE Alliance", client.user.avatarURL())
        }).then(() => {
          queue.songs.shift();
          playSong(queue.songs[0]);
        });
      });
      // message.guild.voiceConnection.play('/Antiproton.m4a');
      // message.guild.voiceConnection.play(yt('https://www.youtube.com/watch?v=ZR2CqwnS2KA', { filter: "audioonly" }))

    } catch (e) {
      console.error(e);
      return;
    }
  }

  if (params[0] === "join") {
    connectToVoiceChannel(message);
  } else if (params[0] === "play") {
    if (!paused) {
      if (!params[1]) return message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("Usage:")
          .setDescription("+music play <url>")
          .setColor(client.EmbedHelper.colors.red)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });

      let url = params[1];

      if (!isValidWatchUrl(url)) {
        search(params.join(" ").replace("play", ""), opts, (err, results) => {
          if (err) return message.channel.send({
            embed: new client.Discord.MessageEmbed()
              .setTitle("Invalid search.")
              .setDescription("Please try again.")
              .setColor(client.EmbedHelper.colors.red)
              .setTimestamp()
              .setFooter("BIKE Alliance", client.user.avatarURL())
          });

          url = results[0].link;
          console.log(url);

          if (channel != message.member.voiceChannel) connectToVoiceChannel(message);

          let dispatcher;

          yt.getInfo(url, (err, info) => {
            if (err) return message.channel.send({
              embed: new client.Discord.MessageEmbed()
                .setTitle("Invalid search.")
                .setDescription("Please try again.")
                .setColor(client.EmbedHelper.colors.red)
                .setTimestamp()
                .setFooter("BIKE Alliance", client.user.avatarURL())
            });
            queue.songs.push({url: url, title: info.title, requester: message.author.username});
            message.channel.send({
              embed: new client.Discord.MessageEmbed()
                .setTitle(`Added **${info.title}** to the queue.`)
                .setColor(client.EmbedHelper.colors.lime)
                .setTimestamp()
                .setFooter("BIKE Alliance", client.user.avatarURL())
            });
            if (!playing) {
              playing = true;
              playSong(queue.songs[0])
            }
          });

        });
      } else {

        if (channel != message.member.voiceChannel) connectToVoiceChannel(message);

        let dispatcher;

        if (playing) {
          yt.getInfo(url, (err, info) => {
            if (err) return message.channel.send("Invalid YouTube link.");
            queue.songs.push({url: url, title: info.title, requester: message.author.username});
            message.channel.send(`Added **${info.title}** to the queue.`);
          })
        } else {
          playing = true;
          yt.getInfo(url, (err, info) => {
            if (err) return message.channel.send("Invalid YouTube link.");
            queue.songs.push({url: url, title: info.title, requester: message.author.username});
            message.channel.send(`Added **${info.title}** to the queue.`);
            playSong(queue.songs[0]);
          })
        }
      }
    } else {
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("Music resumed.")
          .setColor(client.EmbedHelper.colors.lime)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
      dispatcher.resume();
      paused = false;
    }
  } else if (params[0] === "stop" || params[0] === "leave") {
    if (playing) {
      if (perms < 2) return message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("You do not have permission to stop music.")
          .setColor(client.EmbedHelper.colors.red)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
      queue = {
        songs: []
      }
      dispatcher.end();
      playing = false;
      paused = false;
      if (channel != "0") channel.leave();
      channel = "0";
    } else {
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("No music is currently playing.")
          .setColor(client.EmbedHelper.colors.red)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
    }
  } else if (params[0] === "queue") {
    if (queue.songs.length === 0) return message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle("The queue is currently empty.")
        .setColor(client.EmbedHelper.colors.yellow)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    });
    let tosend = [];
    queue.songs.forEach((song, i) => {
      tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);
    });
    message.channel.send(`__**${message.guild.name}'s queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown*]' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
  } else if (params[0] === "pause") {
    if (!paused && playing) {
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("Music paused.")
          .setColor(client.EmbedHelper.colors.lime)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
      dispatcher.pause();
      paused = true;
    } else if (!playing) {
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("No music is currently playing.")
          .setColor(client.EmbedHelper.colors.red)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
    } else if (paused) {
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("Music is already paused.")
          .setColor(client.EmbedHelper.colors.red)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
    }
  } else if (params[0] === "resume") {
    if (paused && playing) {
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("Music resumed.")
          .setColor(client.EmbedHelper.colors.lime)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
      dispatcher.resume();
      paused = false;
    } else if (!playing) {
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("No music is currently playing.")
          .setColor(client.EmbedHelper.colors.red)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
    } else if (!paused) {
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("The music is already playing.")
          .setColor(client.EmbedHelper.colors.lime)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
    }
  } else if (params[0] === "skip") {
    if (playing) {
      if (perms < 2 && message.author.username != queue.songs[0].requester) return message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("You do not have permission to skip this song.")
          .setColor(client.EmbedHelper.colors.red)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle(`**${queue.songs[0].title}** skipped.`)
          .setColor(client.EmbedHelper.colors.lime)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
      dispatcher.end();
    } else {
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("No music is currently playing.")
          .setColor(client.EmbedHelper.colors.red)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
    }
  } else if (params[0] === "restart") {
    if (playing) {
      queue.songs.unshift(queue.songs[0]);
      dispatcher.end();
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle(`**${queue.songs[0].title}** restarted.`)
          .setColor(client.EmbedHelper.colors.lime)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
    } else {
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("No music is currently playing.")
          .setColor(client.EmbedHelper.colors.red)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
    }
  } else if (params[0] === "volume") {
    if (!playing) return message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle("No music is currently playing.")
        .setColor(client.EmbedHelper.colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    });
    if (!params[1]) return message.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
    if (isNaN(parseInt(params[1]))) return message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle("Usage:")
        .setDescription("+music volume <volume>")
        .setColor(client.EmbedHelper.colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    });
    let volume = parseInt(params[1]);
    if (volume > 100 || volume < 0) return message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle("Volume must be between 1 and 100.")
        .setColor(client.EmbedHelper.colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    });
    dispatcher.setVolume(volume / 50);
    message.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
  } else if (params[0] === "repeat") {
    if (!params[1]) return message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle(`Song repeat is currently set to **${repeat}**.`)
        .setColor(client.EmbedHelper.colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    });
    if (perms < 2) return message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle("You do not have permission to modify the repeat settings.")
        .setColor(client.EmbedHelper.colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    });
    if (params[1] === "off") {
      repeat = "off";
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("Song repeat has been disabled.")
          .setColor(client.EmbedHelper.colors.lime)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
    } else if (params[1] === "single" || params[1] === "on") {
      repeat = "single";
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("Song repeat has been set to single.")
          .setColor(client.EmbedHelper.colors.lime)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
    } else if (params[1] === "playlist") {
      repeat = "playlist";
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("Song repeat has been set to playlist.")
          .setColor(client.EmbedHelper.colors.lime)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
    } else {
      message.channel.send({
        embed: new client.Discord.MessageEmbed()
          .setTitle("Unrecognized setting.")
          .setDescription("Available repeat settings: off, single, playlist")
          .setColor(client.EmbedHelper.colors.red)
          .setTimestamp()
          .setFooter("BIKE Alliance", client.user.avatarURL())
      });
    }
  } else {
    message.channel.send({
      embed: new client.Discord.MessageEmbed()
        .setTitle("Usage:")
        .setDescription("Usage:\n+music play <url/search>\n+music queue\n+music stop\n+music skip\n+music restart\n+music repeat <mode>\n+music pause\n+music resume\n+music play\n+music leave")
        .setColor(client.EmbedHelper.colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    });
  }
};

exports.conf = {
  name: 'music',
  aliases: ['m'],
  permLevel: 0,
  usage: '+music'
};
