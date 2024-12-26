const {ExtractJwt} = require("passport-jwt");
module.exports = {
    secretOrKey: "pixelIQ&Letsheat&maramHost.3",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    issuer: 'pixel-iq.com',
    audience: 'pixel-iq.com',
    session: false,
    expiresIn:'30d'
};
