/* eslint-disable @typescript-eslint/no-var-requires */
import { Config, Category, Colors, Emotes, Schemas } from './types';
import { LanguageManager } from './LanguageManager';
import Logger from './Logger';
import colors from '../colors';
import emotes from '../emotes';
import Discord, { Snowflake } from 'discord.js';
import fs from 'fs';
import config from '../config';
import mongoose from 'mongoose';
import path from 'path';
import schemasModels from '../models/index';
import * as Sentry from '@sentry/node';


class Yuki extends Discord.Client {

	public categories: Discord.Collection<string, Category> = new Discord.Collection<string, Category>();
	public languageManager: LanguageManager = new LanguageManager();
	public emotes: Emotes = emotes;
	public colors: Colors = colors;
	public config: Config = config;
	public schemas: Schemas = schemasModels;
	public logger: Logger = new Logger({
		name: 'Yuki',
        colors: {
            info: {
                color: '#34B534',
                light: '#53D953',
                background: '#276B27',
                highlight: false,
            },
            debug: {
                color: '#2EA0D5',
                light: '#58C2F3',
                background: '#27566B',
                highlight: false,
            },
            warn: {
                color: '#F3D958',
                light: '#DEC12F',
                background: '#DFD18A',
                highlight: false,
            },
            error: {
                color: '#E12A27',
                light: '#EA6D6A',
                background: '#7A201E',
                highlight: false,
            },
            fatal: {
                color: '#FF1D19',
                light: '#FF6360',
                background: '#FEAAA8',
                highlight: true,
            },
            grey: '#bbbbbb',
            blue: '#4CD2FF',
            loggernamecolor: '#4CBAFF',
            processcolor: '#4C70FF',
        },
        timezone: 'Europe/Paris',
        timezoneformat: 24,
        logconsole: {
            enabled: true,
            colored: true,
        },
        logsaving: {
            enabled: true,
            path: './logs',
        },
	});

	constructor() {
		super({ intents: [ Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMembers ] });

		this.config = config;

		Sentry.init({
			dsn: this.config.sentryDSN,

			// Set tracesSampleRate to 1.0 to capture 100%
			// of transactions for performance monitoring.
			// We recommend adjusting this value in production
			tracesSampleRate: 1.0,
		});
	};


	async loadCommands() {
		fs.readdirSync(path.join(__dirname, '..', 'commands')).forEach(dir => {
			const files = fs.readdirSync(path.join(__dirname, '..', 'commands', dir));
			for (const file of files) {
				const command = require(`../commands/${dir}/${file}`).default;
				if (file === 'category.js') {
					this.categories.set(command.name, command);
					this.logger.info(`Catégorie ${command.name} chargée.`, "Loader");
				} else {
					continue;
				};
			};
		});
	};

	async postCommands() {
		const devGuild = await this.guilds.fetch(this.config.devGuildId);
		for (const category of this.categories.values()) {
			if (!category.global) {
				await devGuild.commands?.create({
					name: category.name,
					description: category.description,
					options: category.options,
				});
				this.logger.info(`Commande ${category.name} postée sur le serveur ${devGuild.name}.`, "Loader");
			} else {
				await this.application.commands?.create({
					name: category.name,
					description: category.description,
					options: category.options,
				});
				this.logger.info(`Commande ${category.name} postée globalement.`, "Loader");
			};
		};
	}

	async loadEvents() {
		const events = fs.readdirSync(path.join(__dirname, '..', 'events'));
		for (const file of events) {
			const event = require(`../events/${file}`).default;
			this.logger.info(`Chargement de l'événement ${file}`, "Loader");
			if (event.once) {
				this.once(event.name, (...args) => event.run(this, ...args));
			} else {
				this.on(event.name, (...args) => event.run(this, ...args));
			};
		};
	};

	async dbConnect() {
		mongoose.connect(this.config.mongourl, this.config.mongoptions).catch((err: Error) => this.logger.error(`Erreur lors de la connexion à la base de données: ${err.stack}`, "MongoDB"));
		mongoose.connection.on('connected', () => {
			this.logger.info('Connexion à la base de données MongoDB réussie', "MongoDB");
		});
	};

	async getGuild(id: Snowflake, createOneIfNotFound = true) {
		let guild = await this.schemas.guild.findOne({ GuildID: id });
		if (!guild && createOneIfNotFound) guild = await new this.schemas.guild({ GuildID: id }).save();

		return guild;
	};

	async init() {
		try {
			await this.loadCommands();
			await this.loadEvents();
			await this.dbConnect();
			await this.login(this.config.isDevMode ? this.config.devToken : this.config.token);
		} catch (e) {
			const sentryId = Sentry.captureException(e);
			this.logger.error("Error when initializing bot.\nError ID: " + sentryId);
		};
	};
};


export default Yuki;