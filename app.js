const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const app = express();
app.use(express.json());
const sqlite3 = require("sqlite3");


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

app.get("/players/", async (request, response) => {
  const getPlayersSqlcode = `
    SELECT *
    FROM  cricket_team
    ORDER BY player_id;
   `;
  const finalOutputArray = await db.all(getPlayersSqlcode);
  let arr = [];
  for (let i of finalOutputArray) {
    arr.push(convertDbObjectToResponseObject(i));
  }
  response.send(arr);
});

