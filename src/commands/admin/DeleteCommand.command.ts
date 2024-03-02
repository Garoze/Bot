import {
  CommandInterface,
  CommandProps,
  CommandType,
} from 'src/@types/command';
import { CommandDecorator } from '../CommandDecorator';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  PermissionsBitField,
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

    await interaction.deferReply({ ephemeral: true });
    const commandID = interaction.options.get('command-id', true).value;

    if (
      !interaction.memberPermissions?.has(
        PermissionsBitField.Flags.Administrator,
      )
    ) {
      return interaction.reply({ content: 'You can not use this command.' });
    }

    if (!commandID) {
      return interaction.reply({ content: 'Could not find the command id.' });
    }
    const rest = new REST().setToken(process.env.BOT_TOKEN);

    rest
      .delete(
        Routes.applicationGuildCommand(
          process.env.CLIENT_ID as string,
          process.env.GUILD_ID as string,
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
