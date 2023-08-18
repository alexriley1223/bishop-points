const { SlashCommandBuilder } = require("@discordjs/builders");
const Sequelize = require("sequelize");
const { announcementsChannelId } = require("@config/channels.json");
const sequelize = require("@database/database.js")(Sequelize);
const Vouchers = require("@models/vouchers.js")(sequelize, Sequelize.DataTypes);
const Points = require("@models/userPoints.js")(sequelize, Sequelize.DataTypes);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("redeem")
    .setDescription("Redeem a points voucher!")
    .addStringOption((option) =>
      option.setName("code").setDescription("Voucher code").setRequired(true)
    ),
  async execute(interaction) {
    const code = interaction.options.getString("code");
    let validCode = false;
    let addPoints = 0;

    // Find user record by id and set user points value
    await Vouchers.findOne({
      where: {
        code: code,
      },
    }).then(function (voucher) {
      if (voucher && !voucher.redeemed) {
        validCode = true;
        addPoints = voucher.amount;
      } else {
        interaction.reply({
          content: "Code is invalid or has already been redeemed.",
          ephemeral: true,
        });
      }
    });

    if (validCode) {
      const userPoints = 0;
      const user = await Points.findOne({ where: { user: interaction.user.id } });
      // Redeem Voucher
      await Vouchers.update({ redeemed: true }, { where: { code: code } });

      // Update points
      await user.increment("points", { by: addPoints });

      interaction.client.channels.cache
        .get(announcementsChannelId)
        .send(`<@${interaction.user.id}> just redeemed a voucher for ${addPoints} points!`);

      await interaction.reply({
        content: "You have redeemed a voucher for " + addPoints + " points!",
        ephemeral: true,
      });
    }
  },
};
