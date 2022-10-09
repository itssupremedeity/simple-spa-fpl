window.addEventListener("load", () => { 
  const options = {
      method: 'GET',                                                          
  };

  fetch(`https://fantasy.premierleague.com/api/leagues-classic/1982813/standings/?page_standings=1`, options)   
      .then(response => response.json())                                      
      .then(data => {
          const div = document.createElement('div');
          const div2 = document.createElement('div');
          div.appendChild(createElementWithContent('h2', data.league.name));
          div.appendChild(createElementWithContent('h3', "GAMEWEEK RESULTS"));
          div.appendChild(createListWithContent('ol', data.standings.results,'event_total'));
          div2.appendChild(createElementWithContent('h3', "OVERALL RESULTS"));
          div2.appendChild(createListWithContent('ol', data.standings.results, 'total'));
          document.getElementById('gameweek').replaceChildren(div);
          document.getElementById('overall').replaceChildren(div2);
      });    
        
      function createElementWithContent(type, content) {                                                      
          const el = document.createElement(type);
          el.innerHTML = content;
          return el;
      }
  
      function createListWithContent(type, list, description) {                                                  
          const el = document.createElement(type);
          let sortedList;
          if (description == 'event_total'){
            sortedList = list.sort(compareGameweekScores);
          }
          else{
            sortedList = list.sort(compareOverallScores);
          }
          sortedList.forEach(item => el.appendChild(createElementWithContent('li', item['player_name'] + " | " + 
          item[description])));
          return el;
      }

      function compareGameweekScores(a, b) {
        return b.event_total - a.event_total;
      } 
      
      function compareOverallScores(a, b) {
        return b.total - a.total;
      }  
});


