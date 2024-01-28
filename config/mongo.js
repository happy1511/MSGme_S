const { default: mongoose } = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
      dbName: process.env.MONGO_DB_NAME,
    });
    console.log("Connect successfully!!!");
  } catch (error) {
    console.log("Connect failure!!!");
  }
}

connect();
