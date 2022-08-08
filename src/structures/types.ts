/* eslint-disable @typescript-eslint/ban-types */
import Discord, { ApplicationCommandOptionType } from 'discord.js';
import Yuki from './Yuki';
import { Document } from 'mongoose';
import Guild from '../models/guild';
import Error from '../models/error';

export type Category = {
    name: string;
    description: string;
    options: Array<any>; // À voir
    subs: Discord.Collection<string, Command>;
    global: boolean,
    utils: {
        emote: string
    };
};

export type Command = {
    name: string;
    description: string;
    options: Array<CommandOption>;
    utils: {
        usage: string;
        examples: Array<string>;
        cooldown: string;
    };
    run: (client: Yuki, interaction: Discord.CommandInteraction, data: IGuild, language: Map<string, string>) => Promise<void>;
};

export type SubCommand = {
    name: string,
    description: string,
    type: number,
    options: CommandOption[] // À fix
}

export type CommandOption = {
    name: string,
    description: string,
    type: ApplicationCommandOptionType,
    required: boolean,
}

export type Config = {
    token: string,
    devToken: string,
    ownersId: string[],
    devGuildId: string,
    supportId: string,
    userId: string,
    mongourl: string,
    mongoptions: {
        autoIndex: boolean,
        maxPoolSize: number,
        serverSelectionTimeoutMS: number,
        socketTimeoutMS: number 
    },
    isDevMode: boolean,
    sentryDSN: string,
};

export type Colors = {
    main?: string;
    secondary?: string;
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
    debug?: string;
};

export type Emotes = {
    yep?: string;
    non?: string;
    error?: string;
    success?: string;
    warning?: string;
    info?: string;
    loading?: string;
    bug?: string;
};

export type Status = {
    name: () => string;
    type: Discord.ActivityType.Playing | Discord.ActivityType.Competing | Discord.ActivityType.Listening | Discord.ActivityType.Streaming | Discord.ActivityType.Watching;
    url: string;
}

export type Schemas = {
    guild: typeof Guild,
    error: typeof Error
};

export interface IGuild extends Document {
    GuildID: string,
    Lang: string
}

export interface IError extends Document {
    ErrorID: string,
    ErrorDate: Date,
    ErrorMessage: string,
    ErrorStack: string,
    ErrorFrom: Object,
}

export type LoggerOptions = {
    name: string;
    colors: LoggerColors;
    timezone: string;
    timezoneformat: number;
    logsaving: {
        enabled: boolean;
        path: string;
    };
    logconsole: {
        enabled: boolean;
        colored: boolean;
    };
};

export type LoggerColors = {
    debug?: {
        color: string;
        light: string;
        background: string;
        highlight: boolean
    };
    info?: {
        color: string;
        light: string;
        background: string;
        highlight: boolean
    };
    warn?: {
        color: string;
        light: string;
        background: string;
        highlight: boolean
    };
    error?: {
        color: string;
        light: string;
        background: string;
        highlight: boolean
    };
    fatal?: {
        color: string;
        light: string;
        background: string;
        highlight: boolean
    };
    grey?: string;
    blue?: string;
    loggernamecolor?: string;
    processcolor?: string;
};