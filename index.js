const fs = require('fs');
const Discord = require('discord.js');
const pty = require('node-pty');
const os = require('os');
const client = new Discord.Client();

const credentials = JSON.parse(fs.readFileSync('./credentials.json'))

var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);

	mc = pty.spawn(shell, [], {
		name: 'xterm-color',
		cols: 80,
		rows: 30,
		cwd: process.env.HOME,
		env: process.env
	});

	mc.on('data', data => {
		console.log(data);
	});

	mc.write('sudo docker attach mc\r');
	mc.write('/help\r');
});

client.on('message', msg => {
	if (msg.content === 'ping') {
		msg.reply('Pong!');
	}
});

client.login(credentials['discord']['token']);