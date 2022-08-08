import { Schema, model } from 'mongoose';
import { IGuild } from '../structures/types';

const guildSchema: Schema = new Schema({
	GuildID: { type: String, required: true },
	Lang: { type: String, default: 'fr' }
});

export default model<IGuild>('Guilds', guildSchema);