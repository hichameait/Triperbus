const url="http://localhost:3000"
const selection_from=document.getElementById("cities_from")
const selection_to=document.getElementById("cities_to")
const resultContainer=document.getElementById("card1")
const menuToggle=document.getElementById("menu-toggle")
const navLinks=document.getElementById("nav-links")
const loginModal=document.getElementById("login-modal")
const aiPlannerModal=document.getElementById("ai-planner-modal")
const tabBtns=document.querySelectorAll(".tab-btn")
const tabContents=document.querySelectorAll(".tab-content")
const closeModalBtns=document.querySelectorAll(".close-modal")
const openAiPlannerBtn=document.getElementById("open-ai-planner")
const aiPlannerForm=document.getElementById("ai-planner-form")
const aiResult=document.getElementById("ai-result")
const aiLoading=document.querySelector(".ai-loading")
const aiItinerary=document.querySelector(".ai-itinerary")
const itineraryContent=document.getElementById("itinerary-content")
const contactForm=document.getElementById("contact-form")
const newsletterForm=document.getElementById("newsletter-form")
const destinationsCard = document.getElementById("dest-cards")

async function Getdestination(limit) {
    try {
        const response=await fetch(`${url}/destinations?limit=${limit}`)
        let data
        if(!response.ok){
            console.warn("Using mock city data as API is not available")
        }else{
            data=await response.json()
        }
        data.forEach((city)=>{
            const cadre = document.createElement("div");
            cadre.className = "destination-card";
            cadre.innerHTML = `
            <div class="destination-img" style="background-image: url('${city.image}')"></div>
              <div class="destination-info">
                <h3>${city.name}</h3>
                <p>${city.description}</p>
                <a href="#" class="btn btn-sm">Explore Routes</a>
            </div>
        `;
            destinationsCard.appendChild(cadre);
        })
    } catch (error) {
        console.error("Error fetching destinations:",error)
    }

}
Getdestination(6)
async function Get_Cities(){
  try{
    const response=await fetch(`${url}/cities`)
    let data
    if(!response.ok){
      console.warn("Using mock city data as API is not available")
      data=[{id:1,name:"Casablanca"},{id:2,name:"Marrakech"},{id:3,name:"Fes"},{id:4,name:"Tangier"},{id:5,name:"Rabat"},{id:6,name:"Agadir"},{id:7,name:"Essaouira"},{id:8,name:"Chefchaouen"},{id:9,name:"Meknes"},{id:10,name:"Ouarzazate"}]
    }else{
      data=await response.json()
    }
    selection_from.innerHTML=`<option value="" disabled selected>Select Departure City</option>`
    selection_to.innerHTML=`<option value="" disabled selected>Select Arrival City</option>`
    data.forEach((city)=>{
      const option_from=document.createElement("option")
      const option_to=document.createElement("option")
      option_from.value=city.id
      option_from.textContent=city.name
      option_to.value=city.id
      option_to.textContent=city.name
      selection_from.appendChild(option_from)
      selection_to.appendChild(option_to)
    })
  }catch(error){
    console.error("Error fetching cities:",error)
    resultContainer.innerHTML=`
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading cities. Please try again later.</p>
            </div>
        `
    const mockCities=[{id:1,name:"Casablanca"},{id:2,name:"Marrakech"},{id:3,name:"Fes"},{id:4,name:"Tangier"},{id:5,name:"Rabat"}]
    mockCities.forEach((city)=>{
      const option_from=document.createElement("option")
      const option_to=document.createElement("option")
      option_from.value=city.id
      option_from.textContent=city.name
      option_to.value=city.id
      option_to.textContent=city.name
      selection_from.appendChild(option_from)
      selection_to.appendChild(option_to)
    })
  }
}
async function searchTrips(dep,arv){
  try{
    resultContainer.innerHTML=`
      <div class="loading">
        <div class="spinner"></div>
        <p>Searching for trips...</p>
      </div>
    `
    const response=await fetch(`${url}/trips?dep=${dep}&arv=${arv}`)
    let data
    if(!response.ok){
      console.warn("Using mock trip data as API is not available")
      const depCity=selection_from.options[selection_from.selectedIndex].text
      const arvCity=selection_to.options[selection_to.selectedIndex].text
      data={
        dep:depCity,
        arv:arvCity,
        trips:[
          {id:"31434",bus:"Sahara Prestige",d_city:depCity,a_city:arvCity,d_time:"19:00",a_time:"22:30",distance:"181KM",duration:"03h 30m",stations_nb:0,stations:[],services:{wifi:"0",climate:"1",highway:"0"}},
          {id:"30887",bus:"El Hillal Sobet",d_city:depCity,a_city:arvCity,d_time:"22:00",a_time:"01:30",distance:"181KM",duration:"03h 30m",stations_nb:0,stations:[],services:{wifi:"1",climate:"1",highway:"0"}},
          {id:"30723",bus:"Sahara Voyage",d_city:depCity,a_city:arvCity,d_time:"10:00",a_time:"13:30",distance:"181KM",duration:"03h 30m",stations_nb:0,stations:[],services:{wifi:"0",climate:"1",highway:"1"}}
        ]
      }
    }else{
      data=await response.json()
    }
    if(data.trips&&data.trips.length>0){
      resultContainer.innerHTML=`
        <div class="results-header">
          <h4>Trips from ${data.dep} to ${data.arv}</h4>
          <p>${data.trips.length} trips found</p>
        </div>
        <div class="trips-list"></div>
      `
      const tripsList=resultContainer.querySelector(".trips-list")
      data.trips.forEach((trip)=>{
        const tripCard=document.createElement("div")
        tripCard.className="trip-card"
        tripCard.setAttribute("data-trip-id",trip.id)
        tripCard.setAttribute("role","button")
        tripCard.setAttribute("tabindex","0")
        tripCard.setAttribute("aria-label",`Trip details for ${trip.bus} from ${trip.d_city||data.dep} to ${trip.a_city||data.arv}`)
        const d_time=trip.d_time||"08:00"
        const a_time=trip.a_time||"11:30"
        const duration=trip.duration||"03h 30m"
        const distance=trip.distance||"0KM"
        const services=trip.services||{wifi:"0",climate:"0",highway:"0"}
        tripCard.innerHTML=`
          <div class="trip-info">
            <div class="trip-company">
              <i class="fas fa-bus"></i>
              <h5>${trip.bus}</h5>
            </div>
            <div class="trip-time">
              <div class="departure">
                <span class="time">${d_time}</span>
                <span class="city">${trip.d_city||data.dep}</span>
              </div>
              <div class="trip-duration">
                <div class="duration-line"></div>
                <span>${duration}</span>
              </div>
              <div class="arrival">
                <span class="time">${a_time}</span>
                <span class="city">${trip.a_city||data.arv}</span>
              </div>
            </div>
            <div class="trip-services">
              <div class="service-icon ${services.wifi==="1"?"service-active":"service-inactive"}">
                <i class="fas fa-wifi"></i>
                <span>WiFi</span>
              </div>
              <div class="service-icon ${services.climate==="1"?"service-active":"service-inactive"}">
                <i class="fas fa-snowflake"></i>
                <span>A/C</span>
              </div>
              <div class="service-icon ${services.highway==="1"?"service-active":"service-inactive"}">
                <i class="fas fa-road"></i>
                <span>Highway</span>
              </div>
              <div class="service-icon">
                <i class="fas fa-route"></i>
                <span>${distance}</span>
              </div>
            </div>
            <div class="trip-details-toggle">
              <i class="fas fa-chevron-down"></i>
              <span>View details</span>
            </div>
          </div>
          <div class="trip-details" style="display: none;">
            <div class="trip-details-content">
              <div class="trip-route">
                <h5>Route Information</h5>
                <div class="route-info">
                  <div class="route-point">
                    <div class="point-marker departure-point"></div>
                    <div class="point-details">
                      <span class="point-time">${d_time}</span>
                      <span class="point-location">${trip.d_city||data.dep}</span>
                    </div>
                  </div>
                  ${renderStations(trip.stations||[])}
                  <div class="route-point">
                    <div class="point-marker arrival-point"></div>
                    <div class="point-details">
                      <span class="point-time">${a_time}</span>
                      <span class="point-location">${trip.a_city||data.arv}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="trip-features">
                <h5>Bus Features</h5>
                <div class="features-grid">
                  <div class="feature-item ${services.wifi==="1"?"feature-available":"feature-unavailable"}">
                    <i class="fas fa-wifi"></i>
                    <span>WiFi</span>
                  </div>
                  <div class="feature-item ${services.climate==="1"?"feature-available":"feature-unavailable"}">
                    <i class="fas fa-snowflake"></i>
                    <span>Air Conditioning</span>
                  </div>
                  <div class="feature-item ${services.highway==="1"?"feature-available":"feature-unavailable"}">
                    <i class="fas fa-road"></i>
                    <span>Highway Route</span>
                  </div>
                  <div class="feature-item feature-available">
                    <i class="fas fa-suitcase"></i>
                    <span>Luggage Space</span>
                  </div>
                  <div class="feature-item feature-available">
                    <i class="fas fa-chair"></i>
                    <span>Comfortable Seats</span>
                  </div>
                  <div class="feature-item feature-available">
                    <i class="fas fa-bus-alt"></i>
                    <span>Modern Vehicle</span>
                  </div>
                </div>
              </div>
              <div class="trip-additional-info">
                <div class="info-item">
                  <i class="fas fa-clock"></i>
                  <div>
                    <h6>Duration</h6>
                    <p>${duration}</p>
                  </div>
                </div>
                <div class="info-item">
                  <i class="fas fa-route"></i>
                  <div>
                    <h6>Distance</h6>
                    <p>${distance}</p>
                  </div>
                </div>
                <div class="info-item">
                  <i class="fas fa-id-card"></i>
                  <div>
                    <h6>Trip ID</h6>
                    <p>${trip.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
        tripsList.appendChild(tripCard)
        tripCard.addEventListener("click",function(e){
          const detailsSection=this.querySelector(".trip-details")
          const toggleIcon=this.querySelector(".trip-details-toggle i")
          const toggleText=this.querySelector(".trip-details-toggle span")
          if(detailsSection.style.display==="none"){
            detailsSection.style.display="block"
            toggleIcon.classList.replace("fa-chevron-down","fa-chevron-up")
            toggleText.textContent="Hide details"
            const rect=this.getBoundingClientRect()
            if(rect.bottom>window.innerHeight){
              this.scrollIntoView({behavior:"smooth",block:"start"})
            }
          }else{
            detailsSection.style.display="none"
            toggleIcon.classList.replace("fa-chevron-up","fa-chevron-down")
            toggleText.textContent="View details"
          }
        })
      })
    }else{
      resultContainer.innerHTML=`
        <div class="no-results">
          <i class="fas fa-route"></i>
          <h4>No trips found</h4>
          <p>We couldn't find any trips from ${data.dep} to ${data.arv}.</p>
          <p>Try selecting different cities or dates.</p>
        </div>
      `
    }
  }catch(error){
    console.error("Error fetching trips:",error)
    resultContainer.innerHTML=`
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>Error loading trips. Please try again later.</p>
      </div>
    `
  }
}
function renderStations(stations){
  if(!stations||stations.length===0){
    return `
      <div class="route-line">
        <div class="route-line-inner"></div>
      </div>
    `
  }
  let stationsHtml='<div class="route-line"><div class="route-line-inner">'
  stations.forEach((station)=>{
    stationsHtml+=`
      <div class="route-station">
        <div class="station-marker"></div>
      </div>
    `
  })
  stationsHtml+="</div></div>"
  stationsHtml+=stations.map((station)=>`
    <div class="route-point station-point">
      <div class="point-marker station-marker"></div>
      <div class="point-details">
        <span class="point-time">${station.time||"N/A"}</span>
        <span class="point-location">${station.name||"Station"}</span>
      </div>
    </div>
  `).join("")
  return stationsHtml
}
function toggleMenu(){
  navLinks.classList.toggle("active")
}
function openModal(modal){
  modal.style.display="block"
  document.body.style.overflow="hidden"
}
function closeModal(modal){
  modal.style.display="none"
  document.body.style.overflow="auto"
}
function switchTab(e){
  const tabId=e.target.dataset.tab
  tabBtns.forEach((btn)=>btn.classList.remove("active"))
  tabContents.forEach((content)=>content.classList.remove("active"))
  e.target.classList.add("active")
  document.getElementById(`${tabId}-tab`).classList.add("active")
}

async function generateAIItinerary(e) {
    e.preventDefault();
    aiResult.classList.remove("hidden");
    aiLoading.style.display = "block";
    aiItinerary.classList.add("hidden");
  
    const duration = document.getElementById("trip-duration").value;
    const startingCity = document.getElementById("trip-starting-city").value;
    const budget = document.getElementById("trip-budget").value;
    const interests = [];
  
    document.querySelectorAll('input[name="interests"]:checked').forEach((checkbox) => {
      interests.push(checkbox.value);
    });
  
    const prompt = `Create a detailed ${duration}-day travel itinerary for ${startingCity} with a ${budget} budget.
    The traveler is interested in: ${interests.join(", ")}.
    
    Please respond with a JSON array where each element represents a day.
    Each day object should have this structure:
    {
      "day": "Day X",
      "morning": "activity description",
      "lunch": "recommendation",
      "afternoon": "activity description",
      "evening": "activity description"
    }
    
    Make the itinerary personalized for their interests and budget.
    Return ONLY the JSON array, without any additional text or explanations.`;
  
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDZceXIKrkS5J8Qm-JBxuamZWGwBD28uvM`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
        
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      
      // Extract the text response from Gemini API
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      
      // Clean the response by removing markdown code blocks
      let jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      // Try to parse the JSON response
      let itineraryDays = [];
      try {
        itineraryDays = JSON.parse(jsonString);
        if (!Array.isArray(itineraryDays)) {
          throw new Error("Response is not an array");
        }
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        throw new Error("AI returned invalid format. Please try again.");
      }
  
      aiLoading.style.display = "none";
      aiItinerary.classList.remove("hidden");
  
      let itinerary = `<h4>${duration}-Day ${startingCity.charAt(0).toUpperCase() + startingCity.slice(1)} Itinerary (${budget.charAt(0).toUpperCase() + budget.slice(1)} Budget)</h4>`;
      itinerary += `<p>Based on your interests: ${interests.join(", ")}</p>`;
  
      // Process each day from the array
      itineraryDays.forEach((dayData, index) => {
        const dayNumber = index + 1;
        itinerary += `
          <div class="itinerary-day">
            <h5>Day ${dayNumber}</h5>
            <ul>
              <li><strong>Morning:</strong> ${dayData.morning || "No activity planned"}</li>
              <li><strong>Lunch:</strong> ${dayData.lunch || "No recommendation"}</li>
              <li><strong>Afternoon:</strong> ${dayData.afternoon || "No activity planned"}</li>
              <li><strong>Evening:</strong> ${dayData.evening || "No activity planned"}</li>
            </ul>
          </div>
        `;
      });
  
      // Add any missing days if the API didn't return enough
      for (let i = itineraryDays.length; i < duration; i++) {
        const dayNumber = i + 1;
        itinerary += `
          <div class="itinerary-day">
            <h5>Day ${dayNumber}</h5>
            <ul>
              <li>No activities generated for this day</li>
            </ul>
          </div>
        `;
      }
  
      itinerary += `
        <div class="transportation-info">
          <h5>Transportation</h5>
          <p>Bus tickets will be available for booking between all destinations in your itinerary.</p>
        </div>
      `;
  
      itineraryContent.innerHTML = itinerary;
  
    } catch (error) {
      console.error("AI itinerary generation error:", error);
      aiLoading.style.display = "none";
      itineraryContent.innerHTML = `
        <p class="error-message">Failed to generate itinerary. Please try again later.</p>
        ${error.message ? `<p class="error-details">${error.message}</p>` : ''}
      `;
    }
}


document.addEventListener("DOMContentLoaded",()=>{
  Get_Cities()
  document.getElementById("ser").addEventListener("click",()=>{
    const dep=Number.parseFloat(selection_from.value)
    const arv=Number.parseFloat(selection_to.value)
    if(!dep||!arv){
      resultContainer.style.display="block";
      resultContainer.innerHTML=`
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Please select both departure and arrival cities.</p>
                </div>
            `
      return
    }
    if(dep===arv){
      resultContainer.style.display="block";
      resultContainer.innerHTML=`
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Departure and arrival cities cannot be the same.</p>
                </div>
            `
      return
    }
    resultContainer.style.display="none";
    window.location.href=`/trip?dep=${dep}&dest=${arv}`;
  })
  if(menuToggle){
    menuToggle.addEventListener("click",toggleMenu)
  }
  document.querySelectorAll(".nav-cta a").forEach((link)=>{
    link.addEventListener("click",(e)=>{
      e.preventDefault()
      openModal(loginModal)
    })
  })
  if(openAiPlannerBtn){
    openAiPlannerBtn.addEventListener("click",()=>{
      openModal(aiPlannerModal)
    })
  }
  closeModalBtns.forEach((btn)=>{
    btn.addEventListener("click",()=>{
      const modal=btn.closest(".modal")
      closeModal(modal)
    })
  })
  window.addEventListener("click",(e)=>{
    if(e.target.classList.contains("modal")){
      closeModal(e.target)
    }
  })
  tabBtns.forEach((btn)=>{
    btn.addEventListener("click",switchTab)
  })
  if(aiPlannerForm){
    aiPlannerForm.addEventListener("submit",generateAIItinerary)
  }
  if(contactForm){
    contactForm.addEventListener("submit",(e)=>{
      e.preventDefault()
      alert("Thank you for your message! We will get back to you soon.")
      contactForm.reset()
    })
  }
  if(newsletterForm){
    newsletterForm.addEventListener("submit",(e)=>{
      e.preventDefault()
      alert("Thank you for subscribing to our newsletter!")
      newsletterForm.reset()
    })
  }
  document.querySelectorAll('a[href^="#"]').forEach((anchor)=>{
    anchor.addEventListener("click",function(e){
      if(this.getAttribute("href")!=="#login"){
        e.preventDefault()
        const target=document.querySelector(this.getAttribute("href"))
        if(target){
          window.scrollTo({
            top:target.offsetTop-80,
            behavior:"smooth"
          })
          if(navLinks.classList.contains("active")){
            toggleMenu()
          }
        }
      }
    })
  })
  window.addEventListener("scroll",()=>{
    const scrollPosition=window.scrollY
    document.querySelectorAll("section[id]").forEach((section)=>{
      const sectionTop=section.offsetTop-100
      const sectionHeight=section.offsetHeight
      const sectionId=section.getAttribute("id")
      if(scrollPosition>=sectionTop&&scrollPosition<sectionTop+sectionHeight){
        document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.add("active")
      }else{
        document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.remove("active")
      }
    })
  })
})
document.addEventListener("DOMContentLoaded",()=>{
  const style=document.createElement("style")
  style.textContent=`
        .loading, .error-message, .no-results {
            text-align: center;
            padding: 2rem;
        }
        
        .loading .spinner {
            display: inline-block;
            width: 40px;
            height: 40px;
            border: 3px solid rgba(26, 95, 122, 0.3);
            border-radius: 50%;
            border-top-color: var(--primary-color);
            animation: spin 1s ease-in-out infinite;
            margin-bottom: 1rem;
        }
        
        .error-message i, .no-results i {
            font-size: 2.5rem;
            color: var(--error-color);
            margin-bottom: 1rem;
        }
        
        .no-results i {
            color: var(--text-light);
        }
        
        .results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .results-header h4 {
            font-size: 1.25rem;
            color: var(--primary-color);
        }
        
        .results-header p {
            color: var(--text-light);
            margin: 0;
        }
        
        .trips-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .trip-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: var(--bg-light);
            border-radius: var(--border-radius);
            padding: 1rem;
            transition: var(--transition);
        }
        
        .trip-card:hover {
            box-shadow: var(--box-shadow);
            transform: translateY(-2px);
        }
        
        .trip-info {
            flex: 1;
        }
        
        .trip-company {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
        }
        
        .trip-company i {
            color: var(--primary-color);
        }
        
        .trip-company h5 {
            font-size: 1rem;
            margin: 0;
        }
        
        .trip-time {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .departure, .arrival {
            display: flex;
            flex-direction: column;
        }
        
        .time {
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .city {
            font-size: 0.875rem;
            color: var(--text-light);
        }
        
        .trip-duration {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
        }
        
        .duration-line {
            width: 100%;
            height: 2px;
            background-color: var(--primary-light);
            position: relative;
        }
        
        .duration-line::before, .duration-line::after {
            content: '';
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--primary-color);
            top: 50%;
            transform: translateY(-50%);
        }
        
        .duration-line::before {
            left: 0;
        }
        
        .duration-line::after {
            right: 0;
        }
        
        .trip-duration span {
            font-size: 0.75rem;
            color: var(--text-light);
            margin-top: 0.25rem;
        }
        
        .trip-price {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.5rem;
        }
        
        .price {
            font-weight: 600;
            font-size: 1.25rem;
            color: var(--primary-color);
        }
        
        .itinerary-day {
            margin-bottom: 1.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--bg-dark);
        }
        
        .itinerary-day h5 {
            color: var(--primary-color);
            margin-bottom: 0.75rem;
        }
        
        .itinerary-day ul {
            list-style: disc;
            padding-left: 1.5rem;
        }
        
        .itinerary-day li {
            margin-bottom: 0.5rem;
        }
        
        .transportation-info {
            background-color: var(--bg-light);
            padding: 1rem;
            border-radius: var(--border-radius);
            margin-top: 1.5rem;
        }
        
        .transportation-info h5 {
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }
        
        .transportation-info p {
            margin-bottom: 0;
        }
        
        @media (max-width: 768px) {
            .trip-card {
                flex-direction: column;
                align-items: flex-start;
            }
            .trip-price {
                width: 100%;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid var(--bg-dark);
            }
        }
    `
  document.head.appendChild(style)
})