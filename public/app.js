const url = "https://api.domain.com/v1/";

const selection_from = document.getElementById("cities_from");
const selection_to = document.getElementById("cities_to");
const resultContainer = document.getElementById("card1");


async function Get_Cities() {
    try {
        const response = await fetch(`${url}/cities`);
        const data = await response.json();

        selection_from.innerHTML = `<option value="" disabled selected>Select Departure City</option>`;
        selection_to.innerHTML = `<option value="" disabled selected>Select Arrival City</option>`;

        data.forEach(city => {
            const option_from = document.createElement("option");
            const option_to = document.createElement("option");

            option_from.value = city.id;
            option_from.textContent = city.name;

            option_to.value = city.id;
            option_to.textContent = city.name;

            selection_from.appendChild(option_from);
            selection_to.appendChild(option_to);
        });
    } catch (error) {
        console.error('Error fetching cities:', error);
        resultContainer.textContent = "Error loading cities. Please try again later.";
    }
}
Get_Cities();

document.getElementById("ser").addEventListener("click", () => {
    const dep = parseFloat(selection_from.value);
    const arv = parseFloat(selection_to.value);

    if (!dep || !arv) {
        resultContainer.innerHTML = "Please select both departure and arrival cities.";
        return;
    }

    if (dep === arv) {
        resultContainer.innerHTML = "Departure and arrival cities cannot be the same.";
        return;
    }

    async function trips(dep, arv) {
        try {
            const response = await fetch(`${url}/trips?dep=${dep}&arv=${arv}`);
            const data = await response.json();

            if (data["trips"] && data["trips"].length > 0) {
                resultContainer.innerHTML = `<h4>Trips from ${data["dep"]} to ${data["arv"]}:</h4>`;
                const tripsList = document.createElement("ul");
                data["trips"].forEach(kar => {
                    const tripItem = document.createElement("li");
                    tripItem.textContent = `Bus: ${kar.bus}`;
                    tripsList.appendChild(tripItem);
                });
                resultContainer.appendChild(tripsList);
            } else {
                resultContainer.innerHTML = "Ops! We couldn't find any trips for your selection.";
            }
        } catch (error) {
            console.error('Error fetching trips:', error);
            resultContainer.innerHTML = "Error loading trips. Please try again later.";
        }
    }

    trips(dep, arv);
});
