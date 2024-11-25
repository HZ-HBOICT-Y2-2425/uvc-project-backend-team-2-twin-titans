import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"titel": "Lijst van alle gebruikers & chats", "datum": "November 2024"}, gebruikers : [] };
const db = await JSONFilePreset('db.json', defaultData);
const gebruikers = db.data.gebruikers;

export async function getAllUsers(req, res) {
  res.status(200).send(gebruikers);
}

export async function createUser(req, res) {
  let id = gebruikers[gebruikers.length - 1].id + 1;
  let naam = req.query.name;
  let wachtwoord = req.query.password;
  let email = req.query.email;
  let postcode = req.query.zipcode;
  let co2bijdrage = Number(req.query.co2Contribution);
  if (naam && wachtwoord && email && postcode && co2bijdrage) {
    let gebruiker = {id: id, naam: naam, wachtwoord: wachtwoord, email: email, postcode: postcode, co2bijdrage: co2bijdrage};
    gebruikers.push(gebruiker);
    await db.write();
    res.status(201).send(`Deze gebruiker is toegevoegt: ${JSON.stringify(gebruiker)}`);
  } else {
    res.status(404).send('Gebruiker mist een parameter');
  }
}

export async function getUserById(req, res) {
  let id = req.params.id;
  let gebruiker = gebruikers.find(gebruiker => gebruiker.id == id);
  if (gebruiker) {
    res.status(200).send(gebruiker);
  } else {
    res.status(404).send('Gebruiker niet gevonden');
  }
}
