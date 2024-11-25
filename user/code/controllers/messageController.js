import { JSONFilePreset } from "lowdb/node";
import { getResponseHandler } from "./responseHandler.js";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"titel": "Lijst van alle gebruikers & chats", "datum": "November 2024"}, gebruikers : [] };
const db = await JSONFilePreset('db.json', defaultData);
const chats = db.data.chats;

export async function createMessage(req, res) {
    // TODO; maak dit maandag
    let chatId = Number(req.query.chatId);
    let chat = chats.find(chat => chat.id = chatId);
    console.log("chat:", chat);
    if (chat) {
      let berichten = chat.berichten;
      let gebruikerId = Number(req.query.userId);
      // Check hoeveel berichten de chat met de opgegeven ID heeft, vervolgens pakt hij de ID van het laatste bericht en wordt er 1 bij toe gevoegt
      let id = berichten[berichten.length - 1].id + 1;
      console.log("id:", id);
      let tekst = req.query.text;
      let tijdstip = new Date().toLocaleString();
      if (id && gebruikerId && tekst && tijdstip) {
        let message = {id: id, gebruiker: gebruikerId, tekst: tekst, tijdstip: tijdstip};
        console.log("message:", message);
        berichten.push(message);
        console.log("berichten:", berichten);
        await db.write();
        res.status(200).send(`Dit bericht is toegevoegt: ${JSON.stringify(message)} aan chat ${chatId}`);
      } else {
        res.status(404).send('Bericht mist een parameter');
      }
    } else {
      res.status(404).send('Chat niet gevonden');
    }
  }