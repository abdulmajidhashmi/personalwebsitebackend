const cookie = require('cookie');
const jwt = require('jsonwebtoken');

const verifyUser = async (socket, next) => {


    try {

        const rawCookie = socket.handshake.headers.cookie;
        if (!rawCookie) {

            next(new Error("No cookie found"));
        }

        const cookies = cookie.parse(rawCookie);
        const token = cookies.authToken;
        if (!token) {
            return next(new Error("Auth token missing"));
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        socket.user = decoded;
        next();

    } catch (err) {


        console.log(err);
        next(new Error(err));
    }


}

module.exports =verifyUser;