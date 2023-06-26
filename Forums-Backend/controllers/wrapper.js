const wrapper = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            console.error(err);
            if (err.message.startsWith("Credential Error:")) {
                res.status(401);
                res.json({
                    msg: "Provided credentials do not match",
                });
            } else if (err.message.startsWith("Not Found Error:")) {
                res.status(404);
                res.json({
                    msg: "Requested data not found",
                });
            } else if (err.message.startsWith("Bad Request Error:")) {
                res.status(400);
                res.json({
                    msg: "Please provided all of the requested information in the correct format",
                });
            } else {
                res.status(500);
                res.json({
                    msg: "There has been an error, please try again later",
                });
            }
        }
    };
};

export { wrapper };