import { BotClient } from 'src/client/Client';
import { EventInterface, EventKey } from 'src/@types/event';

export function EventDecorator<
  Key extends EventKey,
  T extends { new (): EventInterface<Key> },
>(target: T) {
  const event = new target();
  console.log(`Evento ${event.props.name} carregado!`);
  BotClient.getSingleton().registerEvent(event);
}
