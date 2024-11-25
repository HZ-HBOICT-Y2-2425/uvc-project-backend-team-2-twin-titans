import { JSONFilePreset } from "lowdb/node";
import { getResponseHandler } from "./responseHandler.js";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"titel": "Lijst van alle gebruikers & chats", "datum": "November 2024"}, gebruikers : [] };
const db = await JSONFilePreset('db.json', defaultData);
const chats = db.data.chats;

export async function getAllChats(req, res) {
  res.status(200).send(chats);
}

export async function createChat(req, res) {
  let id = chats[chats.length - 1].id + 1;
  let gebruiker1 = Number(req.query.user1);
  let gebruiker2 = Number(req.query.user2);
  if (gebruiker1 && gebruiker2) {
    let chat = {id: id, gebruikers: [gebruiker1, gebruiker2], berichten: []};
    chats.push(chat);
    await db.write();
    res.status(200).send(`Deze chat is toegevoegt: ${JSON.stringify(chat)}`);
  } else {
    res.status(404).send('Chat mist een parameter');
  }
}

export async function getChatByChatId(req, res) {
  let id = Number(req.params.id);
  let chat = chats.find(chat => chat.id == id);
  getResponseHandler(res, chat, chat, 'Chat niet gevonden');
}

export async function getChatByUserId(req, res) {
  let userId = Number(req.params.id);

  let userChats = [];
  let idFound = false;

  chats.forEach(chat => {
    // Elke chat heeft een array met de ID's van alle gebruikers die meedoen aan de chat.
    // Hier word er door elke van de indexes in de array geloopt om te kijken of die overeen komt met de opgegeven ID.
    // Als de opgegeven ID overkomt met de chat, wordt de chat toegevoegd aan de userChats variabele
    chat.gebruikers.forEach(gebruikerId => {
      if (gebruikerId === userId) {
        userChats.push(chat);
        idFound = true;
      }
    });
  });
  getResponseHandler(res, idFound, userChats, 'Chat niet gevonden');
}