const fs = require('fs');
const Discord = require('discord.js');
const child_process = require('child_process');
const client = new Discord.Client();


const credentials = JSON.parse(fs.readFileSync('./credentials.json'))

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	const mc = child_process.spawn('docker', ['attach', 'mc']);
	mc.stdout.on('data', data => {
		console.log(data);
	});
	mc.stderr.on('data', data => {
		console.log(data.toString('utf-8'));
	})
});

client.on('message', msg => {
	if (msg.content === 'ping') {
		msg.reply('Pong!');
	}
});

client.login(credentials['discord']['token']);