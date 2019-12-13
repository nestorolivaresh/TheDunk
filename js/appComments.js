// Querying from markup
const search = document.querySelector(".search-bar");
const playerCard = document.querySelector(".player-card");
const curSeasonCard = document.querySelector(".current-season-card");
const lastSeasonCard = document.querySelector(".last-season-card");
const noInfo = "No information";

/* Fetching Data WITHOUT ASYNC / AWAIT
function getPlayer(player){
  let playerInfo;
  fetch(`https://www.balldontlie.io/api/v1/players?search=${player}`)
  .then(res => res.json())
  .then(info => {
    // Assigning data direct object to binding (variable) playerInfo
    playerInfo = info.data[0];
    // Returning fetch with url with next data to extract from API
    return fetch(`https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${playerInfo.id}`)
  })
  .then(res2 => res2.json())
  .then(stats19 => {
    // Assigning data direct object to binding (variable) currStats
    let currStats = stats19.data[0];
    // Again returning fetch with url to extract other different data
    return fetch(`https://www.balldontlie.io/api/v1/season_averages?season=2018&player_ids[]=${playerInfo.id}`)
  })
  .then(res3 => res3.json())
  .then(stats18 => {
    // Assigning data direct object to binding (variable) prevStats
    let prevStats = stats18.data[0];
  })

  .catch(err => console.log(err));
}
*/

// Fetching data from three differents urls using async await 
const getData = async (player) => {
  // Only fetch the data if theres a player value
  if(player){
  let info;
  try {
    const res1 = await fetch(`https://www.balldontlie.io/api/v1/players?search=${player}`);
    info = await res1.json();
    const res2 = await fetch(`https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${info.data[0].id}`);
    const stats2019 = await res2.json();
    const res3 = await fetch(`https://www.balldontlie.io/api/v1/season_averages?season=2018&player_ids[]=${info.data[0].id}`);
    const stats2018 = await res3.json();

    // returning an object with the three bindings wanted. Also, the data obtained wa destructured in order to get the direct object. If thees no data, that means there's no player
  return {
    playerInfo: info.data[0] || noInfo,
    currStats: stats2019.data[0] || noInfo,
    prevStats: stats2018.data[0] || noInfo
  }

  } catch (err) {
    console.error(err)
  }
}
}

let timeout;
// Adding the event listener 
search.addEventListener("keyup", async (e) =>{
  
  // Assigning the value of every letter we type on search
  let player = e.target.value;

  /* Creating a setting a timeout for the function thats gonna fetch the data. This is useful because we dont want to make a call to the api in order to extract the data everytime the user types a letter, this is not sustainable and it makes out application very slow and crashy. Also, eventually the application wont continue working because were making so many calls to the api every time were writing a letter.

  First, we check if theres a setTimeout call, because it needs to be cleaned. The reason it should be cleaned is because the setTimeout will continually calling the function that is fetching the data, and as said before that's not sustainable to our app. We need to check if theres a timeout set, if it is, clean it in order to not making a function call. */
  clearTimeout(timeout);
  // Checking if player (the input value) is not empty, in order to run our app
  if(player){
    
    // If the user typed into the input value, then were setting a timeout in order to call a function thats gonna make fetch the data 
    timeout = setTimeout(() => (showData(player)), 750);

    // if theres no text in the input, we dont show the divs that contains the info. This is essentially used when we found a player, then we delete the input, and we clear the HTML 
  } else {
    playerCard.style.display = "none";
    curSeasonCard.style.display = "none";
    lastSeasonCard.style.display = "none";
  }
 
  e.preventDefault();
})

// Function to display divs with information
const showData = async (player) => {
  // Only try to get the data into the data variable if player is an existing value
  if(player){
  try {
    // Storing the extracted data into the data variable
    let data = await getData(player);
    // passing the data to the showall function
    showAll(data);

    // Display 3 divs showing information
    playerCard.style.display = "block";
    curSeasonCard.style.display = "block";
    lastSeasonCard.style.display = "block";
  }
  catch (err){
    console.error(err);
  }
}
}

