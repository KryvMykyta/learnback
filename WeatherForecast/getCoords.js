import axios from "axios";

async function getData(URL) {
    try {
        const response = await axios.get(URL);
        return response;
    } catch (error) {
        console.error(error);
        return 0;
    }
}


export async function getCoords(cityName) {
    let data = await getData(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=4a27331c96310083697f644cad62c3f5`);
    return [data["data"][0]["lat"], data["data"][0]["lon"]];
}

async function main() {
    let coords = await getCoords("London")
}

main();
