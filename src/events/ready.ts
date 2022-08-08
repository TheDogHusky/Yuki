import Discord from 'discord.js';
import Yuki from '../structures/Yuki';
import { Status } from '../structures/types';

export default {
	name: 'ready',
	once: false,
	run: async (client: Yuki) => {
		client.logger.info(`Logged in as ${client.user.tag}!`, "Loader");

		client.user.setActivity({ name: 'Loading...', type: Discord.ActivityType.Playing });
		client.user.setStatus(Discord.PresenceUpdateStatus.Idle);

		await client.postCommands();
		client.user.setStatus(Discord.PresenceUpdateStatus.Online);
		const statuses: Status[] = [
			{
				name: () => '/help | /support',
				type: Discord.ActivityType.Playing,
				url: 'https://Yuki.thedoghusky.repl.co'
			}, {
				name: () => `${client.guilds.cache.size} servers | ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} users`,
				type: Discord.ActivityType.Playing,
				url: 'https://Yuki.thedoghusky.repl.co'
			},
		];

		let i = 0;
		setInterval(() => {
			client.user.setActivity({ name: statuses[i].name(), type: statuses[i].type, url: statuses[i].url });
			i++;
			if (i >= statuses.length) i = 0;
		}, 15000);
	},
};
