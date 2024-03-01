import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { resolve, dirname } from 'path';

export class EventHandler {
	private client: Client;

	public constructor(client: Client) {
		this.client = client;
	}

	public loadEvents() {
		const eventsFolder = resolve(dirname(''), 'src', 'events');
		const eventsFiles = readdirSync(eventsFolder).filter((file) => file.endsWith('.event.ts'));

		eventsFiles.forEach(async (file) => {
			const { default: event } = await import(`file:///${eventsFolder}/${file}`);

			console.log(event);
			if (event.data.once) {
				this.client.once(event.data.name, (...args) => event.execute(...args));
			}
			else {
				this.client.on(event.data.name, (...args) => event.execute(...args));
			}
		});
	}
}
