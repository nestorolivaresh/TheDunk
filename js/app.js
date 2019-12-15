const search = document.querySelector(".search-bar");
const playerCard = document.querySelector(".player-card");
const curSeasonCard = document.querySelector(".current-season-card");
const lastSeasonCard = document.querySelector(".last-season-card");
const noInfo = "No information";

const getData = async player => {
  if (player) {
    let info;
    try {
      const res1 = await fetch(
        `https://www.balldontlie.io/api/v1/players?search=${player}`
      );
      info = await res1.json();
      const res2 = await fetch(
        `https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${info.data[0].id}`
      );
      const stats2019 = await res2.json();
      const res3 = await fetch(
        `https://www.balldontlie.io/api/v1/season_averages?season=2018&player_ids[]=${info.data[0].id}`
      );
      const stats2018 = await res3.json();

      return {
        playerInfo: info.data[0] || noInfo,
        currStats: stats2019.data[0] || noInfo,
        prevStats: stats2018.data[0] || noInfo
      };
    } catch (err) {
      console.error(err);
    }
  }
};

let timeout;
// Adding the event listener
search.addEventListener("keyup", async e => {
  let player = e.target.value;

  clearTimeout(timeout);

  if (player) {
    timeout = setTimeout(() => showData(player), 750);
  } else {
    playerCard.style.display = "none";
    curSeasonCard.style.display = "none";
    lastSeasonCard.style.display = "none";
  }

  e.preventDefault();
});

const showData = async player => {
  if (player) {
    try {
      let data = await getData(player);

      showAll(data);

      playerCard.style.display = "block";
      curSeasonCard.style.display = "block";
      lastSeasonCard.style.display = "block";
    } catch (err) {
      console.error(err);
    }
  }
};

showAll = data => {
  console.log(data);

  if (data) {
    if (data.currStats && data.prevStats) {
      let currStats = data.currStats;
      let prevStats = data.prevStats;
      showStats(currStats, prevStats);
    }

    showPlayer(data.playerInfo);
  }
};

const showPlayer = playerInfo => {
  playerCard.innerHTML = `
    <div class="card-deck">
      <div class="card border-0">
        <div class="card-body info-card bg-dark text-center">
          <h3 class="info-text info-text-title orange-txt">Name</h3>
           <h4 class="info-text text-light">${playerInfo.first_name} ${
    playerInfo.last_name
  }</h3>
        </div>
      </div>
      <div class="card border-0">
        <div class="card-body info-card bg-dark text-center">
          <h3 class="info-text info-text-title orange-txt">Team</h3>
           <h4 class="info-text text-light">${playerInfo.team.full_name ||
             noInfo}</h3>
        </div>
      </div>
      <div class="card border-0">
        <div class="card-body info-card bg-dark text-center">
          <h3 class="info-text info-text-title orange-txt">Position</h3>
           <h4 class="info-text text-light">${playerInfo.position ||
             noInfo}</h3>
        </div>
      </div>
    </div>
    `;
};

