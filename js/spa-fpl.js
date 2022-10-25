function findLeagueData () {
  const form = document.getElementById("leagueID");

  //1982813
  //http://0.0.0.0:5050/?id=1982813&submit=Submit

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(event.target);
    const leagueID = data.get("id");
    
    document.getElementById('app').innerHTML = `<p>Finding league data...</p>`;

    const options = {
      method: 'GET',
    };

    fetch(`https://fantasy.premierleague.com/api/leagues-classic/${leagueID}/standings/?page_standings=1`, options)
      .then(response => response.json())
      .then(data => {
        data = {
          leagueName: data.league.name,
          gameWeek: createListWithContent(data.standings.results, 'event_total'),
          overall: createListWithContent(data.standings.results, 'total'),
        };
        const template = document.getElementById('leagueTemplate').innerText;
        const compiledFunction = Handlebars.compile(template);
        document.getElementById('app').innerHTML = compiledFunction(data);
      });
  });
}

function findPlayerData() {
  const playerID = document.getElementById("playerID").innerText;
  const playerName = document.getElementById("playerName").innerText;

  //1982813
  //http://0.0.0.0:5050/?id=1982813&submit=Submit


  fetch(`https://fantasy.premierleague.com/api/entry/${playerID}/history/`, options)
    .then(response => response.json())
    .then(data => {
      data = {
        playerName: playerName,
        gameWeekPoints: data.current[current.length -1].points,
        overallPoints: data.current[current.length -1].total_points,
        overallRank: data.current[current.length -1].overall_rank,
        pointsOnBench: data.current[current.length -1].points_on_bench,
      };
      const template = document.getElementById('playerTemplate').innerText;
      const compiledFunction = Handlebars.compile(template);
      document.getElementById('app').innerHTML = compiledFunction(data);
    });
}



function createListWithContent(list, description) {
  const el = [];
  let sortedList;
  if (description == 'event_total') {
    sortedList = list.sort(compareGameweekScores);
  }
  else {
    sortedList = list.sort(compareOverallScores);
  }
  sortedList.forEach(item => el.push({ playerName: item['player_name'], playerScore: item[description] }));
  return el;
}

function compareGameweekScores(a, b) {
  return b.event_total - a.event_total;
}

function compareOverallScores(a, b) {
  return b.total - a.total;
}

window.addEventListener('load', () => {
  const app = $('#app');

  const defaultTemplate = Handlebars.compile($('#defaultTemplate').html());
  const dictionaryTemplate = Handlebars.compile($('#playerTemplate').html());

  const router = new Router({
    mode:'history',
    root:'index.html',
    page404: (path) => {
      const html = defaultTemplate();
      app.html(html);
      findLeagueData();
    }
  });

  router.add('/#/player-data', async () => {
    html = dictionaryTemplate();
    app.html(html);
    findPlayerData();
  });

  router.addUriListener();

  $('a').on('click', (event) => {
    event.preventDefault();
    const target = $(event.target);
    const href = target.attr('href');
    const path = href.substring(href.lastIndexOf('/'));
    router.navigateTo(path);
  });

  router.navigateTo('/');
});

