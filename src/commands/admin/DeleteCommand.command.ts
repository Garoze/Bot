import {
  CommandInterface,
  CommandProps,
  CommandType,
} from 'src/@types/command';
import { CommandDecorator } from '../CommandDecorator';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  REST,
  Routes,
} from 'discord.js';

@CommandDecorator
export class DeleteCommand implements CommandInterface {
  props: CommandType = {
    name: 'delete',
    description: 'deletes a command from discord guild',
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: 'command-id',
        description: 'The command id to be deleted',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  };

  async execute({ interaction }: CommandProps) {
    if (!interaction.isChatInputCommand()) return;

    const commandID = interaction.options.get('command-id', true).value;

    await interaction.deferReply({ ephemeral: true });

    if (interaction.user.id !== '348557198676459520') {
      return interaction.reply({ content: 'You can not use this command.' });
    }

    if (!commandID) {
      return interaction.reply({ content: 'Could not find the command id.' });
    }

    const rest = new REST().setToken(process.env.BOT_TOKEN);

    rest
      .delete(
        Routes.applicationGuildCommand(
          process.env.CLIENT_ID,
          process.env.GUILD_ID,
          `${commandID}`,
        ),
      )
      .then(() => {
        interaction.editReply({
          content: 'Successfully deleted guild command',
        });
      })
      .catch((err) => console.log(err));
  }
}
