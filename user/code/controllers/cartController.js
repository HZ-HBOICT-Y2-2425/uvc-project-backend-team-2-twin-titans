import { JSONFilePreset } from "lowdb/node";
import { getResponseHandler, getUniqueId } from "./helperFunctions.js";

// Database setup
const defaultData = { meta: { title: "List of all users & chats", date: "November 2024" }, users: [] };
const db = await JSONFilePreset('db.json', defaultData);
const users = db.data.users;

// Helper function
const findUserById = (id) => users.find(user => user.id === id);

// Haal winkelwagen op
export async function getShoppingCartByUserId(req, res) {
    const userId = Number(req.params.id);
    const user = findUserById(userId);

    if (!user) {
        return res.status(404).send('Gebruiker niet gevonden');
    }

    return res.status(200).send(user.shoppingCart || []);
}

// Voeg item toe aan winkelwagen
export async function addToShoppingCart(req, res) {
    const userId = Number(req.params.id);
    const user = findUserById(userId);

    if (!user) {
        return res.status(404).send('Gebruiker niet gevonden');
    }

    const { name, amount, unit } = req.body;

    if (!name || !amount || !unit || isNaN(amount)) {
        return res.status(400).send('Invalid data: name, amount, and unit are required. Amount must be a number.');
    }

    const cartItem = { id: getUniqueId(user.shoppingCart), name, amount, unit };
    user.shoppingCart.push(cartItem);

    try {
        await db.write();
        return res.status(200).send(user.shoppingCart);
    } catch (error) {
        console.error('Error saving shopping cart:', error);
        return res.status(500).send('Fout bij opslaan van winkelwagen');
    }
}

// Update winkelwagenitem
export async function updateShoppingCartItem(req, res) {
    const userId = Number(req.params.id);
    const itemId = Number(req.params.itemId);
    const user = findUserById(userId);

    if (!user) {
        return res.status(404).send('Gebruiker niet gevonden');
    }

    const item = user.shoppingCart.find(i => i.id === itemId);

    if (!item) {
        return res.status(404).send('Item niet gevonden');
    }

    const { name, amount, unit } = req.body;

    if (!name || !amount || !unit || isNaN(amount)) {
        return res.status(400).send('Invalid data: name, amount, and unit are required. Amount must be a number.');
    }

    item.name = name;
    item.amount = amount;
    item.unit = unit;

    try {
        await db.write();
        return res.status(200).send(user.shoppingCart);
    } catch (error) {
        console.error('Error updating shopping cart:', error);
        return res.status(500).send('Fout bij bijwerken van winkelwagen');
    }
}

// Verwijder item uit winkelwagen
export async function deleteItemInCart(req, res) {
    const userId = Number(req.params.id);
    const itemId = Number(req.params.itemId);
    const user = findUserById(userId);

    if (!user) {
        return res.status(404).send('Gebruiker niet gevonden');
    }

    const itemIndex = user.shoppingCart.findIndex(i => i.id === itemId);

    if (itemIndex === -1) {
        return res.status(404).send('Item niet gevonden');
    }

    user.shoppingCart.splice(itemIndex, 1);

    try {
        await db.write();
        return res.status(200).send(user.shoppingCart);
    } catch (error) {
        console.error('Error deleting item from shopping cart:', error);
        return res.status(500).send('Fout bij verwijderen van winkelwagenitem');
    }
}