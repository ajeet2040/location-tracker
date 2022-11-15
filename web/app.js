// Constants
// TODO Capture from environment varaibles
let geonamesBaseUrl = 'http://api.geonames.org'
let geonamesApiUsername = 'dimagi'
let saveLocationBaseUrl = 'http://localhost:8000/api'

// Form Elements 
const inputBox = document.querySelector("#location-name")
const results = document.querySelector(".results")
const saveLocation = document.querySelector("#save-location")
const saveLocationForm = document.querySelector("#location-form")


let suggestedItems
let selectedLocationId
let fetchedLocations

inputBox.addEventListener('keyup', locationFinder, false)
saveLocation.addEventListener('click', saveLocationHandler, false)
saveLocationForm.addEventListener('submit', saveLocationFormHandler, false)


// Fetch location via geonames
async function getLocationDetails(locationName) {
    let apiURL = `${geonamesBaseUrl}/searchJSON?q=${locationName}&maxRows=10&username=${geonamesApiUsername}`
    const response = await fetch(apiURL)
    const data = await response.json()
    //For Testing
    // const data = {"totalResultsCount":10534,"geonames":[{"adminCode1":"ENG","lng":"-0.12574","geonameId":2643743,"toponymName":"London","countryId":"2635167","fcl":"P","population":8961989,"countryCode":"GB","name":"London","fclName":"city, village,...","adminCodes1":{"ISO3166_2":"ENG"},"countryName":"United Kingdom","fcodeName":"capital of a political entity","adminName1":"England","lat":"51.50853","fcode":"PPLC"},{"adminCode1":"08","lng":"-81.23304","geonameId":6058560,"toponymName":"London","countryId":"6251999","fcl":"P","population":346765,"countryCode":"CA","name":"London","fclName":"city, village,...","adminCodes1":{"ISO3166_2":"ON"},"countryName":"Canada","fcodeName":"populated place","adminName1":"Ontario","lat":"42.98339","fcode":"PPL"},{"adminCode1":"05","lng":"27.91162","geonameId":1006984,"toponymName":"East London","countryId":"953987","fcl":"P","population":478676,"countryCode":"ZA","name":"East London","fclName":"city, village,...","adminCodes1":{"ISO3166_2":"EC"},"countryName":"South Africa","fcodeName":"seat of a second-order administrative division","adminName1":"Eastern Cape","lat":"-33.01529","fcode":"PPLA2"},{"adminCode1":"CT","lng":"-72.09952","geonameId":4839416,"toponymName":"New London","countryId":"6252001","fcl":"P","population":27179,"countryCode":"US","name":"New London","fclName":"city, village,...","adminCodes1":{"ISO3166_2":"CT"},"countryName":"United States","fcodeName":"populated place","adminName1":"Connecticut","lat":"41.35565","fcode":"PPL"},{"adminCode1":"CT","lng":"-72.07591","geonameId":4839843,"toponymName":"Norwich","countryId":"6252001","fcl":"P","population":39899,"countryCode":"US","name":"Norwich","fclName":"city, village,...","adminCodes1":{"ISO3166_2":"CT"},"countryName":"United States","fcodeName":"populated place","adminName1":"Connecticut","lat":"41.52426","fcode":"PPL"},{"adminCode1":"ENG","lng":"-0.13611","geonameId":12042156,"toponymName":"Inner London","countryId":"2635167","fcl":"L","population":3200000,"countryCode":"GB","name":"Inner London","fclName":"parks,area, ...","adminCodes1":{"ISO3166_2":"ENG"},"countryName":"United Kingdom","fcodeName":"region","adminName1":"England","lat":"51.51451","fcode":"RGN"},{"adminCode1":"ENG","lng":"-0.10609","geonameId":12042157,"toponymName":"Outer London","countryId":"2635167","fcl":"L","population":5000000,"countryCode":"GB","name":"Outer London","fclName":"parks,area, ...","adminCodes1":{"ISO3166_2":"ENG"},"countryName":"United Kingdom","fcodeName":"region","adminName1":"England","lat":"51.41006","fcode":"RGN"},{"adminCode1":"ENG","lng":"-0.10203","geonameId":12042173,"toponymName":"Central London","countryId":"2635167","fcl":"L","population":1533920,"countryCode":"GB","name":"Central London","fclName":"parks,area, ...","adminCodes1":{"ISO3166_2":"ENG"},"countryName":"United Kingdom","fcodeName":"region","adminName1":"England","lat":"51.52393","fcode":"RGN"},{"adminCode1":"ENG","lng":"0.12529","geonameId":12042174,"toponymName":"East London","countryId":"2635167","fcl":"L","population":2780086,"countryCode":"GB","name":"East London","fclName":"parks,area, ...","adminCodes1":{"ISO3166_2":"ENG"},"countryName":"United Kingdom","fcodeName":"region","adminName1":"England","lat":"51.55445","fcode":"RGN"},{"adminCode1":"ENG","lng":"-0.07656","geonameId":12042176,"toponymName":"South London","countryId":"2635167","fcl":"L","population":1804491,"countryCode":"GB","name":"South London","fclName":"parks,area, ...","adminCodes1":{"ISO3166_2":"ENG"},"countryName":"United Kingdom","fcodeName":"region","adminName1":"England","lat":"51.38948","fcode":"RGN"}]}
    return data
}

// location finder handler
async function locationFinder(evt) {
    let locationName = evt.currentTarget.value
    if(locationName.length > 2){ 
        results.style.display = "block"            
        try {
            const data = await getLocationDetails(locationName)
            console.log(data);
            let matchingResult = data.geonames
            fetchedLocations = matchingResult
            let suggestionsHTML = matchingResult
                .map(item => {
                    return `<li data="${item.geonameId}">${item.name}</li>`
                })
                .join(" ")
            results.innerHTML = suggestionsHTML
            handleLocationSelection(document.querySelectorAll(".results li"))
        } catch (error) {
            console.error("error",error);
            alert("Failed to fetch location details. Please try again!")
        }
    }
}

// select location handler  
function handleLocationSelection(element) {
    element.forEach(item => {
        item.addEventListener("click", e => {
            const clickedText = e.target.innerText
            inputBox.value = clickedText
            selectedLocationId = parseInt(e.target.getAttribute("data"))
            results.style.display = "none"
            //TODO Remove child elements if display none does not do that
        })
    })
}

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// save location handler
async function saveLocationHandler(evt) {
    let email = document.getElementById("email").value
    let location = document.getElementById("location-name").value

    if(email == '' || location == '' || validateEmail(email) === null){
        return
    }

  
    let locationInfo = fetchedLocations.find(o => o.geonameId === selectedLocationId);
    let locationDetails = {
        "email_id": email,
        "latitiude": locationInfo.lat,
        "longitiude": locationInfo.lng,
        "timestamp": new Date(),
        "location_name": locationInfo.name,
        "geoname_id": locationInfo.geonameId
    }
    console.log(locationDetails)
    try {
        const data = await saveLocationDetails(locationDetails)
        console.log(data);
        alert("Location updated successfully!")
      } catch (error) {
        console.error("error",error);
        alert("Failed to save. Please try again!")
    }

}

function saveLocationFormHandler(evt) {
    evt.preventDefault()
}

// Fetch location via geonames
async function saveLocationDetails(locationDetails) {
    let apiURL = `${saveLocationBaseUrl}/staff_location/`
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationDetails)
    }
    const response = await fetch(apiURL, config)
    const data = await response.json()
    return data
}
