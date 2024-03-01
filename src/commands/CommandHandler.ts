import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { resolve, dirname } from 'path';

export class CommandHandler {
	private commandFolders: string[] = ['utility'];
	private commandsCollection: Collection<any, any>;

	public constructor() {
		this.commandsCollection = new Collection();
	}

	public loadCommands(): Collection<any, any> {
		this.commandFolders.forEach((folder) => {
			const folderPath = resolve(dirname(''), 'src', 'commands', folder);
			const commandsFiles = readdirSync(folderPath).filter((file) => file.endsWith('.command.ts'));

			commandsFiles.forEach(async (file) => {
				// TODO: find a better way to deal with the whole file:/// windows thing.
				const { default: command } = await import(`file:///${folderPath}/${file}`);
				if ('data' in command && 'execute' in command) {
					this.commandsCollection.set(command.data.name, command);
				}
				else {
					console.log(`[WARN] Bot - The command ${file} is missing a required "data" or "execute" property.`);
				}
			});
		});

		return this.commandsCollection;
	}
}
