require("dotenv").config();

const required = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    ` Missing required environment variable(s): ${missing.join(", ")}`
  );
  console.error(" Check .env again and fill in the missing values.");
  process.exit(1);
}

module.exports = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV ,

  databaseUrl: process.env.DATABASE_URL,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,

  clientUrl: process.env.CLIENT_URL,
};