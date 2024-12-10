import { JSONFilePreset } from "lowdb/node";
import { getResponseHandler, getUniqueId } from "./helperFunctions.js";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"title": "List of all users & chats", "date": "November 2024"}, users : [] };
const db = await JSONFilePreset('db.json', defaultData);
const users = db.data.users;

export async function getShoppingCartByUserId(req, res) {
    let id = Number(req.params.id);
    let user = users.find(user => user.id === id);
    getResponseHandler(res, user, user.shoppingCart, 'Gebruiker niet gevonden');
}

export async function addToShoppingCart(req, res) {
    let userId = Number(req.params.id);
    let user = users.find(user => user.id === userId);
    if (user) {
        let id = getUniqueId(user.shoppingCart);
        let amount = req.query.amount;
        let name = req.query.name;
        let unit = req.query.unit;
        if (id && amount && name && unit) {
            let cartItem = {id: id, name: name, amount: amount, unit: unit}
            user.shoppingCart.push(cartItem);
            await db.write();
            res.status(200).send(user.shoppingCart);
        }
    } else {
        res.status(404).send('Gebruiker niet gevonden');
    }
}

export async function updateShoppingCartItem(req, res) {
    let userId = Number(req.params.id);
    let user = users.find(user => user.id === userId);
    if (user) {
        let id = Number(req.params.itemId);
        let item = user.shoppingCart.find(item => item.id === id)
        if (item) {
            let amount = req.query.amount;
            let name = req.query.name;
            let unit = req.query.unit;
            if (amount && name && unit) {
                item.id = id;
                item.amount = amount;
                item.name = name;
                item.unit = unit;
                await db.write();
                res.status(200).send(user.shoppingCart);
            } else {
                res.status(404).send('Item mist een parameter');
            }
        } else {
            res.status(404).send('Item niet gevonden');
        }
    } else {
        res.status(404).send('Gebruiker niet gevonden');
    }
}

export async function deleteItemInCart(req, res) {
    let userId = Number(req.params.id);
    let user = users.find(user => user.id === userId);
    if (user) {
        let id = Number(req.params.itemId);
        let itemIndex = user.shoppingCart.findIndex(item => item.id === id)
        if (itemIndex !== -1) {
            user.shoppingCart.splice(itemIndex, 1);
            await db.write();
            res.status(200).send(user.shoppingCart);
        } else {
            res.status(404).send('Item niet gevonden');
        }
    } else {
        res.status(404).send('Gebruiker niet gevonden');
    }
}