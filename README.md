# 🚌 TriperBus - Explore Morocco by Bus

**TriperBus** is a modern, responsive web application designed to help travelers discover and plan bus trips across Morocco. With a user-friendly interface and helpful features like AI-powered trip planning, TriperBus makes exploring Morocco more convenient than ever.

---

## 🌟 Features

- 🔍 **Trip Search**: Find bus trips between Moroccan cities with departure and arrival times.
- 📝 **Trip Details**: View comprehensive information including duration, distance, amenities, and route stops.
- 📍 **Popular Destinations**: Explore Morocco's most visited cities with curated content and imagery.
- 💡 **Travel Tips**: Read helpful tips for a smoother travel experience.
- 🤖 **AI Trip Planner**: Generate personalized itineraries based on your preferences.
- 📱 **Responsive Design**: Works beautifully on desktops, tablets, and mobile devices.

---

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Custom CSS with responsive design principles
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Montserrat)
- **Backend (API)**: Node.js + Express

---

## 📁 Project Structure
```
triperbus/
├── public/
│   ├── index.html         # Homepage with search and features
│   ├── trip.html          # Trip details and route view
│   ├── style.css          # All UI styling
│   └── app.js             # Frontend logic and API interaction
├── data/
│   ├── cities.json        # List of cities
│   ├── trips-data.json    # Bus trips by city pair keys
│   └── destinations.json  # Popular destination data
├── app.js              # Express server for API endpoints
└── README.md              # Project documentation
```

---

## 🚀 Installation & Running the Server

### Clone the repository
```bash
git clone https://github.com/hichameait/Triperbus.git
cd triperbus
```

### Install dependencies
```bash
npm install
```

### Start the Express server
```bash
node app.js
```

> 🔥 Your app will run at: [http://localhost:3000](http://localhost:3000)

---

## 🧪 API Endpoints

Your Express backend provides the following endpoints:

| Method | Endpoint                      | Description                              |
|--------|-------------------------------|------------------------------------------|
| GET    | `/cities`                     | Returns a list of cities                 |
| GET    | `/trips?dep=ID&arv=ID`        | Returns trips between two city IDs       |
| GET    | `/destinations`               | Returns all destinations                 |
| GET    | `/destinations?limit=3`       | Returns the first 3 destinations         |
| GET    | `/trip`                       | Serves the trip.html page                |

> ℹ️ Fallback mock data is used when the API is not available.

---

## 📱 Responsive Design
Designed for all screen sizes:

- 🖥️ Desktop (≥992px)
- 📱 Tablet (768px–991px)
- 📲 Mobile (<768px)

---

## 🔮 Future Improvements

- 🔐 Implement user authentication system
- 🧾 Add actual booking functionality
- 🔌 Integrate with real bus company APIs
- 🧭 More detailed filters (price, time, duration)
- 💳 Payment gateway integration

---

## 👨‍💻 Contributing
Pull requests and feedback are welcome. For major changes, please open an issue first to discuss your ideas.

---

## 📄 License
This project is licensed under the MIT License.

---

## 🙌 Acknowledgments
- Font Awesome for icons
- Unsplash for destination images
- gemini for AI itinerary generation (optional)

---

> Made with ❤️ by diplo ( Hichame Ait Benalla ) passionate about Moroccan travel.