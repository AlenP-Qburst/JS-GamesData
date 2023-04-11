const BASE_URL = 'https://alenp-qburst.github.io/JS-GamesData';
let gameChart;


var section1 = document.getElementById("gameList");
var section2 = document.getElementById("gridList");
let noDataFound = document.getElementById("noResults");
noDataFound.style.display = "none";

function myGridFunction() {
  section1.style.display = "none";
  section2.style.display = "block";
  gridView.classList.add("mystyle");
  listView.classList.remove("mystyle");
}
function myListFunction() {
  section2.style.display = "none";
  section1.style.display = "table";
  listView.classList.add("mystyle");
  gridView.classList.remove("mystyle");
}

function fetchGameList() {
  fetch(`${BASE_URL}/data.json`)
    .then((res) => res.json())
    .then((data) => {
      data.forEach(function (item) {
        item.data.forEach(function (data) {
          let output = "";
          let tableRef = document
            .getElementById("gameList")
            .getElementsByTagName("tbody")[0];
          const isoString = data.updatedAt;
          const date = new Date(isoString);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();

          let newRow = tableRef.insertRow(tableRef.rows.length);

          let tagList = '';
          data.tags.forEach((tag, index) => {
            tagList += '<span>' + tag + '</span>';
          });

          output += `
                  <tr class="btnPrepend">
                    <td><img class="thumbnail" src="${data.img}" alt=""></td>
                    <td class="title-row"><h4 class="title" data-id="${data.id}" >${data.title}</h4></td>
                    <td class="graphTagList">${tagList}</td>
                    <td>${day+'-' + month + '-'+year}</td>
                    <td><input type="checkbox" checked="${data.is_active}"></td>
                  </tr>
                `;
          newRow.innerHTML = output;
          let output1 = "";
          let tableRef1 = document
            .getElementById("card");
          output1 = `
                  <div class="cardWrapper">
                    <img class="thumbnail" src="${data.img}" alt="">
                          <h4 data-id="${data.id}" class="title-row">${data.title}</h4> 
                          <p class="graphTagList">${tagList}</p> 
                          <p>Modified:  ${ day+'-' + month + '-'+year}</p>
                          <input type="checkbox" checked="${data.is_active}">
                  <div>
                `;
          tableRef1.innerHTML += output1;

        });
      });
    })
    .catch((error) => {
      console.log(`Error Fetching data : ${error}`);
      document.getElementById("gameList").innerHTML = "Error Loading Data";
      document.getElementById("gridList").innerHTML = "Error Loading Data";
    });
}

function getDetails(target) {
  if (typeof gameChart !== "undefined") {
    gameChart.destroy();
  }
  fetch(`${BASE_URL}/data.json`)
    .then((res) => res.json())
    .then((data) => {
      data.forEach(function (item) {
        datas = item.data;
        //let index = datas.findIndex( x => x.id === target );

        var field = datas.filter(function (x) {
          return x.id === Number(target);
        })[0];
        var index = datas.indexOf(field);
        document.getElementById("header").innerHTML = datas[index].title;


        let details = "";
        let detailSection = document
          .getElementById("gameDetail");
        detailSection.innerHTML = "";
        let tagList = '';
        datas[index].tags.forEach((tag, index) => {
          tagList += '<span>' + tag + '</span>';
        });
        const isoString1 = datas[index].updatedAt;
          const date1 = new Date(isoString1);
          const year1 = date1.getFullYear();
          const month1 = date1.getMonth() + 1;
        const day1 = date1.getDate();
        const isoString2 = datas[index].updatedAt;
          const date2 = new Date(isoString2);
          const year2 = date2.getFullYear();
          const month2 = date2.getMonth() + 1;
          const day2 = date2.getDate();
        details = `
                    <div class="detailWrapper">
                      <img class="thumbnail" src="${datas[index].img}" alt="">
                      <div class="block">
                        <div class="blockWrap">
                          <div class="blk">
                            <div class="left-blk">
                              <div>
                                <span class="label-txt">Last Modified:</span>
                                <span>${day1+'-' + month1 + '-'+year1}</span>
                              </div>
                              <div>
                                <span class="label-txt">Created At:</span>
                                <span>${day2+'-' + month2 + '-'+year2}</span>
                              </div>
                            </div>
                            <div class="graphTagList">
                                ${tagList}
                            </div>
                          </div>
                          <div class="right-blk">
                          <span><input type="checkbox" checked="${datas[index].is_active}"></span>
                          </div>
                        </div>
                        <p>${datas[index].description}</p>
                      </div>
                    <div>
                  `;
        detailSection.innerHTML += details;

        document.getElementById("selectByMonth").setAttribute("data-code", datas[index].code);



        plotGraph(datas[index].code, 12);




      });
      const box = document.getElementsByClassName('dashboard')[0];
      box.style.display = 'none';
      const detailbox = document.getElementsByClassName('detail-box')[0];
      detailbox.style.display = 'block';

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    })
}

