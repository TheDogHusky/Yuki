import { ApplicationCommandOptionType } from 'discord.js';
import Discord from 'discord.js';
import Yuki from '../../structures/Yuki';
import { IGuild } from '../../structures/types';

export default {
	name: 'hello',
	description: 'Hello world',
	options: [{
		name: 'who',
		description: 'Who to say hello to',
		type: ApplicationCommandOptionType.User,
		required: true,
	}],
	run: async (client: Yuki, interaction: Discord.CommandInteraction, data: IGuild, language: Map<string, string>) => {
		const user = interaction.options.getUser('who');
		await interaction.reply(language.get('TEST'));
		await interaction.reply(`Hello ${interaction.member}!`);
	},
};