/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs';

export class LanguageManager {
	public trads: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();
	public frTrads: Map<string, string> = new Map<string, string>();
	public enTrads: Map<string, string> = new Map<string, string>();

	constructor() {
		const trads = fs.readdirSync("../../languages").filter((file) => file.endsWith(".json"));
		for (const trad of trads) {
			const lang = trad.split(".")[0];
			const tradFile = require(`../../languages/${trad}`);
			const tradName = lang + "Trads";
			Object.keys(tradFile).forEach(key => {
				const value = tradFile[key];
				this[tradName].set(key, value);
			});
			this.trads.set(lang, this[tradName]);
		}
	}

	public get(lang: string): Map<string, string> {
		return this.trads.get(lang);
	}
}