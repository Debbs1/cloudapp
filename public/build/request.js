const key="fb80d66964d0ba43d985bb2020622826";
const requestCity = async (city)=>{
	const baseURL='https://api.openweathermap.org/data/2.5/weather';
	const query = '?q='+city+'&appid='+key;

	const response = await fetch(baseURL + query);
	const data = await response.json();
	return data;
}