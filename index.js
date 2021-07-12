const fs = require('fs');
const Discord = require('discord.js');
const pty = require('node-pty');
const os = require('os');
const client = new Discord.Client();

const credentials = JSON.parse(fs.readFileSync('./credentials.json'))

var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

function extractPlayerName(shorter, longer){
	return longer.filter(x => !shorter.includes(x));
}

var activePlayerList = [];
var tempActivePlayerList = [];

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
		if(data.includes('joined the game') || data.includes('left the game')){
			mc.write(list)
		} else if(data.includes('players online')){
			tempActivePlayerList = data.split('players online: ')[1].split(', ');
			if(tempActivePlayerList > activePlayerList){ // someone joined the game
				playername = extractPlayerName(activePlayerList, tempActivePlayerList);
				outputChannel.send(`${playername} just logged in! There are ${activePlayerList.length} players online right now`);
			} else if (tempActivePlayerList < activePlayerList){ // someone left the game
				playername = extractPlayerName(tempActivePlayerList, activePlayerList);
				outputChannel.send(`${playername} just checked out. There are ${activePlayerList.length} players online right now`);
			}
			activePlayerList = tempActivePlayerList;
			tempActivePlayerList = [];
			
		}
		
	});

	mc.write('sudo docker attach mc\r');
	mc.write('/list\r')
});


client.login(credentials['discord']['token']);