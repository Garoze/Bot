import { Collection, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { resolve, dirname } from 'path';

export class CommandHandler {
	private commandFolders: string[] = ['utility'];
	private commandsCollection: Collection<any, any>;
	private commandsToRegister: string[] = [];

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
					this.commandsToRegister.push(command.data.toJSON());
				}
				else {
					console.log(`[WARN] Bot - The command ${file} is missing a required "data" or "execute" property.`);
				}
			});
		});

		return this.commandsCollection;
	}

	// TODO: Test it later.
	public async registerCommands() {
		const rest = new REST().setToken(process.env.BOT_TOKEN);

		try {
			console.log(`Started refreshing ${this.commandsToRegister.length} application (/) commands.`);

			await rest.put(
				Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
				{ body: this.commandsToRegister },
			);

			// for global
			// await rest.put(
			//   Routes.applicationCommands(clientId),
			//   { body: commands },
			// );

			console.log(`Successfully reloaded ${this.commandsToRegister.length} application (/) commands.`);
		}
		catch (error) {
			console.error(error);
		}
	}

}