const showStats = (currStats, prevStats) => {
  if (currStats !== noInfo) {
    curSeasonCard.innerHTML = `
  <div class="card border-0">
        <div class="card-body stats-body bg-dark text-center">
          <h1 class="stats-title display-1 text-light font-weight-normal">2019-2020 Stats</h1>
        </div>
      </div>
  <div class="row row-cols-md-4">
      <div class="card stats-card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">Games Played</h3>
          <h4 class="text-light table-text-data">${currStats.games_played ||
            noInfo}</h3>
        </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Minutes Played</h3>
            <h4 class="text-light table-text-data">${currStats.min ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">FG Made</h3>
            <h4 class="text-light table-text-data">${currStats.fgm ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">FG Attempted</h3>
            <h4 class="text-light table-text-data">${currStats.fga ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">3P Made</h3>
            <h4 class="text-light table-text-data">${currStats.fg3m ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">3P Attempted</h3>
            <h4 class="text-light table-text-data">${currStats.fg3a ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">FT Made</h3>
            <h4 class="text-light table-text-data">${currStats.ftm ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">FT Attempted</h3>
            <h4 class="text-light table-text-data">${currStats.fta ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Off Rebounds</h3>
            <h4 class="text-light table-text-data">${currStats.oreb ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Def Rebounds</h3>
            <h4 class="text-light table-text-data">${currStats.dreb ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Tot Rebounds</h3>
            <h4 class="text-light table-text-data">${currStats.reb ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Assists</h3>
            <h4 class="text-light table-text-data">${currStats.ast ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Steals</h3>
            <h4 class="text-light table-text-data">${currStats.stl ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Blocks</h3>
            <h4 class="text-light table-text-data">${currStats.blk ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Turnovers</h3>
            <h4 class="text-light table-text-data">${currStats.turnover ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Fouls</h3>
            <h4 class="text-light table-text-data">${currStats.pf ||
              noInfo}</h3>
          </div>
        </div>
      <div class="card stats-card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">Points</h3>
          <h4 class="text-light table-text-data">${currStats.pts || noInfo}</h3>
        </div>
      </div>
      <div class="card stats-card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">Field Goal %</h3>
          <h4 class="text-light table-text-data">${(
            currStats.fg_pct * 100
          ).toFixed(2) || noInfo}</h3>
        </div>
      </div>
      <div class="card stats-card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">3 Point %</h3>
          <h4 class="text-light table-text-data">${(
            currStats.fg3_pct * 100
          ).toFixed(2) || noInfo}</h3>
        </div>
      </div>
      <div class="card stats-card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">Free Throw %</h3>
          <h4 class="text-light table-text-data">${(
            currStats.ft_pct * 100
          ).toFixed(2) || noInfo}</h3>
        </div>
      </div>
  </div>
  `;
  } else {
    curSeasonCard.innerHTML = `
  <div class="card border-0">
    <div class="card-body bg-dark text-center">
      <h1 class="display-1 text-light font-weight-normal stats-title">No 2019-2020 Stats Available</h1>
    </div>
  </div>`;
  }

  if (prevStats !== noInfo) {
    lastSeasonCard.innerHTML = `
  <div class="card border-0">
        <div class="card-body stats-body bg-dark text-center">
          <h1 class="display-1 text-light font-weight-normal stats-title">2018-2019 Stats</h1>
        </div>
      </div>
  <div class="row row-cols-md-4 mb-4">
      <div class="card stats-card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">Games Played</h3>
          <h4 class="text-light table-text-data">${prevStats.games_played ||
            noInfo}</h3>
        </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Minutes Played</h3>
            <h4 class="text-light table-text-data">${prevStats.min ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">FG Made</h3>
            <h4 class="text-light table-text-data">${prevStats.fgm ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">FG Attempted</h3>
            <h4 class="text-light table-text-data">${prevStats.fga ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">3P Made</h3>
            <h4 class="text-light table-text-data">${prevStats.fg3m ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">3P Attempted</h3>
            <h4 class="text-light table-text-data">${prevStats.fg3a ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">FT Made</h3>
            <h4 class="text-light table-text-data">${prevStats.ftm ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">FT Attempted</h3>
            <h4 class="text-light table-text-data">${prevStats.fta ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Off Rebounds</h3>
            <h4 class="text-light table-text-data">${prevStats.oreb ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Def Rebounds</h3>
            <h4 class="text-light table-text-data">${prevStats.dreb ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Tot Rebounds</h3>
            <h4 class="text-light table-text-data">${prevStats.reb ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Assists</h3>
            <h4 class="text-light table-text-data">${prevStats.ast ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Steals</h3>
            <h4 class="text-light table-text-data">${prevStats.stl ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Blocks</h3>
            <h4 class="text-light table-text-data">${prevStats.blk ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Turnovers</h3>
            <h4 class="text-light table-text-data">${prevStats.turnover ||
              noInfo}</h3>
          </div>
        </div>
        <div class="card stats-card">
          <div class="card-body bg-dark text-center">
            <h3 class="table-text-title orange-txt">Fouls</h3>
            <h4 class="text-light table-text-data">${prevStats.pf ||
              noInfo}</h3>
          </div>
        </div>
      <div class="card stats-card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">Points</h3>
          <h4 class="text-light table-text-data">${prevStats.pts || noInfo}</h3>
        </div>
      </div>
      <div class="card stats-card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">Field Goal %</h3>
          <h4 class="text-light table-text-data">${(
            prevStats.fg_pct * 100
          ).toFixed(2) || noInfo}</h3>
        </div>
      </div>
      <div class="card stats-card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">3 Point %</h3>
          <h4 class="text-light table-text-data">${(
            prevStats.fg3_pct * 100
          ).toFixed(2) || noInfo}</h3>
        </div>
      </div>
      <div class="card stats-card">
        <div class="card-body bg-dark text-center">
          <h3 class="table-text-title orange-txt">Free Throw %</h3>
          <h4 class="text-light table-text-data">${(
            prevStats.ft_pct * 100
          ).toFixed(2) || noInfo}</h3>
        </div>
      </div>
  </div>
  `;
  } else {
    lastSeasonCard.innerHTML = `
  <div class="card border-0">
    <div class="card-body bg-dark text-center">
      <h1 class="display-1 text-light font-weight-normal stats-title">No 2018-2019 Stats Available</h1>
    </div>
  </div>`;
  }
};
