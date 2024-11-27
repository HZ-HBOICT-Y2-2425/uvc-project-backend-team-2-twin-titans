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
  getResponseHandler(res, chat, chat.messages, 'Chat niet gevonden');
}

export async function createMessage(req, res) {
  let chatId = Number(req.params.id);
  let chat = chats.find(chat => chat.id === chatId);
  if (chat) {
    let messages = chat.messages;
    let userId = Number(req.query.userId);
    let chatUsers = chat.users; 
    if (chatUsers.lastIndexOf(userId) >= 0) {
      // Check hoeveel berichten de chat met de opgegeven ID heeft, vervolgens pakt hij de ID van het laatste bericht en wordt er 1 bij toe gevoegt
      let id = getUniqueId(messages);
      let text = req.query.text;
      let timestamp = new Date().toLocaleString();
      if (id && userId && text && timestamp) {
        let message = {id: id, user: userId, text: text, timestamp: timestamp};
        messages.push(message);
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