// Function to retrieve the data
showAll = (data) => { 
  console.log(data)
  // if data has a valid value
  if(data){
  // store currStats and prevStats data into the currStats and PrevStats variables only if they have a valid value
  if(data.currStats && data.prevStats){
  // Here the data is distructured and stored in bindings
  let currStats = data.currStats;
  let prevStats = data.prevStats;
  showStats(currStats, prevStats);
}
  // after getting the data, were calling the showPlayer function with the destructured data needed as a parameter
  showPlayer(data.playerInfo);
  // calling the showStats function ONLY IF the player has stats, if not, call shownotAv 
}
} 

const showPlayer = (playerInfo) => {
  // Showing the player info
    playerCard.innerHTML = `
    <div class="card-deck">
      <div class="card border-0">
        <div class="card-body bg-dark text-center">
          <h3 class="info-text info-text-title orange-txt">Name</h3>
           <h4 class="info-text text-light">${playerInfo.first_name} ${playerInfo.last_name}</h3>
        </div>
      </div>
      <div class="card border-0">
        <div class="card-body bg-dark text-center">
          <h3 class="info-text info-text-title orange-txt">Team</h3>
           <h4 class="info-text text-light">${playerInfo.team.full_name || noInfo}</h3>
        </div>
      </div>
      <div class="card border-0">
        <div class="card-body bg-dark text-center">
          <h3 class="info-text info-text-title orange-txt">Position</h3>
           <h4 class="info-text text-light">${playerInfo.position || noInfo}</h3>
        </div>
      </div>
    </div>
    `
}

