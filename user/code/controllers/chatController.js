import { JSONFilePreset } from "lowdb/node";
import { getResponseHandler, getUniqueId } from "./helperFunctions.js";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"titel": "Lijst van alle gebruikers & chats", "datum": "November 2024"}, chats : [] };
const db = await JSONFilePreset('db.json', defaultData);
const chats = db.data.chats;

export async function getAllChats(req, res) {
  res.status(200).send(chats);
}

export async function createChat(req, res) {
  let id = getUniqueId(chats);
  let user1 = Number(req.query.user1);
  let user2 = Number(req.query.user2);
  if (user1 && user2) {
    let chat = {id: id, users: [user1, user2], messages: []};
    chats.push(chat);
    await db.write();
    res.status(200).send(`Deze chat is toegevoegt: ${JSON.stringify(chat)}`);
  } else {
    res.status(404).send('Chat mist een parameter');
  }
}

export async function getChatByChatId(req, res) {
  let id = Number(req.params.id);
  let chat = chats.find(chat => chat.id === id);
  getResponseHandler(res, chat, chat, 'Chat niet gevonden');
}

export async function getChatByUserId(req, res) {
  let userId = Number(req.params.id);
  let userChats = [];
  chats.forEach(chat => {
    // Elke chat heeft een array met de ID's van alle gebruikers die meedoen aan de chat.
    // Hier wordt er gekeken of de opgegeven user ID in deze array zit.
    // Als de opgegeven ID overkomt met de chat, wordt de chat toegevoegd aan de userChats variabele.
    if (chat.users.lastIndexOf(userId) >= 0) { userChats.push(chat); }
  });
  getResponseHandler(res, userChats.length > 0, userChats, 'Chat niet gevonden');
}