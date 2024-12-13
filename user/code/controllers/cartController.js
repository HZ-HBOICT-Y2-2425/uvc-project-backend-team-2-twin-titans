import { JSONFilePreset } from "lowdb/node";
import { getResponseHandler, postResponseHandler, getUniqueId } from "./helperFunctions.js";

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

    const condition = !!user; // Check of de gebruiker bestaat
    const goodMessage = user?.shoppingCart || [];
    const errorMessage = 'Gebruiker niet gevonden';

    await getResponseHandler(res, condition, goodMessage, errorMessage);
}

// Voeg item toe aan winkelwagen
export async function addToShoppingCart(req, res) {
    const userId = Number(req.params.id);
    const user = findUserById(userId);

    if (!user) {
        return errorResponse(res, 'Gebruiker niet gevonden');
    }

    const { name, amount, unit } = req.body;

    if (!name || !amount || !unit || isNaN(amount)) {
        return errorResponse(res, 'Invalid data: name, amount, and unit are required. Amount must be a number.');
    }

    const cartItem = { id: getUniqueId(user.shoppingCart), name, amount, unit };
    const condition = true; // We voegen altijd toe als we hier zijn
    const goodMessage = user.shoppingCart;
    const errorMessage = 'Fout bij opslaan van winkelwagen';

    await postResponseHandler(res, condition, goodMessage, errorMessage, db, user.shoppingCart, cartItem);
}

// Update winkelwagenitem
export async function updateShoppingCartItem(req, res) {
    const userId = Number(req.params.id);
    const itemId = Number(req.params.itemId);
    const user = findUserById(userId);

    if (!user) {
        return errorResponse(res, 'Gebruiker niet gevonden');
    }

    const item = user.shoppingCart.find(i => i.id === itemId);

    if (!item) {
        return errorResponse(res, 'Item niet gevonden');
    }

    const { name, amount, unit } = req.body;

    if (!name || !amount || !unit || isNaN(amount)) {
        return errorResponse(res, 'Invalid data: name, amount, and unit are required. Amount must be a number.');
    }

    item.name = name;
    item.amount = amount;
    item.unit = unit;

    try {
        await db.write();
        return goodResponse(res, user.shoppingCart);
    } catch (error) {
        console.error('Error updating shopping cart:', error);
        return errorResponse(res, 'Fout bij bijwerken van winkelwagen');
    }
}

// Verwijder item uit winkelwagen
export async function deleteItemInCart(req, res) {
    const userId = Number(req.params.id);
    const itemId = Number(req.params.itemId);
    const user = findUserById(userId);

    if (!user) {
        return errorResponse(res, 'Gebruiker niet gevonden');
    }

    const itemIndex = user.shoppingCart.findIndex(i => i.id === itemId);

    if (itemIndex === -1) {
        return errorResponse(res, 'Item niet gevonden');
    }

    user.shoppingCart.splice(itemIndex, 1);

    try {
        await db.write();
        return goodResponse(res, user.shoppingCart);
    } catch (error) {
        console.error('Error deleting item from shopping cart:', error);
        return errorResponse(res, 'Fout bij verwijderen van winkelwagenitem');
    }
}
