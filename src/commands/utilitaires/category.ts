/* eslint-disable @typescript-eslint/no-var-requires */
import Discord from 'discord.js';
import fs from 'fs';
import { SubCommand } from '../../structures/types';

const subs = new Discord.Collection();

const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./${file}`).default;
	if (file !== 'category.js' && command.name) {
		subs.set(command.name, command);
	};
};

const toexport = {
	name: 'utilitaires',
	description: 'Utils commands',
	options: [],
	subs,
	global: false,
	utils: {
		emote: '🛠️'
	}
};

subs.forEach((sub: SubCommand) => {
	toexport.options.push({
		name: sub.name,
		description: sub.description,
		type: 1,
		options: sub.options
	});
});

export default toexport;