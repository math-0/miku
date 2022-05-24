const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "Toutes les commandes du bot.",
  usage: "[Commande]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["commande", "commandes", "cmd"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let Commands = client.commands.map(
      (cmd) =>
        `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
          cmd.name
        }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
    );

    let Embed = new MessageEmbed()
      .setAuthor(
        `Commandes de ${client.user.username}`,
        client.user.displayAvatarURL({
          dynamic: true,
        })
      )
      .setColor(client.botconfig.EmbedColor)
      .setFooter(
        `Pour avoir des infos sur une commande ➜ ${
          GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
        }help [Commande]`
      ).setDescription(`${Commands.join("\n")}
  
  **${client.user.username}**: v${require("../package.json").version}
  [✨ Server support](https://discord.gg/Uh8Dc3KT2h) | By [Math](https://github.com/esu-01)`);
    if (!args[0]) message.channel.send(Embed);
    else {
      let cmd =
        client.commands.get(args[0]) ||
        client.commands.find((x) => x.aliases && x.aliases.includes(args[0]));
      if (!cmd)
        return client.sendTime(
          message.channel,
          `❌ | Impossible de trouver la commande.`
        );

      let embed = new MessageEmbed()
        .setAuthor(`Commande: ${cmd.name}`, 
        client.user.displayAvatarURL({
          dynamic: true,
        }))
        .setDescription(cmd.description)
        .setColor("GREEN")
        //.addField("Name", cmd.name, true)
        .addField("Aliases", `\`${cmd.aliases.join(", ")}\``, true)
        .addField(
          "Utilisation",
          `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\``,
          true
        )
        .addField(
          "Permissions",
          "Membre: " +
            cmd.permissions.member.join(", ") +
            "\nBot: " +
            cmd.permissions.channel.join(", "),
          true
        )
        .setFooter(
          `Prefix - ${
            GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
          }`
        );

      message.channel.send(embed);
    }
  },

  
};
