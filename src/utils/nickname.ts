import { CacheType, CommandInteraction } from 'discord.js';

export const getMemberNickname = (
  interaction: CommandInteraction<CacheType>,
) => {
  const member = interaction.guild?.members.cache.find(
    (m) => m.id === interaction.user.id,
  );

  if (!member) return 'N/A';

  return member.nickname?.split(']')[1];
};
