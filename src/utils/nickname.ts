import { CacheType, CommandInteraction, GuildMember } from 'discord.js';

export const getMemberNickname = (
  interaction: CommandInteraction<CacheType>,
) => {
  const member = interaction.guild?.members.cache.find(
    (m) => m.id === interaction.user.id,
  );

  if (!member) return 'N/A';

  return member.nickname?.split(']')[1];
};

export const splitNickNameRank = (member: GuildMember) => {
  if (!member) return;

  if (member.nickname) {
    return member.nickname.split(']')[1];
  } else {
    return member.displayName;
  }
};
