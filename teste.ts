import { CommandInteractionOptionResolver, SlashCommandBuilder } from 'discord.js';

interface CommandProps {
  name: string;
  description: string;
  options?: CommandInteractionOptionResolver;
}

// client: ExtendedClient,
// interaction: CommandInteraction,
// options:

const commandList: SlashCommandBuilder[] = [];

function Command<T extends { new(): CommandProps }>(target: T, _context: unknown) {
  const comando = new target();
  commandList.push(
    new SlashCommandBuilder()
      .setName(comando.name)
      .setDescription(comando.description);
  );
}

@Command
class Ping implements CommandProps {
  name: string;
  description: string;
  options?: string[] | undefined;
}
