document.addEventListener("DOMContentLoaded", function(){

  var lat;
  var long;
  var url = 'http://localhost:3000';
  var map;
  var service;
  var inputVal;
  var infowindow;
  var resultsArray = [];
  var resultsArrayObj = [
    locationData = {
      name: "",
      formatted_address: "",
      rating: "",
      open_now: ""
    }
  ];

  var input = document.getElementById("input");
  var find = document.getElementById("find");
  var upInput = document.getElementById("upInput");
  var upArea = document.getElementById("upArea");
  var addCommentBtn = document.getElementById("addComment");
  var submitDataBtn = document.getElementById("submitData");
  var deleteSect = document.getElementById("delete-sect");
  var commentSect = document.getElementById("comment-sect");
  var maps = document.getElementById("map");
  var all = document.getElementById("all");
  var allContainer = document.getElementById("see-all");
  var delButton = document.getElementById("delete");
  var delInput = document.getElementById("delInput");
  var right = document.getElementById("right");
  var resultsToAppend = document.getElementById("results");
  var cardContainer = document.getElementById("cardContainer");
  var locationData = {
    name: "",
    formatted_address: "",
    rating: "",
    open_now: ""
  }


  console.log(cardContainer);

  console.log(right);

  hideAll();

  function hideMap(){
    maps.classList.add("hide");
    maps.classList.remove("show");
    results.classList.add("hide");
    results.classList.remove("show");
  }

  function showMap(){
    maps.classList.add("show");
    maps.classList.remove("hide");

  }

  function showAll(){
    allContainer.classList.add("show");
    allContainer.classList.remove("hide");

  }
  function hideAll(){
    allContainer.classList.add("hide");
    allContainer.classList.remove("show");
  

  }
  find.addEventListener("click", function(){
    showMap();

    inputVal = input.value;
    navigator.geolocation.getCurrentPosition(success, error, options);
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
  });

  //find lat and long and init
  function success(pos) {
    var crd = pos.coords;
    console.log('Your current position is:');
    console.log('Latitude : ' + crd.latitude);
    console.log('Longitude: ' + crd.longitude);
    console.log('More or less ' + crd.accuracy + ' meters.');
    lat = crd.latitude;
    long = crd.longitude;
    //init:
    initialize()
  };
  function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  };

  function initialize() {
    var currentLoc = new google.maps.LatLng(lat, long);
    map = new google.maps.Map(document.getElementById('map'), {
      center: currentLoc,
      zoom: 15
    });

    var request = {
      location: currentLoc,
      radius: '50',
      query: inputVal
    };
    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
  }
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        for(var key in results[i]){
          var res = results[i];
          var card = document.createElement('div');
          card.id = "card-id";
          switch (key) {
            case "name":
              locationData.name = res[key];
              resultsArray.push(res[key]);
              break;
            case "formatted_address":
              locationData.formatted_address = res[key];
              break;
            case "opening_hours":
              locationData.opening_hours = res[key].open_now;
              break;
          case "rating":
            locationData.rating= res[key];
            break;
          default:
            break;
          } //end switch
        } //end for in
        console.log(locationData);

        console.log(resultsArray);

        var place = results[i];
        console.log(place);
        createMarker(results[i]);
      } //end reg loop
      console.log(resultsArray, "resAr");
      displayResults(resultsArray);

    } //end if
  }

  console.log("RA", resultsArray);

  function createMarker(place) {
    console.log("RA", resultsArray);

    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });
    infowindow = new google.maps.InfoWindow({
      content: ""
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name + "<button type='button' id='add'>Save This!!! <3</button>");
      // infowindow.setContent(place.vicinity);
      infowindow.open(map, this);
      document.getElementById("add").addEventListener("click", function(){
        console.log("add was pressed");
        var location = {
          name: place.name,
          address: place.formatted_address,
          opening_hours: place.opening_hours.open_now,
          rating: place.rating
        }
        console.log("location", location);
        $.ajax({
          url: url + '/locations/',
          dataType: 'json',
          data: location,
          method: 'post'
        }).done(function(response){
            console.log(response);
        }); // end ajax
      })
    });
  }

  all.addEventListener("click", function(){
    hideMap();
    showAll();
    console.log("all was clicked");
    $.ajax({
      url: url + '/locations',
      dataType: 'json'
    }).done(function(response){
        console.log(response);
        display(response);
    }); // end ajax
  })

  function display(response){
    for(var i = 0; i < response.length; i++){
      var card = document.createElement('div');
      var con = document.getElementById("allC");
      for(var key in response[i]){
        console.log(key);
        var res = response[i];
        var p = document.createElement('p');
        p.innerText = res[key];
        card.appendChild(p);
        console.log(res[key]);
        allC.appendChild(card);
      }
    }
  }


  function displayResults(resultsArray){
    console.log(resultsArray, "in fx");
    for(var i = 0; i < resultsArray.length; i++){
        var card = document.createElement('div');
        var p = document.createElement('p');
        var button = document.createElement("button");
        button.id = "addToFavs";
        button.innerText = "Add To Favs <3"
        p.innerText = resultsArray[i];
        card.appendChild(p);
        card.appendChild(button);
        cardContainer.appendChild(card);
        var val = resultsArray[i];
        pass(val);
      }
      function pass(val){
        button.addEventListener("click", function(){
          var name = val;
          var data = {
            name: val
          }
          console.log(name);
          $.ajax({
            url: url + '/locations/',
            dataType: 'json',
            data: data,
            method: 'post'
          }).done(function(response){
              console.log(response);
          }); // end ajax

        })
      }

    }



  delButton.addEventListener("click", function(){
    console.log("delButton pressed");
    var delVal = delInput.value;
    console.log(delVal);
     var data = {
       name: delVal
     };
     $.ajax({
       url: url + '/locations/' + delVal,
       dataType: 'json',
       data: data,
       method: 'delete'
      }).done(function(response){
         console.log(delVal + " has been deleted.");
         console.log(response);
      }); // end ajax
    }); //end of delButton

  addCommentBtn.addEventListener("click", function(){
    console.log("addCom pressed");
    var upInputVal = upInput.value;
    console.log(upInputVal);
    var upAreaVal = upArea.value;
    console.log(upAreaVal);
    var data = {
      name: upInputVal,
      comment: upAreaVal
    };
    $.ajax({
       url: url + '/locations/' + upInputVal,
       dataType: 'json',
       method: 'put',
       data: data
     }).done(function(response){
          console.log(response);
    }); // end ajax
  });//end add button
});
