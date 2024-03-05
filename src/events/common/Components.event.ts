import { EventInterface, EventProps, EventTypes } from 'src/@types/event';
import { EventDecorator } from '../EventDecorator';
import { Events } from 'discord.js';
import { BotClient } from 'src/client/Client';

@EventDecorator
export class ComponentsEvent<Key extends Events>
  implements EventInterface<Key>
{
  props: EventProps = {
    name: Events.InteractionCreate,
  };

  execute(...[interaction]: EventTypes<'interactionCreate'>) {
    if (interaction.isStringSelectMenu()) {
      BotClient.getSingleton().selectsCollection.get(interaction.customId)?.(
        interaction,
      );
    }

    if (interaction.isModalSubmit()) {
      BotClient.getSingleton().modalsCollection.get(interaction.customId)?.(
        interaction,
      );
    }
  }
}
