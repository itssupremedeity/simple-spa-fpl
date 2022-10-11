window.addEventListener("load", () => {

  const form = document.getElementById("lookup-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(event.target);
    const word = data.get("word");

    const options = {
      method: 'GET',
    };

    fetch(`https://fantasy.premierleague.com/api/leagues-classic/1982813/standings/?page_standings=1`, options)
      .then(response => response.json())
      .then(data => {
        data = {
          leagueName: data.league.name,
          gameWeek: createListWithContent(data.standings.results, 'event_total'),
          overall: createListWithContent(data.standings.results, 'total'),
        };
        const template = document.getElementById('template').innerText;
        const compiledFunction = Handlebars.compile(template);
        document.getElementById('app').innerHTML = compiledFunction(data);
      });


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
  });
});


