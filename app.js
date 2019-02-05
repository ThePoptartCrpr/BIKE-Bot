// Package dependencies
require('dotenv').config();

const Discord = require('discord.js');
const fs = require('fs');
const moment = require('moment');

const client = new Discord.Client();

const express = require('express');
const app = express();

const HypixelAPI = require('hypixel-api');
client.hypixelapi = new HypixelAPI(process.env.HYPIXEL_API_KEY);

// File dependencies
require('./utils/eventLoader')(client);

// Client settings
client.prefix = process.env.PREFIX;

// Express magic

app.get('/', function(request, response) {
  console.log(Date.now() + " Ping Received");
  response.sendFile(__dirname + '/views/index.html');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Enmap
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');

client.blankCooldowns = {
  slots: moment().subtract(4, 'hours').toString()
}

client.prevDailies = new Enmap({provider: new EnmapLevel({name: "prevDailies", dataDir: "./.data"})});
client.balance = new Enmap({provider: new EnmapLevel({name: "balance", dataDir: "./.data"})});
client.reminders = new Enmap({provider: new EnmapLevel({name: "reminders", dataDir: "./.data"})});
client.cases = new Enmap({provider: new EnmapLevel({name: "cases", dataDir: "./.data"})});
client.points = new Enmap({provider: new EnmapLevel({name: "points", dataDir: "./.data"})});
client.reputation = new Enmap({provider: new EnmapLevel({name: "reputation", dataDir: "./.data"})});
client.prevReps = new Enmap({provider: new EnmapLevel({name: "prevReps", dataDir: "./.data"})});
client.streaks = new Enmap({provider: new EnmapLevel({name: "streaks", dataDir: "./.data"})});

client.cooldowns = new Enmap({provider: new EnmapLevel({name: "cooldowns", dataDir: "./.data"})});

client.userStats = new Enmap({provider: new EnmapLevel({name: "userStats", dataDir: "./.data"})});

client.currPoll = new Enmap({provider: new EnmapLevel({name: "currPoll", dataDir: "./.data"})});
client.restartMsg = new Enmap({provider: new EnmapLevel({name: "restartMsg", dataDir: "./.data"})});


client.connections = new Enmap({provider: new EnmapLevel({name: 'connections', dataDir: './.data'})});

client.log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
  try {
    client.channels.get('510248810086137878').send({
      embed: new client.Discord.MessageEmbed()
        .setTitle("Log")
        .setDescription(message)
        .setColor(client.EmbedHelper.colors.lime)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
  } catch(e) {

  }
};

client.error = error => {
  console.error(error);
  try {
    client.channels.get('510248810086137878').send({
      embed: new client.Discord.MessageEmbed()
        .setTitle("Error")
        .setDescription(error)
        .setColor(client.EmbedHelper.colors.red)
        .setTimestamp()
        .setFooter("BIKE Alliance", client.user.avatarURL())
    })
  } catch(e) {

  }
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

let init = async () => {
  let commandsLoaded = 0;
  
  // async function's fucked up, fix later (doesn't properly delay)

  let readCommands = category => {
    return new Promise(async (resolve, reject) => {
      let commands = 0;
      let dir = './commands/';
      if (category) dir += `${category}/`
      await fs.readdir(dir, async (err, files) => {
        if (err) console.error(err);
        await files.forEach(async f => {
          if (f.split('.').length === 1) await readCommands(f);
          if (f.endsWith('.js')) {
            let props = require(`${dir}/${f}`);
            props.category = category ? category : 'None';
            client.log(`Loading command: ${props.conf.name} from category ${category ? category : 'None'}.`);
            client.commands.set(props.conf.name, props);
            props.conf.aliases.forEach(alias => {
              client.aliases.set(alias, props.conf.name);
            });
            commandsLoaded++;
            commands++;
          }
        });
        if (commands > 0) client.log(`Loaded a total of ${commands} commands from category ${category ? category : 'None'}.`);
      });
      resolve();
    });
  }

  await readCommands();
  // client.log(`Loaded a total of ${commandsLoaded} commands.`);

  client.Discord = Discord;

  client.log("Loading utility functions...");
  client.EmbedHelper = require('./utils/embedHelper');
  client.log('Loaded EmbedHelper');
  require('./utils/functions.js')(client);
  client.log('Loaded functions');

  client.reload = (command, category) => {
    return new Promise((resolve, reject) => {
      try {
        let dir = `./commands/`;
        dir = category === 'None' ? `${dir}/${command}` : `${dir}${category}/${command}`;
        delete require.cache[require.resolve(dir)];
        let cmd = require(dir);
        client.commands.delete(command);
        client.aliases.forEach((cmd, alias) => {
          if (cmd === command) client.aliases.delete(alias);
        });
        client.commands.set(command, cmd);
        cmd.conf.aliases.forEach(alias => {
          client.aliases.set(alias, cmd.conf.name);
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  };

  client.elevation = message => {
    let permlvl = 0;
    let helper_role = message.guild.roles.find(role => role.name === "Helper");
    if (helper_role && message.member.roles.has(helper_role.id)) permlvl = 1;
    let mod_role = message.guild.roles.find(role => role.name === "Moderator");
    if (mod_role && message.member.roles.has(mod_role.id)) permlvl = 2;
    let admin_role = message.guild.roles.find(role => role.name === "Admin");
    if (admin_role && message.member.roles.has(admin_role.id)) permlvl = 3;
    if (message.author.id == 198466968725094400) permlvl = 5;
    return permlvl;
  };

  client.log("Connecting...");
  client.login(process.env.TOKEN);
}

init();
