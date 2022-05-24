const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "disconnect",
  description: "Stop la musique et fait quitter le vocal au bot.",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["leave", "exit", "quit", "dc", "stop"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Vous devez être dans un salon vocal pour utiliser cette commande.**"
      );
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Rien n'est joué en ce moment...**"
      );
    await client.sendTime(message.channel, ":notes: | **Déconnecter !**");
    await message.react("✅");
    player.destroy();
  },

  
};
