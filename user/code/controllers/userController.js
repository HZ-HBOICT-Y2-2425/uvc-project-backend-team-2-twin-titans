import { JSONFilePreset } from "lowdb/node";
import { getResponseHandler, getUniqueId } from "./helperFunctions.js";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"title": "List of all users & chats", "date": "November 2024"}, users : [] };
const db = await JSONFilePreset('db.json', defaultData);
const users = db.data.users;

export async function getAllUsers(req, res) {
  res.status(200).send(users);
}

export async function createUser(req, res) {
  let id = getUniqueId(users);
  let name = req.query.name;
  let password = req.query.password;
  let email = req.query.email;
  let zipcode = req.query.zipcode;
  if (name && password && email && zipcode) {
    let user = {id: id, name: name, password: password, email: email, zipcode: zipcode, co2Contribution: 0};
    users.push(user);
    await db.write();
    res.status(200).send(`Deze gebruiker is toegevoegt: ${JSON.stringify(user)}`);
  } else {
    res.status(404).send('Gebruiker mist een parameter');
  }
}

export async function updateCo2ByUserId(req, res) {
  let id = Number(req.params.id);
  let co2 = Number(req.query.co2);
  let user = users.find(user => user.id === id);
  if (user) {
    user.co2Contribution += co2;
    await db.write();
    res.status(200).send(`Deze gebruiker is verandert: ${JSON.stringify(user)}`);
  } else {
    res.status(404).send('Gebruiker niet gevonden');
  }
}

export async function getUserById(req, res) {
  let id = Number(req.params.id);
  let user = users.find(user => user.id === id);
  getResponseHandler(res, user, user, 'Gebruiker niet gevonden');
}

export async function login(req, res) {
  let userName = req.query.user;
  let password = req.query.password;
  let user = users.find(user => user.name === userName);
  if (user === undefined) { user = users.find(user => user.email === userName); }
  if (user) {
    getResponseHandler(res, user.password === password, user, 'Wachtwoord is incorrect');
  } else {
    res.status(404).send('Gebruikersnaam niet gevonden');
  }
}