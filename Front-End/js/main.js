var tripData = [];
var currentTrip = {};
var page = 1;
const perPage = 10;
var map = null; 

$(document).ready(function () {
  loadTripData();

  $("#trips-table tbody").on("click", "tr", function () {
    let clickedRow = $(this).attr("data-id");

    currentTrip = tripData.message.find(({ _id }) => _id == clickedRow);
    let duration = (`${currentTrip.tripduration}` / 60).toFixed(2);

    $(".modal-title").html(
      `<b>Trip Details (Bike: bikeid),</b> where <b>bikeid</b> is the value of = ${currentTrip.bikeid} for the <b>current trip</b>`
    );

    $("#map-details").html(
      `<b>Start Location: </b>
      ${currentTrip["start station name"]}<br>
        <b>End Location: </b>
        ${currentTrip["end station name"]}<br>
        <b>Duration: </b>
        ${duration} Minutes`
    );

    $("#trip-modal").modal({
      // show the modal programmatically
      backdrop: "static", // disable clicking on the backdrop to close
      keyboard: false, // disable using the keyboard to close
    });
  });
  $("#previous-page").on("click", function () {
    if (page > 1) {
      page--;
      loadTripData();
    }
  });
  $("#next-page").on("click", function () {
      page++;
      loadTripData();
  });

  $('#trip-modal').on('shown.bs.modal', function () {
    map = new L.Map('leaflet', {     
      layers: [         
        new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')     
      ] 
    });  

    let start = L.marker([currentTrip["start station location"].coordinates[1], currentTrip["start station location"].coordinates[0]]) 
    .bindTooltip(currentTrip["start station name"],     
      {         
        permanent: true,         
        direction: 'right'     
      }).addTo(map);  
      
      let end = L.marker([currentTrip["end station location"].coordinates[1], currentTrip["end station location"].coordinates[0]]) 
      .bindTooltip(currentTrip["end station name"],     
        {         
          permanent: true,         
          direction: 'right'     
        }).addTo(map);  
        
        var group = new L.featureGroup([start, end]);  
        
        map.fitBounds(group.getBounds(), { padding: [60, 60] }); 
  }); 

  $('#trip-modal').on('hidden.bs.modal', function () {
    map.remove();
  });
});

const tableRows = _.template(
  ` <% _.forEach(trip.message, function(trip) { %>
            <tr data-id=<%- trip._id %> class=<%- trip.usertype %>>
                <td><%- trip.bikeid %></td>     
                <td><%- trip["start station name"] %></td>     
                <td><%- trip["end station name"]%></td>     
                <td><%- (trip.tripduration  / 60).toFixed(2) %></td> 
            </tr>
        <% }); %>`
);

//)({ students: ["Rahul", "Rohit"] });

function loadTripData() {
  fetch(
    `https://mighty-garden-03764.herokuapp.com/api/trips?page=${page}&perPage=${perPage}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      tripData = data;
      $("#trips-table tbody").html(tableRows({ trip: data }));
      $("#current-page").html(page);
    })
    .catch((err) => {
      console.log(err);
    });
}
