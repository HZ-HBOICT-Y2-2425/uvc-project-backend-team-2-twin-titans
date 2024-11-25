import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"titel": "Lijst van alle gebruikers & chats", "datum": "November 2024"}, gebruikers : [] };
const db = await JSONFilePreset('db.json', defaultData);
const gebruikers = db.data.gebruikers;
const chats = db.data.chats;

export async function getAllChats(req, res) {
  res.status(200).send(chats);
}

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
      res.status(201).send(`Dit bericht is toegevoegt: ${JSON.stringify(message)} aan chat ${chatId}`);
    } else {
      res.status(404).send('Bericht mist een parameter');
    }
  } else {
    res.status(404).send('Chat niet gevonden');
  }
}

export async function getChatByChatId(req, res) {
  let id = Number(req.params.id);
  let chat = chats.find(chat => chat.id == id);
  if (chat) {
    res.status(200).send(chat);
  } else {
    res.status(404).send('Chat niet gevonden');
  }
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

  if (idFound) {
    res.status(200).send(userChats);
  } else {
    res.status(404).send('Chat niet gevonden');
  }
}