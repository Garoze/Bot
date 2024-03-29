import { CommandInteractionOptionResolver, Events } from 'discord.js';
import { EventDecorator } from '../EventDecorator';
import { EventInterface, EventProps, EventTypes } from 'src/@types/event';

@EventDecorator
export class InteractionCreateEvent<Key extends Events>
  implements EventInterface<Key>
{
  props: EventProps = {
    name: Events.InteractionCreate,
  };

  async execute(
    ...[interaction]: EventTypes<Events.InteractionCreate>
  ): Promise<any> {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commandCollection.get(
      interaction.commandName,
    );

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }
    try {
      await command.execute({
        interaction,
        options: interaction.options as CommandInteractionOptionResolver,
      });
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    }
  }
}
