import { BotClient } from 'src/client/Client';
import { CommandInterface } from '../@types/command';

export function CommandDecorator<T extends { new (): CommandInterface }>(
  target: T,
) {
  const comando = new target();
  console.log(`Comando ${comando.props.name} carregado!`);
  BotClient.getSingleton().addCommand(comando);
}
