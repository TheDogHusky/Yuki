import { LoggerOptions } from './types';
import moment from 'moment';
import 'moment-timezone';
import fs from 'fs';
import Utils from './utils';
import chalk from 'chalk';

/**
 * Custom Cool and customisable logger, in TypeScript.
 */
class Logger {
    public options: LoggerOptions = {
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
            colored: true
        },
        logsaving: {
            enabled: true,
            path: './logs'
        },
    };
    public date: Date = new Date();
    public formattedDate: string = moment(this.date).tz(this.options.timezone).format(`DD/MM/YYYY HH:mm:ss`);
    public sessiondate: string = moment(new Date()).tz(this.options.timezone).format(`DD-MM-YYYY--HH-mm-ss`);

    constructor(options: LoggerOptions) {
        this.options = options;

        if(this.options.logsaving.enabled && !fs.existsSync(this.options.logsaving.path)) {
            console.warn(`[Logger] The logs folder doesn't exist, creating it...`);
            fs.mkdirSync(this.options.logsaving.path);
        };
        if(this.options.colors.info) {
            if(!Utils.isValidHEX(this.options.colors.info.color)) throw new Error(`[Logger] The color ${this.options.colors.info.color} is not a valid HEX color!`);
            if(!Utils.isValidHEX(this.options.colors.info.background)) throw new Error(`[Logger] The background color ${this.options.colors.info.background} is not a valid HEX color!`);
        };
        if(this.options.colors.debug) {
            if(!Utils.isValidHEX(this.options.colors.debug.color)) throw new Error(`[Logger] The color ${this.options.colors.debug.color} is not a valid HEX color!`);
            if(!Utils.isValidHEX(this.options.colors.debug.background)) throw new Error(`[Logger] The background color ${this.options.colors.debug.background} is not a valid HEX color!`);
        };
        if(this.options.colors.warn) {
            if(!Utils.isValidHEX(this.options.colors.warn.color)) throw new Error(`[Logger] The color ${this.options.colors.warn.color} is not a valid HEX color!`);
            if(!Utils.isValidHEX(this.options.colors.warn.background)) throw new Error(`[Logger] The background color ${this.options.colors.warn.background} is not a valid HEX color!`);
        };
        if(this.options.colors.error) {
            if(!Utils.isValidHEX(this.options.colors.error.color)) throw new Error(`[Logger] The color ${this.options.colors.error.color} is not a valid HEX color!`);
            if(!Utils.isValidHEX(this.options.colors.error.background)) throw new Error(`[Logger] The background color ${this.options.colors.error.background} is not a valid HEX color!`);
        };
        if(this.options.colors.fatal) {
            if(!Utils.isValidHEX(this.options.colors.fatal.color)) throw new Error(`[Logger] The color ${this.options.colors.fatal.color} is not a valid HEX color!`);
            if(!Utils.isValidHEX(this.options.colors.fatal.background)) throw new Error(`[Logger] The background color ${this.options.colors.fatal.background} is not a valid HEX color!`);
        };
    };

    /**
     * 
     * @param message The message to format
     * @param type The type of the log
     * @param process The optionnal process of the log
     * @returns The formatted message
     */
    public formatMessage(message: string, type: (string | 'info' | 'debug' | 'warn' | 'fatal' | 'error'), process?: string): string {
        this.refreshDates();

        const loggernamecolor = this.options.colors.loggernamecolor;
        const processcolor = this.options.colors.processcolor;
        const blue = this.options.colors.blue;
        const grey = this.options.colors.grey;
        const color = this.options.colors[type].color;
        const colorlight = this.options.colors[type].light;
        const background = this.options.colors[type].background;
        const highlight = this.options.colors[type].highlight;

        const formattedMessage = `[${this.formattedDate}] [${type.toUpperCase()}${process ? ` / ${process}` : ''}] ${type.toUpperCase()} ▪ ${message}`;

        if(this.options.logconsole.colored) {
            return `${chalk.hex(grey)('[')}${chalk.hex(blue)(this.formattedDate)}${chalk.hex(grey)(']')} ${chalk.hex(grey)('[')}${chalk.hex(loggernamecolor)(this.options.name)}${process ? chalk.hex(grey)(' / ') : ''}${process ? chalk.hex(processcolor)(process) : ''}${chalk.hex(grey)(']')} ${chalk.hex(colorlight)(type.toUpperCase())} ${chalk.hex(grey)('▪')} ${highlight ? chalk.bgHex(background)(chalk.hex(color)(message)) : chalk.hex(color)(message)}`;
        } else {
            return formattedMessage;
        };
    };

    /**
     * System fonction: Refreshes the dates
     */
    public refreshDates(): void {
        const date = new Date();

        this.date = date;
        this.formattedDate = moment(date).tz(this.options.timezone).format(`DD/MM/YYYY HH:mm:ss${this.options.timezoneformat === 12 ? ' A' : ''}`);
    };

    /**
     * Allows to log a message as info.
     * @param message The message to log
     * @param process The optionnal process name
     */
    public info(message: string, process?: string): void {
        const formattedMessage = this.formatMessage(message, 'info', process);
        this.refreshDates();

        if(this.options.logconsole.enabled) console.info(formattedMessage);
        if(this.options.logsaving.enabled) fs.appendFileSync(`${this.options.logsaving.path}/${this.sessiondate}.log`, `${formattedMessage}\n`);
    };

    /**
     * Allows to log a message as debug.
     * @param message The message to log
     * @param process The optionnal process name
     */
    public debug(message: string, process?: string): void {
        const formattedMessage = this.formatMessage(message, 'debug', process);
        this.refreshDates();

        if(this.options.logconsole.enabled) console.debug(formattedMessage);
        if(this.options.logsaving.enabled) fs.appendFileSync(`${this.options.logsaving.path}/${this.sessiondate}.log`, `${formattedMessage}\n`);
    };

    /**
     * Allows to log a message as warn.
     * @param message The message to log
     * @param process The optionnal process name
     */
    public warn(message: string, process?: string): void {
        const formattedMessage = this.formatMessage(message, 'warn', process);
        this.refreshDates();

        if(this.options.logconsole.enabled) console.warn(formattedMessage);
        if(this.options.logsaving.enabled) fs.appendFileSync(`${this.options.logsaving.path}/${this.sessiondate}.log`, `${formattedMessage}\n`);
    };

    /**
     * Allows to log an error.
     * @param message The message to log
     * @param process The optionnal process name
     */
    public error(message: string, process?: string): void {
        const formattedMessage = this.formatMessage(message, 'error', process);
        this.refreshDates();

        if(this.options.logconsole.enabled) console.error(formattedMessage);
        if(this.options.logsaving.enabled) fs.appendFileSync(`${this.options.logsaving.path}/${this.sessiondate}.log`, `${formattedMessage}\n`);
    };

    /**
     * Allows to log a fatal error, which will exit the process.
     * @param message The message to log
     * @param optionnalprocess The optionnal process name
     */
    public fatal(message: string, optionnalprocess?: string): void {
        const formattedMessage = this.formatMessage(message, 'fatal', optionnalprocess);
        this.refreshDates();

        if(this.options.logconsole.enabled) console.error(formattedMessage);
        if(this.options.logsaving.enabled) fs.appendFileSync(`${this.options.logsaving.path}/${this.sessiondate}.log`, `${formattedMessage}\n`);
        process.exit(1);
    };
};


export default Logger;