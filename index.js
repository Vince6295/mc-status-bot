import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import { status } from "minecraft-server-util";

// ----------------------
// VARIABLES D'ENVIRONNEMENT
// ----------------------
const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

// ----------------------
// DEBUG TEMPORAIRE
// ----------------------
console.log("TOKEN:", TOKEN ? "OK" : "VIDE");
console.log("CHANNEL_ID:", CHANNEL_ID ? "OK" : "VIDE");

// ----------------------
// CONFIGURATION DU BOT
// ----------------------
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ----------------------
// INFOS DU SERVEUR MINECRAFT
// ----------------------
const SERVER_IP = "TON_IP_ICI"; // Exemple: play.tonserveur.fr
const SERVER_PORT = 25565;      // Port Minecraft

// ----------------------
// FONCTION DE MISE À JOUR
// ----------------------
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

    const channel = await client.channels.fetch(CHANNEL_ID);
    await channel.send({ embeds: [embed] });

  } catch (err) {
    const embed = new EmbedBuilder()
      .setTitle("🔴 Serveur Minecraft HORS LIGNE")
      .setColor("Red")
      .setTimestamp();

    const channel = await client.channels.fetch(CHANNEL_ID);
    await channel.send({ embeds: [embed] });
  }
}

// ----------------------
// LANCEMENT DU BOT
// ----------------------
client.once("ready", async () => {
  console.log(`Connecté en tant que ${client.user.tag}`);

  // Premier envoi
  await updateStatus();

  // Mettre à jour toutes les 5 minutes
  setInterval(updateStatus, 300000); // 300000ms = 5 minutes
});

// ----------------------
// LOGIN
// ----------------------
client.login(TOKEN);