const showStats = (currStats, prevStats) => {
  // console.log(currStats);
  // If currstats is valid, insert this into de currSeasonCard html
  if(currStats !== noInfo){
  curSeasonCard.innerHTML = `
  <div class="card border-0">
        <div class="card-body bg-dark text-center">
          <h1 class="display-1 text-light font-weight-normal">2019-2020 Stats</h1>
        </div>
      </div>
  <div class="row row-cols-5 row-cols-md-4">
      <div class="card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">Games Played</h3>
          <h4 class="text-light table-text-data">${currStats.games_played || noInfo}</h3>
        </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Minutes Played</h3>
            <h4 class="text-light table-text-data">${currStats.min || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">FG Made</h3>
            <h4 class="text-light table-text-data">${currStats.fgm || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">FG Attempted</h3>
            <h4 class="text-light table-text-data">${currStats.fga || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">3P Made</h3>
            <h4 class="text-light table-text-data">${currStats.fg3m || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">3P Attempted</h3>
            <h4 class="text-light table-text-data">${currStats.fg3a || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">FT Made</h3>
            <h4 class="text-light table-text-data">${currStats.ftm || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">FT Attempted</h3>
            <h4 class="text-light table-text-data">${currStats.fta || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Off Rebounds</h3>
            <h4 class="text-light table-text-data">${currStats.oreb || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Def Rebounds</h3>
            <h4 class="text-light table-text-data">${currStats.dreb || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Total Rebounds</h3>
            <h4 class="text-light table-text-data">${currStats.reb || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Assists</h3>
            <h4 class="text-light table-text-data">${currStats.ast || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Steals</h3>
            <h4 class="text-light table-text-data">${currStats.stl || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Blocks</h3>
            <h4 class="text-light table-text-data">${currStats.blk || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Turnovers</h3>
            <h4 class="text-light table-text-data">${currStats.turnover || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Fouls</h3>
            <h4 class="text-light table-text-data">${currStats.pf || noInfo}</h3>
          </div>
        </div>
      <div class="card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">Points</h3>
          <h4 class="text-light table-text-data">${currStats.pts || noInfo}</h3>
        </div>
      </div>
      <div class="card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">Field Goal %</h3>
          <h4 class="text-light table-text-data">${(currStats.fg_pct * 100).toFixed(2) || noInfo}</h3>
        </div>
      </div>
      <div class="card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">3 Point %</h3>
          <h4 class="text-light table-text-data">${(currStats.fg3_pct * 100).toFixed(2) || noInfo}</h3>
        </div>
      </div>
      <div class="card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">Free Throw %</h3>
          <h4 class="text-light table-text-data">${(currStats.ft_pct * 100).toFixed(2) || noInfo}</h3>
        </div>
      </div>
  </div>
  `;
} else {
  curSeasonCard.innerHTML = `
  <div class="card border-0">
    <div class="card-body bg-dark text-center">
      <h1 class="display-1 text-light font-weight-normal">No 2019-2020 Stats Available</h1>
    </div>
  </div>`;
}

// If currstats is valid, insert this into de lastSeasonCard html
if(prevStats !== noInfo){
  lastSeasonCard.innerHTML = `
  <div class="card border-0">
        <div class="card-body bg-dark text-center">
          <h1 class="display-1 text-light font-weight-normal">2018-2019 Stats</h1>
        </div>
      </div>
  <div class="row row-cols-5 row-cols-md-4 mb-4">
      <div class="card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">Games Played</h3>
          <h4 class="text-light table-text-data">${prevStats.games_played || noInfo}</h3>
        </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Minutes Played</h3>
            <h4 class="text-light table-text-data">${prevStats.min || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">FG Made</h3>
            <h4 class="text-light table-text-data">${prevStats.fgm || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">FG Attempted</h3>
            <h4 class="text-light table-text-data">${prevStats.fga || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">3P Made</h3>
            <h4 class="text-light table-text-data">${prevStats.fg3m || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">3P Attempted</h3>
            <h4 class="text-light table-text-data">${prevStats.fg3a || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">FT Made</h3>
            <h4 class="text-light table-text-data">${prevStats.ftm || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">FT Attempted</h3>
            <h4 class="text-light table-text-data">${prevStats.fta || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Off Rebounds</h3>
            <h4 class="text-light table-text-data">${prevStats.oreb || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Def Rebounds</h3>
            <h4 class="text-light table-text-data">${prevStats.dreb || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Total Rebounds</h3>
            <h4 class="text-light table-text-data">${prevStats.reb || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Assists</h3>
            <h4 class="text-light table-text-data">${prevStats.ast || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Steals</h3>
            <h4 class="text-light table-text-data">${prevStats.stl || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Blocks</h3>
            <h4 class="text-light table-text-data">${prevStats.blk || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Turnovers</h3>
            <h4 class="text-light table-text-data">${prevStats.turnover || noInfo}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Fouls</h3>
            <h4 class="text-light table-text-data">${prevStats.pf || noInfo}</h3>
          </div>
        </div>
      <div class="card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">Points</h3>
          <h4 class="text-light table-text-data">${prevStats.pts || noInfo}</h3>
        </div>
      </div>
      <div class="card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">Field Goal %</h3>
          <h4 class="text-light table-text-data">${(prevStats.fg_pct * 100).toFixed(2) || noInfo}</h3>
        </div>
      </div>
      <div class="card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">3 Point %</h3>
          <h4 class="text-light table-text-data">${(prevStats.fg3_pct * 100).toFixed(2) || noInfo}</h3>
        </div>
      </div>
      <div class="card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">Free Throw %</h3>
          <h4 class="text-light table-text-data">${(prevStats.ft_pct * 100).toFixed(2) || noInfo}</h3>
        </div>
      </div>
  </div>
  `;
} else {
  lastSeasonCard.innerHTML = `
  <div class="card border-0">
    <div class="card-body bg-dark text-center">
      <h1 class="display-1 text-light font-weight-normal">No 2018-2019 Stats Available</h1>
    </div>
  </div>`
}
}
