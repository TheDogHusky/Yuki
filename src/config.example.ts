export default {
	token: '', // The bot's token
	devGuildId: '', // The ID of the development server
	supportId: '', // The ID of the support server
	ownersId: [], // The IDs of the bot's owners
	userId: '', // The ID of the bot's user
	devToken: '', // The bot's token in development mode
	mongourl: '', // The URL of the MongoDB database (can be a local database or a MongoDB Atlas database)
	mongoptions: {
		autoIndex: false,
		maxPoolSize: 10,
		serverSelectionTimeoutMS: 5000,
		socketTimeoutMS: 45000
	},
	isDevMode: true, // If the bot is in development mode
	sentryDSN: '', // The DSN of the Sentry project
};