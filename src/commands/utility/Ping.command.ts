import { CommandInterface, CommandProps } from 'src/@types/command';
import { CommandDecorator } from '../CommandDecorator';

@CommandDecorator
export class Ping implements CommandInterface {
	props = {
		name: 'ping',
		description: 'Pong!',
		options: [],
	};

	run(props: CommandProps) {
		props.interaction.reply('Pong!');
	}
}