document.querySelector("#tableBody").addEventListener("click", function (event) {
  var target = event.target;

  // Check if the clicked element's parent or ancestor matches the selector for the h4 element
  if (target.matches("#tableBody tr .title") || target.parentNode.matches("#tableBody tr .title")) {
    let codeVal = target.getAttribute("data-id");
    getDetails(codeVal);
  }
});

document.querySelector("#card").addEventListener("click", function (event) {
  var target = event.target;

  // Check if the clicked element's parent or ancestor matches the selector for the h4 element
  if (target.matches("#card .cardWrapper .title-row") || target.parentNode.matches("#card .cardWrapper .title-row")) {
    console.log(target);
    let codeVal = target.getAttribute("data-id");
    getDetails(codeVal);
  }
});



document.getElementById("selectByMonth").addEventListener("change", function () {
  var code = this.getAttribute("data-code");
  var selectedValue = this.value;
  gameChart.destroy();
  plotGraph(code, selectedValue)
});



function plotGraph(code, num) {
  var YearDataSet = [];

  // Session Graph

  let monthName = new Array("Jan", "Feb", "March", "April", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec");

  let d = new Date();
  let monthSet = [];
  let current_year = d.getFullYear();
  let prev_year = d.getFullYear() - 1;
  d.setDate(1);
  for (i = 0; i <= 11; i++) {

    //let monthSet = monthName[d.getMonth()] + ' ' + d.getFullYear()
    monthSet.push(monthName[d.getMonth()] + '-' + d.getFullYear());

    d.setMonth(d.getMonth() - 1);
  }

  monthSet = monthSet.reverse();

  if (num < 12) {
    numSplice = 12 - num;
    monthSet = monthSet.splice(numSplice);
  }

  fetch(`${BASE_URL}/count.json`)
    .then((res) => res.json())
    .then((data) => {
      data.forEach(function (res) {
        res.data.forEach(function (item) {

          if (item.game_code == code) {
            YearDataSet.push(item.session_count_details);

            const years = [current_year.toString(), prev_year.toString()];


            let yearFilter = Object.keys(YearDataSet[0])
              .filter(key => years.includes(key))
              .reduce((obj, key) => {
                obj[key] = YearDataSet[0][key];
                return obj;
              }, {});
            //console.log(yearFilter[current_year.toString()])



            currentFilter = yearFilter[current_year.toString()];
            prevFilter = yearFilter[prev_year.toString()];

            let currentYearFilter = currentFilter.map(object => object.current_user_session_count);
            let prevYearFilter = prevFilter.map(object => object.current_user_session_count);
            let MonthLeft = 0;



            if (num >= d.getMonth() + 1) {
              MonthLeft = num - d.getMonth() - 1;
            }

            const fillCurrentMonth = new Array(MonthLeft).fill(0);
            currentYearFilter = [...fillCurrentMonth, ...currentYearFilter];

            let monthCount = d.getMonth() + 1;
            if (num > monthCount) {
              monthCount = num - monthCount;
              monthCount = 12 - monthCount;
            } else if (num <= monthCount) {
              monthCount = 12;
            }

            prevYearFilter = prevYearFilter.splice(monthCount);



            let ctx = document.getElementById("gameGraph").getContext('2d');




            gameChart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: monthSet,
                datasets: [{
                    label: 'Current Year', // Name the series
                    data: currentYearFilter, // Specify the data values array
                    fill: true,
                    borderColor: 'hsla(300, 54%, 78%, 1)', // Add custom color border (Line)
                    backgroundColor: 'hsla(300, 54%, 78%, .5)', // Add custom color background (Points and Fill)
                    borderWidth: 1 // Specify bar border width
                  },
                  {
                    label: 'Previous Year', // Name the series
                    data: prevYearFilter, // Specify the data values array
                    fill: true,
                    borderColor: 'hsla(122, 39%, 49%, 1)', // Add custom color border (Line)
                    backgroundColor: 'hsla(122, 39%, 49%, .5)', // Add custom color background (Points and Fill)
                    borderWidth: 1 // Specify bar border width
                  }
                ]
              },
              options: {
                responsive: false, // Instruct chart js to respond nicely.
                maintainAspectRatio: true, // Add to prevent default behaviour of full-width/height 
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    fontColor: 'blue', // change font color
                    fontStyle: 'bold', // change font style
                    fontSize: 10, // change font size
                  }
                }]
              }
            });
          }
        });
      });
    })
    .catch((error) => {
      console.log(`Error Fetching data : ${error}`);
      document.getElementById("gridList").innerHTML = "Error Loading Data";
    });
}

