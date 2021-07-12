const fs = require('fs');
const Discord = require('discord.js');
const pty = require('node-pty');
const os = require('os');
const client = new Discord.Client();

const credentials = JSON.parse(fs.readFileSync('./credentials.json'))

var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

function extractPlayerName(data) {
	return data.split('[Server thread/INFO]: ')[1].split(' ')[0].split('[')[0];
}

var activePlayerList = [];
var logInOutMsg = '';

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);

	mc = pty.spawn(shell, [], {
		name: 'xterm-color',
		cols: 80,
		rows: 30,
		cwd: process.env.HOME,
		env: process.env
	});

	const channelID = '863026838056992778';
	const outputChannel = client.channels.cache.get(channelID);

	mc.on('data', data => {
		if(data.includes('joined the game')){
			const playername = extractPlayerName(data);
			logInOutMsg = `${playername} just logged in!`;
			mc.write('/list\r');
		} else if(data.includes('left the game')){
			const playername = extractPlayerName(data);
			logInOutMsg = `${playername} just checked out.`;
			mc.write('/list\r');
		} else if(data.includes('players online')){
			var playerCount = data.split(']: ')[1].split(' ')[2];
			activePlayerList = data.split('players online: ')[1].split(', ');
			outputChannel.send(`${logInOutMsg} There are currently ${playerCount} players online`);
		}
		
	});

	mc.write('sudo docker attach mc\r');
	mc.write('/list\r')
});


client.login(credentials['discord']['token']);