var count = 0
var runStatus = 0 // 0: start 1:run
var leftTime = 0
const countTime = 60
var sportsID = 0
var sportsStorage
var sportsDB = TAFFY([])
var curUser = "Other"
const users = [
  "William",
  "Mom",
  "Dad",
  "Other"
];

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/js/sw.js')
    .then(() => { console.log('Service Worker Registered'); });
}

$(function () {
  // load user
  curUser = localStorage.getItem("user") || "Other"
  $("#pagetitle").html("<i class='fa-solid fa-medal'></i>Sit Up For " + curUser)
  $("#user").val(curUser)
  localStorage.setItem("user", curUser)


  // load DB
  // sportsStorage = localStorage.getItem("sports")
  //   ? JSON.parse(localStorage.getItem("sports"))
  //   : []

  // console.log(sportsStorage)
  // sportsDB = TAFFY(sportsStorage)
  // sportsID = sportsDB({ second: countTime }).order("situp desc").first().situp
  // if (sportsID === undefined) {
  //   sportsID = 0
  // }

  // refresh data
  loadData(curUser)
})

$("#user").on('change', function () {
  curUser = $(this).find(":selected").val();
  $("#pagetitle").text("Sit Up For " + curUser)
  localStorage.setItem("user", curUser)
  loadData(curUser)
});

$(".circlebutton").on("click", function () {
  if (runStatus == 0) {
    runStatus = 1
    sportsID++
    leftTime = countTime
    count = 0
    $("#count").text(0)
    $(".circlebutton").text(leftTime)
    saveData(curUser, sportsID, leftTime, count, false)

    var set = setInterval(function () {
      leftTime--
      $(".circlebutton").text(leftTime)
      if (leftTime === 0) {
        saveData(curUser, sportsID, leftTime, count, true)
        clearInterval(set)
        runStatus = 0
        leftTime = countTime
        count = 0
        refresh()
        $(".circlebutton").html('<i class="fa-solid fa-play"></i>')

        //sleep 5 second
        $(".circlebutton").prop('disabled', true)
        let saveFinish = () => $(".circlebutton").prop('disabled', false)
        let sleep = (time) => new Promise((resolve) => {
          setTimeout(resolve, time)
        })
        sleep(5000).then(saveFinish);
      } else if (leftTime % 5 === 0) {
        saveData(curUser, sportsID, leftTime, count, false)
      }
    }, 100)
  } else {
    count++
    $("#count").text(count)
    //var item = { situp: sportsID, second: leftTime, count: count, date: new Date() }
    //sportsDB.insert(item)
    //refresh()
  }
})

function loadData(userID) {
  var settings = {
    "url": "https://getpantry.cloud/apiv1/pantry/39bfbe30-77b8-4315-a495-6dbef01d1607/basket/sports",
    "method": "GET",
    "timeout": 0,
  };

  $.ajax(settings).done(function (response) {
    var sportsData = response[userID] || []
    console.log(sportsData);

    sportsDB = TAFFY(sportsData)
    sportsID = sportsDB({ second: countTime }).order("situp desc").first().situp
    if (sportsID === undefined) {
      sportsID = 0
    }
    console.log("sportsID:"+sportsID);
    refresh()
  });
}

function saveData(userID, id, nowLeftTime, nowCount, saveDB) {
  var item = {
    situp: id,
    second: countTime - nowLeftTime,
    count: nowCount,
    date: new Date(),
  }
  sportsDB.insert(item)
  console.log(item)

  // if (saveDB) {
  //   localStorage.setItem("sports", sportsDB().stringify());
  //   console.log("save DB")
  // }
  if (saveDB) {
    var settings = {
      "url": "https://getpantry.cloud/apiv1/pantry/39bfbe30-77b8-4315-a495-6dbef01d1607/basket/sports",
      "method": "PUT",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        [userID]: sportsDB().stringify()
      }),
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
    });
  }
}

function refresh() {
  $("#record").html("")
  sum = 0;
  totalcount = 0;
  chartDatset = []

  sportsDB({ second: countTime })
    .order("count desc")
    .each(function (r, index) {
      if (index < 3 || r.situp === sportsID) {
        row =
          "<tr><td>" +
          (index + 1) +
          "</td><td>" +
          r.situp +
          "</td><td>" +
          r.count +
          "</td><td>" +
          new Date(r.date).toLocaleString() +
          "</td></tr>"
        $("#record").append(row)

        items = sportsDB({ situp: r.situp }).order("second").select("count");
        if (r.situp === sportsID) {
          chartDatset.push(
            {
              label: 'Current',
              data: items,
              fill: true,
              borderColor: CHART_COLORS.red,
              backgroundColor: CHART_TRANS_COLORS.red,
              tension: 0.4
            }
          )
        } else {
          chartDatset.push(
            {
              label: 'Top' + (index + 1),
              data: items,
              fill: false,
              borderColor: NAMED_COLORS[index + 2],
              backgroundColor: NAMED_TRANS_COLORS[index + 2],
              tension: 0.4
            }
          )
        }

      }
      sum += r.count
      totalcount += 1
    })

  row =
    "<tr id='avg'><td colspan=2>Total times:   " + totalcount + "</td><td colspan=2>Avg Count:   " +
    Math.round(sum * 10 / totalcount) / 10 +
    "</td></tr>"
  $("#record").append(row)
  console.log(chartDatset)

  showChart(chartDatset)
}
