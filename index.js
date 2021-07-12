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
var playerCount = 0;

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
			activePlayerList.push(playername);
			mc.send('/list\r');
			outputChannel.send(`${playername} just logged in! There are ${playerCount} players online right now`);
		} else if(data.includes('left the game')){
			const playername = extractPlayerName(data);
			activePlayerList = activePlayerList.filter(e => e !== playername); //remove player from array
			mc.send('/list\r');
			outputChannel.send(`${playername} just checked out. There are ${playercount} players online right now`);
		} else if(data.includes('players online')){
			playerCount = data.split(']: ')[1].split(' ')[2];
			activePlayerList = data.split('players online: ')[1].split(', ');
			console.log(`bot started, ${playerCount} players online: ${activePlayerList}`);
		}
		
	});

	mc.write('sudo docker attach mc\r');
	mc.write('/list\r')
});


client.login(credentials['discord']['token']);