import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import { status } from "minecraft-server-util";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const SERVER_IP = "TON_IP_ICI";
const SERVER_PORT = 25565;

client.once("ready", async () => {
  console.log(`Connecté en tant que ${client.user.tag}`);

  const channel = await client.channels.fetch(CHANNEL_ID);

  async function updateStatus() {
    try {
      const response = await status(SERVER_IP, SERVER_PORT);

      const embed = new EmbedBuilder()
        .setTitle("🟢 Serveur Minecraft EN LIGNE")
        .addFields(
          { name: "👥 Joueurs", value: `${response.players.online}/${response.players.max}` },
          { name: "📦 Version", value: response.version.name }
        )
        .setColor("Green")
        .setTimestamp();

      await channel.send({ embeds: [embed] });

    } catch (err) {
      const embed = new EmbedBuilder()
        .setTitle("🔴 Serveur Minecraft HORS LIGNE")
        .setColor("Red")
        .setTimestamp();

      await channel.send({ embeds: [embed] });
    }
  }

  updateStatus();
  setInterval(updateStatus, 300000); // 5 minutes
});

client.login(TOKEN);