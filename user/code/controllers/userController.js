import { JSONFilePreset } from "lowdb/node";
import { getResponseHandler } from "./responseHandler.js";

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
  if (naam && wachtwoord && email && postcode) {
    let gebruiker = {id: id, naam: naam, wachtwoord: wachtwoord, email: email, postcode: postcode, co2bijdrage: 0};
    gebruikers.push(gebruiker);
    await db.write();
    res.status(200).send(`Deze gebruiker is toegevoegt: ${JSON.stringify(gebruiker)}`);
  } else {
    res.status(404).send('Gebruiker mist een parameter');
  }
}

export async function getUserById(req, res) {
  let id = Number(req.params.id);
  let gebruiker = gebruikers.find(gebruiker => gebruiker.id === id);
  getResponseHandler(res, gebruiker, gebruiker, 'Gebruiker niet gevonden');
}

export async function login(req, res) {
  let userName = req.query.user;
  let password = req.query.password;
  let gebruiker = gebruikers.find(gebruiker => gebruiker.naam === userName);
  if (gebruiker === undefined) { gebruiker = gebruikers.find(gebruiker => gebruiker.email === userName); }
  if (gebruiker) {
    let condition = gebruiker.wachtwoord === password;
    getResponseHandler(res, condition, gebruiker, 'Wachtwoord is incorrect');
  } else {
    res.status(404).send('Gebruikersnaam niet gevonden');
  }
}