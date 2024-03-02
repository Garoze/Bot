import { ExtendedClient } from 'src/client';
import { CommandInterface } from '../@types/command';

export function CommandDecorator<T extends { new(): CommandInterface }>(
	target: T,
) {
	const comando = new target();
	console.log(`Comando ${comando.props.name} carregado!`);
	ExtendedClient.getSingleton().addCommand(comando.props);
}
