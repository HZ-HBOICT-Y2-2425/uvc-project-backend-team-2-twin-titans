/**
 * Handles get responses for a certain condition
 * @param {*} response How to respond
 * @param {*} condition Checks if this condition is met
 * @param {*} goodMessage If conditions is met, send the good message
 * @param {*} errorMessage If not send the error message
 */
export async function getResponseHandler(
    response,
    condition,
    goodMessage,
    errorMessage
) {
    if (condition) {
        goodResponse(response, goodMessage);
    } else {
        errorResponse(response, errorMessage);
    }
}

/**
 * Handles post responses for a certain condition
 * @param {*} response How to respond
 * @param {*} condition Checks if this condition is met
 * @param {*} goodMessage If conditions is met, send the good message
 * @param {*} errorMessage If not send the error message
 * @param {*} database The database to write to
 * @param {*} parentArray The parent array that gets a child object
 * @param {*} childObject The child object that is given to a parent array
 */
export async function postResponseHandler(response,
    condition,
    goodMessage,
    errorMessage,
    database,
    parentArray,
    childObject
) {
    if (condition) {
        writeToDatabase(database, parentArray, childObject)
        goodResponse(response, goodMessage);
    } else {
        errorResponse(response, errorMessage);
    }
}

function goodResponse(response, message) {
    response.status(200).send(message);
}

function errorResponse(response, message) {
    response.status(404).send(message);
}

async function writeToDatabase(database, parentArray, childObject) {
    parentArray.push(childObject);
    await database.write();
}