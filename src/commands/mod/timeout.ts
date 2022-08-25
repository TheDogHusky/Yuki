import { ApplicationCommandOptionType, PermissionsBitField } from 'discord.js';
import Discord from 'discord.js';
import Yuki from '../../structures/Yuki';
import { IGuild } from '../../structures/types';

export default {
	name: 'timeout',
	description: 'Mute someone',
	options: [
		{
			name: 'who',
			description: 'The member to mute',
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: 'time',
			description: 'The time of mute in seconds',
			type: ApplicationCommandOptionType.Number,
			required: true,
		},
		{
			name: 'reason',
			description: 'The reason of mute',
			type: ApplicationCommandOptionType.String,
			required: false,
		}
	],
	run: async (client: Yuki, interaction: Discord.CommandInteraction, data: IGuild, language: Map<string, string>) => {

		// Permissions check

		if (interaction.inCachedGuild() && !interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers) && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			interaction.reply('Tu n\'as pas la permission de timeout des membres');
			return;
		}

		if (interaction.inCachedGuild() && !interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.MuteMembers) && !interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Administrator)) {
			interaction.reply('Je n\'ai pas \'autorisation de timeout ce membre.');
			return;
		}

		const user = interaction.options.getUser('who');
		const member = interaction.guild.members.cache.get(user.id);
		const time = 24;
		const reason = 'Aucune raison fournie';

		if (user.id === interaction.user.id || user.id === client.user.id) {
			interaction.reply('Je ne peux pas timeout ce membre');
			return;
		}

		if (interaction.inCachedGuild() && interaction.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && (interaction.member.roles.highest.position !== 0 && member.roles.highest.position !== 0)) { // Here
			interaction.reply('Je ne peux pas timeout ce membre');
			return;
		}

		if (!member.manageable) {
			interaction.reply('Je ne peux pas timeout ce membre');
			return;
		}

		await member.timeout(time, reason).then((m) => {
			interaction.reply('Member' + m.user.username + 'timeout successfully');
		}).catch(e => {
			console.log(e);
		});

	},
};