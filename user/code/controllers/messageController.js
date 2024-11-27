import { JSONFilePreset } from "lowdb/node";
import { getResponseHandler, getUniqueId } from "./helperFunctions.js";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"titel": "Lijst van alle gebruikers & chats", "datum": "November 2024"}, gebruikers : [] };
const db = await JSONFilePreset('db.json', defaultData);
const chats = db.data.chats;

export async function getAllMessagesByChatId(req, res) {
  let id = Number(req.params.id);
  let chat = chats.find(chat => chat.id === id);
  getResponseHandler(res, chat, chat.berichten, 'Chat niet gevonden');
}

export async function createMessage(req, res) {
  let chatId = Number(req.params.id);
  let chat = chats.find(chat => chat.id === chatId);
  if (chat) {
    let berichten = chat.berichten;
    let gebruikerId = Number(req.query.userId);
    let chatGebruikers = chat.gebruikers; 
    if (chatGebruikers.lastIndexOf(gebruikerId) >= 0) {
      // Check hoeveel berichten de chat met de opgegeven ID heeft, vervolgens pakt hij de ID van het laatste bericht en wordt er 1 bij toe gevoegt
      let id = getUniqueId(berichten);
      let tekst = req.query.text;
      let tijdstip = new Date().toLocaleString();
      if (id && gebruikerId && tekst && tijdstip) {
        let message = {id: id, gebruiker: gebruikerId, tekst: tekst, tijdstip: tijdstip};
        berichten.push(message);
        await db.write();
        res.status(200).send(`Dit bericht is toegevoegt: ${JSON.stringify(message)} aan chat ${chatId}`);
      } else {
        res.status(404).send('Bericht mist een parameter');
      }
    } else {
      res.status(404).send('Opgegeven gebruiker niet gevonden in de chat');
    }
  } else {
    res.status(404).send('Chat niet gevonden');
  }
}