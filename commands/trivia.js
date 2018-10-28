var fs = require("fs");
var filepath = "./files/trivias/";
var anyoneStart = false;
var anyoneStop = false;
var anyoneAnswer = false;
var startTime = 60000;
var hintTime = 30000;
var skipTime = 45000;
var betweenTime = 15000;

var trivias = ["trivia", "bike", "test", "pokemon-kanto", "billwurtz"];
var currentTrivia;
var totalQuestions = 0;
var triviaChannels = [];
var triviaRunning = false;

var scores = {};
var tempScores = {
	"ThePoptartCrpr": 1337,
	"eef": 2,
	"sable": 27,
	"squag": 16
};

var eventPersistence;
var triviaEvent;

var totalScores = {};

var currentQuestion = 0;
var currentQuestionText = 1;

// var trivia = false;
var paused = false;
var questionTimestamp = 0;
var answerText = "";
var answerArray = [];
var answered = true;
var questionTimeout;
var hintTimeout;
var skipTimeout;
var allQuestionNum;
var attempts = 0;
var special = ["ß", "ç", "ð", "ñ", "ý", "ÿ", "à", "á", "â", "ã", "ä", "å", "æ", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ò", "ó", "ô", "õ", "ö", "ù", "ú", "û", "ü", "ẞ", "Ç", "Ð", "Ñ", "Ý", "Ÿ", "À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï", "Ò", "Ó", "Ô", "Õ", "Ö", "Ù", "Ú", "Û", "Ü"];

exports.run = (client, message, params, perms) => {
  if (params[0] === "start") {
		// if (triviaChannels.indexOf(message.channel.id) != -1) return message.channel.send('A trivia is already running in this channel.');
		// if (triviaRunning) return message.channel.send('A trivia event is already running. Please wait for it to finish.');
		if (triviaRunning) return message.channel.send({
			embed: new client.Discord.MessageEmbed()
				.setTitle(`A trivia event is already running.`)
				.setDescription(`Please wait for it to finish.`)
				.setColor(client.EmbedHelper.colors.red)
				.setTimestamp()
				.setFooter("BIKE Alliance", client.user.avatarURL())
		})
		// if (perms < 2) return message.channel.send('Unfortunately, only staff can start trivia events at this time.');
		if (perms < 2) return message.channel.send({
			embed: new client.Discord.MessageEmbed()
				.setTitle(`Only staff can start trivia events at this time.`)
				.setColor(client.EmbedHelper.colors.red)
				.setTimestamp()
				.setFooter("BIKE Alliance", client.user.avatarURL())
		})
		// if (!params[1]) return message.channel.send('Usage: \n+trivia start <trivia>');
		if (!params[1]) return message.channel.send({
			embed: new client.Discord.MessageEmbed()
				.setTitle(`Usage:`)
				.setDescription(`**+trivia start <trivia>**`)
				.setColor(client.EmbedHelper.colors.red)
				.setTimestamp()
				.setFooter("BIKE Alliance", client.user.avatarURL())
		})
		// if (trivias.indexOf(params[1]) == -1) return message.channel.send('There is no trivia by that name. Please use one of the following available trivias:\`\`\`\n' + getTrivias() + '\`\`\`');
		if (trivias.indexOf(params[1]) == -1) return message.channel.send({
				embed: new client.Discord.MessageEmbed()
						.setTitle(`There is no trivia by that name.`)
						.setDescription(`Please use one of the following available trivias:\n${getTrivias()}`)
						.setColor(client.EmbedHelper.colors.red)
						.setTimestamp()
						.setFooter("BIKE Alliance", client.user.avatarURL())
				})
		startTrivia(params[1], message.channel);
	} else if (params[0] === "stop") {
		// if (!triviaRunning) return message.channel.send('There is no trivia currently running.');
		if (!triviaRunning) return message.channel.send({
					embed: new client.Discord.MessageEmbed()
						.setTitle(`No trivia is currently in progress.`)
						.setColor(client.EmbedHelper.colors.red)
						.setTimestamp()
						.setFooter("BIKE Alliance", client.user.avatarURL())
				})
		// if (perms < 2) return message.channel.send('You do not have permission to stop trivia events.');
		if (perms < 2) return	message.channel.send({
					embed: new client.Discord.MessageEmbed()
						.setTitle(`You do not have permission to stop trivia events.`)
						.setColor(client.EmbedHelper.colors.red)
						.setTimestamp()
						.setFooter("BIKE Alliance", client.user.avatarURL())
				})
		stopTrivia(message.channel);
	} else if (params[0] === "scores") {
		// if (!triviaRunning) return message.channel.send('No trivia is currently in progress.');
		if (!triviaRunning) return message.channel.send({
					embed: new client.Discord.MessageEmbed()
						.setTitle(`No trivia is currently in progress.`)
						.setColor(client.EmbedHelper.colors.red)
						.setTimestamp()
						.setFooter("BIKE Alliance", client.user.avatarURL())
				})
		
		let scorearr = Object.keys(scores).sort(function(a,b){return scores[a]-scores[b]});
		let scorestr = "";
		
		var count = 1;
		for (var i = scorearr.length - 1; i >= 0; i--) {
			scorestr += `**#${count}.** ${scorearr[i]}: ${scores[scorearr[i]]} Points\n`;
			count++;
		}
		
		if (scorestr === "") scorestr = "Nobody!";
		
		// message.channel.send(`Current scores:\n\n\`\`\`${scorestr}\`\`\``);
		message.channel.send({
			embed: new client.Discord.MessageEmbed()
				.setTitle(`:scroll: | Current scores:`)
				.setDescription(`${scorestr}`)
				.setColor(client.EmbedHelper.colors.lime)
				.setTimestamp()
				.setFooter("BIKE Alliance", client.user.avatarURL())
		})
	} else if (params[0] === "list") {
		// message.channel.send("Current available trivias: \`\`\`\n" + getTrivias() + "\`\`\`");
		
		message.channel.send({
			embed: new client.Discord.MessageEmbed()
				.setTitle(`Current available trivias:`)
				.setDescription(`\`\`\`\n${getTrivias()}\`\`\``)
				.setColor(client.EmbedHelper.colors.blue)
				.setTimestamp()
				.setFooter("BIKE Alliance", client.user.avatarURL())
		})
		
	} else {
		// message.channel.send('Usage: \n+trivia start <trivia>\n+trivia list\n+trivia stop\n+trivia scores');
		message.channel.send({
			embed: new client.Discord.MessageEmbed()
				.setTitle(`Usage:`)
				.setDescription("+trivia start <trivia>\n+trivia list\n+trivia stop\n+trivia scores")
				.setColor(client.EmbedHelper.colors.red)
				.setTimestamp()
				.setFooter("BIKE Alliance", client.user.avatarURL())
		})
	}
	
	function readTrivia(trivia) {
		var trivia = fs.readFileSync(filepath + trivia + ".txt", "utf8");
	
		return trivia;
	}
	
	function getTrivias() {
		var str = "";
		for (var i = 0; i < trivias.length; i++) {
			str += trivias[i] + "\n";
		}
		return str;
	}
	
	function startTrivia(trivia, channel) {
		// triviaChannels.push(channel.id);
		eventPersistence = JSON.parse(fs.readFileSync("./files/event_persistence.json", "utf8"));
		triviaEvent = (eventPersistence.active === true && eventPersistence.type === "trivia");
		if (triviaEvent) {
			totalScores = JSON.parse(fs.readFileSync("./files/trivia_event_stats.json", "utf8"));
		} else {
			totalScores = {};
		}
		
		triviaRunning = true;
		currentTrivia = readTrivia(trivia);
	
		var triviaSplit = currentTrivia.replace(/\r/g, "").split('\n');
	
		totalQuestions = triviaSplit.length;
	
		for (var i = totalQuestions - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var tmp = triviaSplit[i];
			triviaSplit[i] = triviaSplit[j];
			triviaSplit[j] = tmp;
		}
		
		currentTrivia = triviaSplit;
		askQuestion(currentTrivia[currentQuestion], channel);
	
	}
	
	function askQuestion(triviaQuestion, channel) {
		if (!triviaRunning) return;
		triviaQuestion = triviaQuestion.split('*');
		var question = triviaQuestion[0];
		var answer = triviaQuestion[1];
		let answerToSend = answer;
		answerToSend = answerToSend.split('|');
		answer = answer.toLowerCase();
		var possibleAnswers = answer.split('|');
		console.log(question);
		
		channel.send(`**Question ${currentQuestionText}**\n\n${question.replace(/\\n/g, "\n").replace(/:a:/g, ":regional_indicator_a:").replace(/:b:/g, ":regional_indicator_b:").replace(/:c:/g, ":regional_indicator_c:").replace(/:d:/g, ":regional_indicator_d:")}`);
		
		/*channel.send({
			embed: new client.Discord.MessageEmbed()
				.setTitle(`**Question ${currentQuestionText}**`)
				.setDescription(`${question.replace(/\\n/g, "\n").replace(/:a:/g, ":regional_indicator_a:").replace(/:b:/g, ":regional_indicator_b:").replace(/:c:/g, ":regional_indicator_c:").replace(/:d:/g, ":regional_indicator_d:")}`)
				.setColor(client.EmbedHelper.colors.blue)
				.setTimestamp()
				.setFooter("BIKE Alliance", client.user.avatarURL())
		});*/
		
		const filter = m => possibleAnswers.indexOf(m.content.toLowerCase().replace(/,/g, "")) != -1;
		channel.awaitMessages(filter, {max: 1, time: 20000, errors: ['time']})
			.then(collected => correctQuestion(collected.first().author.username, triviaQuestion, channel))
			.catch(collected => ranOutOfTimeQuestion(answerToSend[0], triviaQuestion, channel))
	}
	
	function updateTotalScores() {
		fs.writeFile("./files/trivia_event_stats.json", JSON.stringify(totalScores), (err) => {
			if (err) console.error(err);
		});
	}
	
	function correctQuestion(author, triviaQuestion, channel) {
		if (!triviaRunning) return;
		currentQuestion++;
		currentQuestionText++;
		if (scores[author]) {
			scores[author]++;
		} else {
			scores[author] = 1;
		}
		if (totalScores[author]) {
			if (triviaEvent) totalScores[author]++;
		} else {
			if (triviaEvent) totalScores[author] = 1;
		}
		if (triviaEvent) updateTotalScores();
		if (triviaEvent) console.log(triviaEvent);
		
		if (scores[author] == 10 || currentTrivia[currentQuestion] == undefined) {
			channel.send(`Correct, ${author}!`);
			setTimeout(function() {
				return stopTrivia(channel);
			}, 2000);
		} else {
			// channel.send(`Correct, ${author}!\n\nMoving on to the next question.`);
			channel.send({
				embed: new client.Discord.MessageEmbed()
					.setTitle(`Correct, ${author}!`)
					.setDescription("Moving on to the next question.")
					.setColor(client.EmbedHelper.colors.lime)
					.setTimestamp()
					.setFooter("BIKE Alliance", client.user.avatarURL())
			})
	
			setTimeout(function() {
				askQuestion(currentTrivia[currentQuestion], channel);
			}, 2000);
		}
	}
	
	function ranOutOfTimeQuestion(answer, triviaQuestion, channel) {
		if (!triviaRunning) return;
		currentQuestion++;
		currentQuestionText++;
		if (currentTrivia[currentQuestion] == undefined) {
			// channel.send(`Ran out of time! The answer was ${answer}.`);
			
			channel.send({
				embed: new client.Discord.MessageEmbed()
					.setTitle(`Ran out of time!`)
					.setDescription(`The answer was **${answer}**.`)
					.setColor(client.EmbedHelper.colors.red)
					.setTimestamp()
					.setFooter("BIKE Alliance", client.user.avatarURL())
			})
			
			setTimeout(function() {
				return stopTrivia(channel);
			})
		} else {
			// channel.send(`Ran out of time! The answer was ${answer}.\n\nMoving on to the next question.`);
			
			channel.send({
				embed: new client.Discord.MessageEmbed()
					.setTitle(`Ran out of time!`)
					.setDescription(`The answer was **${answer}**. Moving on to the next question.`)
					.setColor(client.EmbedHelper.colors.red)
					.setTimestamp()
					.setFooter("BIKE Alliance", client.user.avatarURL())
			})
	
			setTimeout(function() {
				askQuestion(currentTrivia[currentQuestion], channel);
			}, 2000);
		}
	}
	
	/*function stopTrivia(channel) {
		var index = triviaChannels.indexOf(channel.id);
		triviaChannels.splice(index, 1);
	}*/
	
	function stopTrivia(channel) {
		currentQuestion = 0;
		triviaRunning = false;
		currentQuestion = 0;
		currentQuestionText = 1;
		
		var scorearr = Object.keys(scores).sort(function(a,b){return scores[a]-scores[b]});
		var scorestr = "";
		
		var count = 1;
		for (var i = scorearr.length - 1; i >= 0; i--) {
			scorestr += `**#${count}**. ${scorearr[i]}: ${scores[scorearr[i]]} Points\n`;
			count++;
		}
		
		if (scorestr === "") scorestr = "Nobody!";
		
		// channel.send(`Trivia over. Scores:\n\n\`\`\`${scorestr}\`\`\``);
		
		channel.send({
			embed: new client.Discord.MessageEmbed()
				.setTitle(`Trivia over. Thanks for playing!`)
				.setDescription(`📜 | **Final scores:**\n\n${scorestr}`)
				.setColor(client.EmbedHelper.colors.lime)
				.setTimestamp()
				.setFooter("BIKE Alliance", client.user.avatarURL())
		})
		
		scores = {};
	}
	
};

exports.conf = {
  name: 'trivia',
  aliases: [],
  permLevel: 0,
  usage: '+trivia'
};
