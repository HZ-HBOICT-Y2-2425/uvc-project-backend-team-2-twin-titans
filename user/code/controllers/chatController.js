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

export async function createChat(req, res) {
  // TODO; maak dit maandag
  // let id = Number(req.query.id);
  // let naam = req.query.naam;
  // let email = req.query.email;
  // let postcode = req.query.postcode;
  // let co2bijdrage = Number(req.query.co2bijdrage);
  // if (id && naam && email && postcode && co2bijdrage) {
  //   let gebruiker = {id: id, naam: naam, email: email, postcode: postcode, co2bijdrage: co2bijdrage};
  //   chats.push(gebruiker);
  //   await db.write();
  //   res.status(201).send(`Deze gebruiker is toegevoegt: ${JSON.stringify(gebruiker)}`);
  // } else {
  //   res.status(404).send('Gebruiker mist een parameter');
  // }
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