import { BotClient } from 'src/client/Client';
import { EventInterface } from 'src/@types/event';
import { Events } from 'discord.js';

export function EventDecorator<
  Key extends Events,
  T extends { new (): EventInterface<Key> },
>(target: T) {
  const event = new target();
  console.log(`Evento ${event.props.name} carregado!`);
  BotClient.getSingleton().registerEvent(event);
}
