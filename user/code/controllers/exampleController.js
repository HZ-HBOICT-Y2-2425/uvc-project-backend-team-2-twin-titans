import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"titel": "Lijst van alle gebruikers", "datum": "November 2024"}, gebruikers : [] };
const db = await JSONFilePreset('db.json', defaultData);
const gebruikers = db.data.gebruikers;

export async function getAllUsers(req, res) {
  res.status(200).send(gebruikers);
}

export async function createUser(req, res) {
  let id = req.query.id;
  let naam = req.query.naam;
  let time = new Date().toLocaleString();
  let gebruiker = {id: id, naam: naam};
  gebruikers.push(gebruiker);
  await db.write();

  res.status(201).send(`I added this client: ${JSON.stringify(animal)}?`);
}

export async function getUserById(req, res) {
  let id = req.params.id;
  console.log(id);
  let gebruiker = gebruikers.find(gebruiker => gebruiker.id == id);
  console.log(gebruiker);
  if (gebruiker) {
    res.status(200).send(gebruiker);
  } else {
    res.status(404).send('Gebruiker niet gevonden');
  }
}
