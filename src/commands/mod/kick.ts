import { ApplicationCommandOptionType, PermissionsBitField } from 'discord.js';
import Discord from 'discord.js';
import Yuki from '../../structures/Yuki';
import { IGuild } from '../../structures/types';

export default {
	name: 'kick',
	description: 'Kick someone of the server',
	options: [
		{
			name: 'who',
			description: 'The member to kick',
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: 'reason',
			description: 'The reason of kick',
			type: ApplicationCommandOptionType.String,
			required: false,
		}
	],
	run: async (client: Yuki, interaction: Discord.CommandInteraction, data: IGuild, language: Map<string, string>) => {

		// Permissions check

		if (interaction.inCachedGuild() && !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers) && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			interaction.reply('Tu n\'as pas la permission de kick des membres');
			return;
		}

		if (interaction.inCachedGuild() && !interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.KickMembers) && !interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Administrator)) {
			interaction.reply('Je n\'ai pas \'autorisation de kick ce membre.');
			return;
		}

		const user = interaction.options.getUser('who');
		const member = interaction.guild.members.cache.get(user.id);
		const reason = 'Aucune raison fournie';

		if (user.id === interaction.user.id || user.id === client.user.id) {
			interaction.reply('Je ne peux pas kick ce membre');
			return;
		}

		if (interaction.inCachedGuild() && interaction.member.roles.highest.comparePositionTo(member.roles.highest) < 1) {
			interaction.reply('Je ne peux pas kick ce membre');
			return;
		}

		if (interaction.inCachedGuild() && interaction.member.roles.highest.comparePositionTo(interaction.guild.members.cache.get(client.user.id).roles.highest) < 1) {
			interaction.reply('Je ne peux pas kick ce membre');
			return;
		}

		if (!member.manageable || !member.kickable) {
			interaction.reply('Je ne peux pas kick ce membre');
			return;
		}

		await member.kick(reason).then((m) => {
			interaction.reply('Member' + m.user.username + 'kicked successfully');
		});
	},
};