/* eslint-disable @typescript-eslint/no-var-requires */

export class LanguageManager {
	public trads: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();
	public frTrads: Map<string, string> = new Map<string, string>();
	public enTrads: Map<string, string> = new Map<string, string>();

	constructor() {
		const frJson = require('../../languages/fr.json');
		Object.keys(frJson).forEach(key => {
			const value = frJson[key];
			this.frTrads.set(key, value);
		});

		const enJson = require('../../languages/en.json');
		Object.keys(enJson).forEach(key => {
			const value = enJson[key];
			this.enTrads.set(key, value);
		});

		this.trads.set('fr', this.frTrads);
		this.trads.set('en', this.enTrads);
	}

	public get(lang: string): Map<string, string> {
		return this.trads.get(lang);
	}
}