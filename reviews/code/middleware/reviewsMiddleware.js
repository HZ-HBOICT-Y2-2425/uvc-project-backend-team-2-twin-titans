export async function checkBody(req, res, next){
    console.log(req.query);
    next();
}