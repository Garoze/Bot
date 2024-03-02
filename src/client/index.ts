import { readdirSync } from 'fs';
import { ClientOptions, Client, GatewayIntentBits, ApplicationCommandDataResolvable } from 'discord.js';
import * as path from 'path';

export class ExtendedClient extends Client {
	constructor(options?: Partial<ClientOptions>) {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.MessageContent,
			],
			...options,
		});
	}

	static singleton?: ExtendedClient;

	static getSingleton(): ExtendedClient {
		if (!this.singleton) this.singleton = new ExtendedClient();
		return this.singleton;
	}

	commandList: ApplicationCommandDataResolvable[] = [];

	addCommand(command: ApplicationCommandDataResolvable) {
		this.commandList.push(command);
	}

	async loadCommands() {
		const commandsPath = path.join(__dirname, '..', 'commands');

		readdirSync(commandsPath).forEach(local => {

			readdirSync(commandsPath + `/${local}/`).forEach(async fileName => {

				await import(`../commands/${local}/${fileName}`);
			});
		});
	}

	async registerCommands() {
		this.application?.commands.set(this.commandList).then(() => {
			console.log('Comandos registrados!');
		});
	}
}
