const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  credentials: true, // accesstoken dan refreshtoken, nanti untuk minggu depan
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionSuccessStatus: 200,
};

module.exports = corsOptions;
