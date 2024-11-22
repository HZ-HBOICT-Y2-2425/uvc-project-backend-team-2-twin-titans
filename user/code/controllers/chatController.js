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

export async function getChatById(req, res) {
  let id = req.params.id;
  let gebruiker = chats.find(gebruiker => gebruiker.id == id);
  if (gebruiker) {
    res.status(200).send(gebruiker);
  } else {
    res.status(404).send('Gebruiker niet gevonden');
  }
}
