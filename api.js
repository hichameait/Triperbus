fetch("cities.json")
.then(res => res.json())
.then(data => {
    const selection_from = document.getElementById("cities_from")
    const selection_to = document.getElementById("cities_to")
    data.forEach(city => {
        const option_from = document.createElement("option")
        const option_to = document.createElement("option")

        option_from.id = "dep"
        option_from.value=city.id
        option_from.textContent=city.name

        option_to.id = "arv"
        option_to.value=city.id
        option_to.textContent=city.name

        selection_from.appendChild(option_from)       
        selection_to.appendChild(option_to)

    });
})
.catch(error => console.error("error to load data cities : " + error))

document.getElementById("botona").addEventListener("click", ()=>{
    let dep = parseFloat(document.getElementById("cities_from").value)
    let arv = parseFloat(document.getElementById("cities_to").value)
    if(dep === arv){
        document.getElementById("card1").innerHTML = ("Ops! ywe cloud find your trips")
    }
    fetch("trips-data.json")
    .then(res => res.json())
    .then(data => {
        let ids = `${dep}:${arv}`
        for (values in data) {
            if (values === ids) {
                /// data[ids]["trips"].length

                if(data[ids]["trips"].length === 0) {
                    document.getElementById("card1").innerHTML = ("Ops! we couldn't find your trips")
                }else{
                    data[ids]["trips"].forEach(kar => {
                        document.getElementById("card1").innerHTML = `<h4>Trip from ${data[ids]["dep"]} to ${data[ids]["arv"]} :</h4>`
                        document.getElementById("card2").innerHTML = `
                            <h4>=>${kar.bus}</h4>
                            <h5> -depart : ${kar.d_time} - arive : ${kar.a_time} </h5>
                            <h5> -Duration : ${kar.duration}</h5>
                            <h5> -Distance ${kar.distance}</h5>
                        `
                    })
                }

                    
            }
            
            
            
        }
        
        
        

    })
    // .catch(error => console.error("error to load data api2: " + error))
})