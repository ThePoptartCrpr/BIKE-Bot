// Package dependencies
require('dotenv').config();

const Discord = require('discord.js');
const fs = require('fs');
const moment = require('moment');

const client = new Discord.Client();

// File dependencies
require('./utils/eventLoader')(client);

// Client settings
client.prefix = process.env.PREFIX;

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

client.log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  client.log(`Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    let props = require(`./commands/${f}`);
    client.log(`Loading command: ${props.conf.name}.`);
    client.commands.set(props.conf.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.conf.name);
    });
  });
});

client.Discord = Discord;

client.log("Loading utility functions...");
client.EmbedHelper = require('./utils/embedHelper');
client.log('Loaded EmbedHelper');
require('./utils/functions.js');
client.log('Loaded functions');

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
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
  let helper_role = message.guild.roles.find('name', "Helper");
  if (helper_role && message.member.roles.has(helper_role.id)) permlvl = 1;
  let mod_role = message.guild.roles.find('name', "Moderator");
  if (mod_role && message.member.roles.has(mod_role.id)) permlvl = 2;
  let admin_role = message.guild.roles.find('name', "Admin");
  if (admin_role && message.member.roles.has(admin_role.id)) permlvl = 3;
  if (message.author.id == 198466968725094400) permlvl = 5;
  return permlvl;
};

client.log("Connecting...");
client.login(process.env.TOKEN);
