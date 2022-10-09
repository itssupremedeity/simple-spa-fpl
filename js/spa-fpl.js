window.addEventListener("load", () => { 
  const options = {
      method: 'GET',                                                          
  };

  const word = 'code';

  fetch(`https://fantasy.premierleague.com/api/leagues-classic/1982813/standings/?page_standings=1`, options)   
      .then(response => response.json())                                      
      .then(data => {
          const div = document.createElement('div')
          
          div.appendChild(createElementWithContent('h2', data.league.name));
          div.appendChild(createElementWithContent('h3', "GAMEWEEK RESULTS"));
          div.appendChild(createListWithContent('ol', data.standings.results));
          document.getElementById('app').replaceChildren(div);
      });    
        
      function createElementWithContent(type, content) {                                                      
          const el = document.createElement(type);
          el.innerHTML = content;
          return el;
      }
  
      function createListWithContent(type, list) {                                                  
          const el = document.createElement(type);
          const sortedList = list.sort(compareGameweekScores)
          sortedList.forEach(item => el.appendChild(createElementWithContent('li', item['entry_name'] + " | " + 
          item['event_total'])));
          return el;
      }

      function compareGameweekScores(a, b) {
        return b.event_total - a.event_total;
      }    
});


