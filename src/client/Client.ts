import { readdirSync } from 'fs';
import { readdir } from 'fs/promises';

import {
  ClientOptions,
  Client,
  GatewayIntentBits,
  ApplicationCommandDataResolvable,
  Partials,
  Routes,
  REST,
  Collection,
  Events,
  StringSelectMenuInteraction,
  ModalSubmitInteraction,
} from 'discord.js';

import { dirname, resolve } from 'path';
import { CommandInterface } from 'src/@types/command';
import { EventInterface } from 'src/@types/event';

export class BotClient extends Client {
  public static singleton?: BotClient;

  public commandsFolders: string[] = ['common', 'admin'];
  public applicationCommandList: ApplicationCommandDataResolvable[] = [];

  public commandCollection: Collection<string, CommandInterface> =
    new Collection();

  // public buttonsCollection = new Collection();
  public selectsCollection = new Collection<
    string,
    (interaction: StringSelectMenuInteraction) => any
  >();
  // public modalsCollection = new Collection();

  public modalsCollection = new Collection<
    string,
    (interaction: ModalSubmitInteraction) => any
  >();

  constructor(options?: Partial<ClientOptions>) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
      ],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
      ],
      ...options,
    });
  }

  public static getSingleton(): BotClient {
    if (!this.singleton) this.singleton = new BotClient();
    return this.singleton;
  }

  public addCommand(command: CommandInterface) {
    this.commandCollection.set(command.props.name, command);
    this.applicationCommandList.push(command.props);

    if (command.props.selects) {
      command.props.selects.map((execute, customID) =>
        this.selectsCollection.set(customID, execute),
      );
    }

    if (command.props.modals) {
      command.props.modals.map((execute, customID) =>
        this.modalsCollection.set(customID, execute),
      );
    }
  }

  public async registerCommands() {
    const rest = new REST().setToken(process.env.BOT_TOKEN);

    try {
      console.log(
        `Started refreshing ${this.commandCollection.get.length} application (/) commands.`,
      );

      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID,
        ),
        { body: this.applicationCommandList },
      );

      console.log(
        `Successfully reloaded ${this.commandCollection.get.length} application (/) commands.`,
      );
    } catch (error) {
      console.error(error);
    }
  }

  public async loadCommands() {
    await Promise.all(
      this.commandsFolders.map(async (folder) => {
        const folderPath = resolve(dirname(''), 'src', 'commands', folder);
        const commandsFiles = (await readdir(folderPath)).filter((file) =>
          file.endsWith('.command.ts'),
        );

        await Promise.all(
          commandsFiles.map(async (file) => {
            await import(`file:///${folderPath}/${file}`);
          }),
        );
      }),
    );

    await this.registerCommands();
  }

  public registerEvent<Key extends Events>(event: EventInterface<Key>) {
    if (event.props.once) {
      this.once(event.props.name, (...args) => event.execute(...args));
    } else {
      this.on(event.props.name, (...args) => event.execute(...args));
    }
  }

  async loadEvents() {
    const eventsFolder = resolve(dirname(''), 'src', 'events', 'common');
    const eventsFiles = readdirSync(eventsFolder).filter((file) =>
      file.endsWith('.event.ts'),
    );

    eventsFiles.forEach(async (file) => {
      await import(`file:///${eventsFolder}/${file}`);
    });
  }

  public async start() {
    await this.loadCommands();
    await this.loadEvents();

    this.login(process.env.BOT_TOKEN);
  }
}
