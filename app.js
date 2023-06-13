const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const app = express();
app.use(express.json());
const sqlite3 = require("sqlite3");

let db = null;

const dbPath = path.join(__dirname, "cricketTeam.db");

//////////////////////////////////////////////////////////
const listenAndinitializeDb = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("Server is running at  : http://localhost:3000/");
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

// ADD POST

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const addPlayer = `
    INSERT INTO
        cricket_team (player_name,jersey_number,role)
    VALUES (
       '${playerName}',
       '${jerseyNumber}',
       '${role}'
    );
   `;
  const responseDb = await db.run(addPlayer);
  const playerId = responseDb.lastID;
  //response.send({ playerId: playerId });
  response.send("Player Added to Team");
});

// GET  data of player on playerId

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const fetchQuery = ` SELECT * FROM cricket_team WHERE player_id = ${playerId} ;`;
  const finalOutputArray = await db.get(fetchQuery);
  response.send(convertDbObjectToResponseObject(finalOutputArray));
});

// PUT new data

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const addPlayer = `
    UPDATE 
        cricket_team 
    SET 
      player_name =  '${playerName}',
      jersey_number = '${jerseyNumber}',
      role = '${role}'
    WHERE 
      player_id = '${playerId}'
    ;
   `;
  const responseDb = await db.run(addPlayer);
  //const newplayerId = responseDb.lastID;
  //response.send({ playerId: newplayerId });
  response.send("Player Details Updated");
});

//DELETE player on playerid

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const deletePlayer = `
    DELETE FROM 
        cricket_team 
    WHERE 
      player_id = '${playerId}'
    ;
   `;
  const responseDb = await db.run(deletePlayer);
  response.send("Player Removed");
});

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

module.exports = listenAndinitializeDb;
