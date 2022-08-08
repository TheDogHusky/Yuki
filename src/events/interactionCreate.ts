import Discord, { ButtonStyle } from 'discord.js';
import Yuki from '../structures/Yuki';
import * as Sentry from '@sentry/node';

export default {
	name: 'interactionCreate',
	once: false,
	run: async (client: Yuki, interaction: Discord.ChatInputCommandInteraction) => {
		if (interaction.type === Discord.InteractionType.ApplicationCommand) {
			if (!interaction.guildId) return;

			const data = await client.getGuild(interaction.guildId);

			const category = client.categories.get(interaction.commandName);
			if (!category) {
				await client.application.commands.delete(interaction.commandId);
				await interaction.reply({ content: `${client.emotes.bug}・Commande inconnue, elle a été retirée de vos commandes.`, ephemeral: true });
				return;
			};

			const command = category.subs.get(interaction.options.getSubcommand());
			if (!command) return await interaction.reply({ content: `${client.emotes.bug}・Commande Inconnue.` });

			const language: Map<string, string> = client.languageManager.get(data.Lang);

			try {
				await command.run(client, interaction, data, language);
			} catch (e) {
				const sentryId = Sentry.captureException(e);
				const button = new Discord.ButtonBuilder()
					.setLabel('Support')
					.setStyle(Discord.ButtonStyle.Link)
					.setURL('https://discord.gg/h9zeSfBUft');
				const row = new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
					.addComponents(button);
					// pour choper ça j'ai une idée:
				if(interaction.replied) return await interaction.editReply({ content: `**Une erreur est survenue.**\nNe t'inquiète pas, l'équipe de Yuki a été prévenue. Si cela se reproduit, n'hésite pas à rejoindre le serveur support !\n\`ErrorId: ${sentryId}\``, components: [row] });
				await interaction.reply({ content: `**Une erreur est survenue.**\nNe t'inquiète pas, l'équipe de Yuki a été prévenue. Si cela se reproduit, n'hésite pas à rejoindre le serveur support !\n\`ErrorId: ${sentryId}\``, components: [row] });			
			};
		};
	},
};
