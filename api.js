(function () {
    let apiKey = "at_XZkXC1c6HE26HC8KWwp8BRhtPxBzA";
    let form = document.querySelector(".form");

    let ipAddress = document.getElementById("ip-address");
    let location = document.getElementById("location");
    let timezone = document.getElementById("timezone");
    let isp = document.getElementById("isp");

    var myIcon = L.icon({
      iconUrl: "images/icon-location.svg",
      iconSize: [46, 56],
      iconAnchor: [23, 56],
      popupAnchor: [-3, -76],
    });

    var mymap = L.map("mapid").setView([51.505, -0.09], 13);
    var mapToken =
      "pk.eyJ1IjoibW9yc2FrYTkiLCJhIjoiY2trOXZmYjE0MGd0cDJzcGJueHd1MTZidCJ9.UJ5RlDnugIUNkhqsHEf3fw";
    L.tileLayer(
      `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapToken}`,
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "your.mapbox.access.token",
      }
    ).addTo(mymap);

    function isIPAddress(value) {
        let regIPv4 = /^[0-9]{1,3}(\.[0-9]{1,3}){3}$/;
        let regIPv6 = /^[0-9a-fA-F:]+$/;

        return regIPv4.test(value) || regIPv6.test(value);
    }

    async function getInfo(address) {
      if (isIPAddress(address)) {
        return await $.get(
          `https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${address}`
        );
      } else {
        return await $.get(
          `https://geo.ipify.org/api/v1?apiKey=${apiKey}&domain=${address}`
        );
      }
    }

    async function formSubmit(form) {
      let input = form["search-input"].value;
      let response;
      try {
        response = await getInfo(input); /* prikazy ktere mohou selhat - vyjimky*/
      } catch (ex) { /* odchytavame to co selhalo */
        console.log(ex);
        alert(ex.responseJSON.messages);
        return;
      }
      
      console.log(response);
      ipAddress.innerText = response.ip;
      location.innerText = `${response.location.city}, ${response.location.country} ${response.location.postalCode}`;
      timezone.innerText = `UTC ${response.location.timezone}`;
      isp.innerText = response.isp;
      mymap.setView([response.location.lat, response.location.lng], 13);
      L.marker([response.location.lat, response.location.lng], {
        icon: myIcon,
      }).addTo(mymap);
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      formSubmit(form);
    });

  })();