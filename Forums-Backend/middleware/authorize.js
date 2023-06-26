import jwt from "jsonwebtoken";

import { User } from "../models/user-model.js";

async function authorizeUser(req, res, next) {
    try {
        const authHeader = req.authorization.split(" ");
        if (authHeader[0] !== "Bearer") {
            throw new Error("Does not match required scheme");
        }
        const token = authHeader[1];
        const decodedClient = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedClient.id;
        const dbUser = await User.findOne({ _id: id });
        if (!dbUser) {
            throw new Error(
                "Credential Error: No matching database user found"
            );
        }
        req.userId = decodedClient.id;
        req.role = decodedClient.role;
        next();
    } catch (err) {
        console.error(err);
        res.status(500);
        res.json({
            msg: "There has been an error, please try again later",
        });
    }
}

export { authorizeUser };