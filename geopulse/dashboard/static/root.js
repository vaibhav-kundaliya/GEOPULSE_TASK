let cityPageNo = 1;
let talukaPageNo = 1;
let villagePageNo = 1;
let map;
let timeoutID;

const getValues = (nodeList) => {
    return Array.from(nodeList)
        .map((node) => node.value)
        .filter((value) => value);
};

const loadMoreCity = () => {
    const parentElement = document.getElementById("city_options");
    fetch(`${window.location.href}${cityPageNo}`)
        .then((response) => (response.ok ? response.json() : Promise.reject()))
        .then((jsonData) => {
            jsonData.cities.forEach((city) => {
                const newDiv = document.createElement("div");
                const newInput = document.createElement("input");
                newInput.type = "checkbox";
                newInput.name = "city";
                newInput.value = city;
                newInput.onchange = cityOnChange;
                const newLabel = document.createElement("label");
                newLabel.setAttribute("for", "city");
                newLabel.textContent = city;
                newDiv.appendChild(newInput);
                newDiv.appendChild(newLabel);
                parentElement.appendChild(newDiv);
            });
            cityPageNo++;
            document.getElementById("load_more_city").style.display =
                jsonData.has_next ? "block" : "none";
        })
        .catch(console.error);
};

const loadMoreTaluka = () => {
    const city = getValues(
        document.querySelectorAll('input[name="city"]:checked')
    );
    const parentElement = document.getElementById("taluka_options");
    fetch(`${window.location.href}${city.join()}/${talukaPageNo}`)
        .then((response) => (response.ok ? response.json() : Promise.reject()))
        .then((jsonData) => {
            jsonData.talukas.forEach((taluka) => {
                const newDiv = document.createElement("div");
                const newInput = document.createElement("input");
                newInput.type = "checkbox";
                newInput.name = "taluka";
                newInput.value = taluka;
                newInput.onchange = talukaOnChange;
                const newLabel = document.createElement("label");
                newLabel.setAttribute("for", "taluka");
                newLabel.textContent = taluka;
                newDiv.appendChild(newInput);
                newDiv.appendChild(newLabel);
                parentElement.appendChild(newDiv);
            });
            talukaPageNo++;
            document.getElementById("load_more_taluka").style.display =
                jsonData.has_next ? "block" : "none";
        })
        .catch(console.error);
};

const loadMoreVillage = () => {
    const city = getValues(
        document.querySelectorAll('input[name="city"]:checked')
    );
    const taluka = getValues(
        document.querySelectorAll('input[name="taluka"]:checked')
    );
    const parentElement = document.getElementById("village_options");
    fetch(
        `${
            window.location.href
        }${city.join()}/${taluka.join()}/${villagePageNo}`
    )
        .then((response) => (response.ok ? response.json() : Promise.reject()))
        .then((jsonData) => {
            jsonData.villages.forEach((village) => {
                const newDiv = document.createElement("div");
                const newInput = document.createElement("input");
                newInput.type = "checkbox";
                newInput.name = "village";
                newInput.value = village.CCODE;
                newInput.onchange = villageOnChange;
                const newLabel = document.createElement("label");
                newLabel.setAttribute("for", "village");
                newLabel.textContent = village.village;
                newDiv.appendChild(newInput);
                newDiv.appendChild(newLabel);
                parentElement.appendChild(newDiv);
            });
            villagePageNo++;
            document.getElementById("load_more_village").style.display =
                jsonData.has_next ? "block" : "none";
        })
        .catch(console.error);
};

const cityOnChange = () => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
        talukaPageNo = 1;
        document.getElementById("taluka_options").innerHTML = "";
        loadMoreTaluka();
        villagePageNo = 1;
        document.getElementById("village_options").innerHTML = "";
    }, 1000);
};

const talukaOnChange = () => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
        villagePageNo = 1;
        document.getElementById("village_options").innerHTML = "";
        loadMoreVillage();
    }, 1000);
};

const villageOnChange = (event) => {
    const ccode = event.target.value;
    fetch(`${window.location.href}get_cords/${ccode}`)
        .then((response) => response.json())
        .then((jsonData) => {
            const polygon = L.polygon(jsonData.coordinates, { color: "red" });
            if (event.target.checked) {
                polygon.addTo(map);
                map.fitBounds(polygon.getBounds());
            } else {
                console.log("erase");
                map.removeLayer(polygon);
            }
        })
        .catch(console.error);
};

const initializeMap = () => {
    const titleLink = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
    const attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    map = L.map("map", {
        center: [18.6833, 74.03],
        zoom: 9,
    });
    L.tileLayer(titleLink, {
        attribution: attribution,
    }).addTo(map);
};

window.onload = () => {
    loadMoreCity();
    initializeMap();
};