function backToDashboard() {
  document.getElementById("header").innerHTML = "Game Center";
  const box = document.getElementsByClassName('dashboard')[0];
  box.style.display = 'block';
  const detailbox = document.getElementsByClassName('detail-box')[0];
  detailbox.style.display = 'none';
}

function gridGameList() {
  fetch(`${BASE_URL}/data.json`)
    .then((res) => res.json())
    .then((data) => {
      data.forEach(function (item) {
        item.data.forEach(function (data) {
          let output1 = "";
          let tableRef1 = document
            .getElementById("card");
          output1 = `
                  <div>
                    <img class="thumbnail" src="${data.img}" alt="">
                    <div class="container">
                          <h4><b>${data.title}</b></h4> 
                          data.tags.forEach(function(tag) {
                            <p>${tag}</p> 
                          });
                    </div>
                  <div>
                `;
          tableRef1.innerHTML += output1;

        });
      });
    })
    .catch((error) => {
      console.log(`Error Fetching data : ${error}`);
      document.getElementById("gridList").innerHTML = "Error Loading Data";
    });
}

function fetchTopList() {
  fetch(`${BASE_URL}/stats.json`)
    .then((res) => res.json())
    .then((data) => {
      let topPlayed = "";
      let topSession = "";
      let topColor = "";
      data.forEach(function (item) {
        let topPlayedList = item.data.topPlayed
          .sort((a, b) => a.current_rank - b.current_rank)
          .slice(0, 3);
        topPlayedList.forEach(function (data) {
          topPlayed += `
                    <li>
                        <span>${data.title}</span>
                        <span>${data.percentage}%</span>
                        <span>${data.count} plays</span>
                    </li>
                `;
        });
        new Chart("myChart", {
          type: "doughnut",
          options: {
            elements: {
              customCutout: true
            },
            tooltips: {
              enabled: false
            },
            hover: {
              mode: null
            },
            cutoutPercentage: 60,
            responsive: true
          },
          data: {
            labels: [],
            datasets: [{
              backgroundColor: ["#495C83", "#7A86B6", "#C8B6E2"],
              data: topPlayedList.map((game) => game.percentage),
            }]
          }
        });
        document.getElementById("topPlayed").innerHTML += topPlayed;

        let topSessionList = item.data.topSession
          .sort((a, b) => a.current_rank - b.current_rank)
          .slice(0, 3);
        topSessionList.forEach(function (data) {
          topSession += `
                <li>
                    <span>${data.player_name}</span>
                    <span>${data.percentage}%</span>
                    <span>${data.hours} hrs</span>
                </li>
                `;
        });
        new Chart("myChartSec", {
          type: "doughnut",
          options: {
            elements: {
              customCutout: true
            },
            tooltips: {
              enabled: false
            },
            hover: {
              mode: null
            },
            cutoutPercentage: 60
          },
          data: {
            labels: [],
            datasets: [{
              backgroundColor: ["#495C83", "#7A86B6", "#C8B6E2"],
              data: topSessionList.map((game) => game.percentage),
            }]
          }
        });
      });
      document.getElementById("topSession").innerHTML += topSession;
    })
    .catch((error) => {
      console.log(`Error Fetching data : ${error}`);
      document.getElementById("topPlayed").innerHTML = "Error Loading Data";
    });
}

fetchGameList();
fetchTopList();
// gridGameList();


/*Search*/

function searchTable() {
  // Get the search term and table
  let input, filter, table, tr;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("gameList");
  
  
  // Get all the table rows except the header
  tr = table.getElementsByTagName("tr");
  tr = Array.from(tr).slice(1);


    // Filter the rows based on the search term
    tr = tr.filter(function(row) {
      let cells = row.getElementsByTagName("td");
      for (let i = 0; i < cells.length; i++) {
        let cellText = cells[i].textContent || cells[i].innerText;
        if (cellText.toUpperCase().indexOf(filter) > -1) {
          return true;
        }
      }
      return false;
    });
    
    // Show/hide the rows based on the filter results
    for (let i = 0; i < tr.length; i++) {
      if (tr[i]) {
        tr[i].style.display = "";
      }
    }
    for (let i = 0; i < table.rows.length; i++) {
      if (!tr.includes(table.rows[i])) {
        table.rows[i].style.display = "none";
      }
    }
    // Message when search fails
  let noDataFound = document.getElementById("noResults");
  let tabledata = document.getElementById("gameList");
  let viewHeight = document.getElementsByClassName("global-width")
    if (tr.length === 0) {
      noDataFound.style.display = "";
      tabledata.style.display = "none";
      // viewHeight.style.height = "100vh";
    } else {
      noDataFound.style.display = "none";
      tabledata.style.display = "block"
  }
  }
  
