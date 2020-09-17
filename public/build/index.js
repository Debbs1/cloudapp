const searchForm = document.getElementById('search-form');
const citySearch = document.getElementById('newCity');
const city = document.getElementById('cityName');
const Body = document.getElementById('newBody');
const container = document.getElementById('container')

updateWeather=(city)=>{
   console.log(city);
   city.textContent = city.name;
   var img = city.weather[0].icon;
   var imgUrl = "https://openweathermap.org/img/wn/"+img+"@4x.png"
        
   if(img.includes('n')){
    container.style.backgroundImage = "url('night.jpg')"
    //container.style.backgroundSize = contain
    container.classList.add("text-white")
   }
   if(img.includes('d')){
    container.style.backgroundImage = "url('day.jpg')"
    container.classList.add("text-black")
   }
   
   Body.innerHTML = `
    <div>
        <h2 id="cityName"class="font-RockSalt uppercase block pt-2 pb-2 text-3xl font-bold">${city.name}</h2>
        <p id="country"class="font-Risque"><i class='fas fa-map-marker-alt'>&nbsp</i>${city.sys.country}</p>
    <div>
   <div>
       <img id="icon"class="w-40 mx-auto" src="${imgUrl}">
   </div>
   <div>
       <p id="weather"class="text-center uppercase pt-2 font-Risque">${city.weather[0].description}</p>
   </div>
   <div>
       <p id="tempreture"class="font-semibold font-Risque text-center oldstyle-nums text-6xl">${city.main.temp}&deg;F</p>
   </div>
</div>
   `
}

searchForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const citySearched = citySearch.value.trim();
    searchForm.reset();

    requestCity(citySearched)
    .then((data)=>{
        updateWeather(data);
    })
    .catch((error)=>{
        console.log(error)
    })
})