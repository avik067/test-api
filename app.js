const express = require("express");
const app = express();
app.use(express.json());



//////////////////////////////////////////////////////////
const listenAndinitializeDb = async () => {
  try {
    app.listen(3000, () => {
      console.log("Server is running ");
    });
  } catch (err) {
    console.log(`DB Error :${err.message}`);
    process.exit(1);
  }
};
listenAndinitializeDb();
/////////////////////////////////////////////////////////

// GET 1

app.get("", async (request, response) => {
  
  response.send("hi there 😊");
});

