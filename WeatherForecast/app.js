import { Telegraf } from "telegraf";
import axios from "axios";
import { getCoords } from "./getCoords.js";
import fs, { read, writeFile } from 'fs';

const token = '5698955715:AAFOYZkROkkGGUrD5CeMxoXcBxfwOMhvTuI';
const bot = new Telegraf(token);

function readData(fileName) {
    try {
        const data = fs.readFileSync(fileName, 'utf8');
        console.log(data);
        return data;
    } catch (err) {
        console.error(err);
    }
}

function writeData(data, fileName) {
    fs.writeFile(fileName, JSON.stringify(data), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    });
}

async function getData(URL) {
    try {
        const response = await axios.get(URL);
        return response;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

function logWeather(city, forecasts, period) {
    let resultStr = `Forecast for ${city}\n`;
    let objects = {};
    for (let i = 0; i < forecasts.length; i++) {
        if (getHours(forecasts[i]["dt_txt"]) % period == 0) {
            let date = forecasts[i]["dt_txt"].split(" ");
            if (Object.keys(objects).includes(date[0])) {
                objects[date[0]] += `${date[1]}, ${forecasts[i]["main"]["temp"]} Celsius, Feels like ${forecasts[i]["main"]["feels_like"]} Celsius, ${forecasts[i]["weather"][0]["main"]}\n`;
            }
            else {
                objects[date[0]] = `${date[1]}, ${forecasts[i]["main"]["temp"]} Celsius, Feels like ${forecasts[i]["main"]["feels_like"]} Celsius, ${forecasts[i]["weather"][0]["main"]}\n`;
            }
        }
    }
    let keys = Object.keys(objects)
    for (let i = 0; i < keys.length; i++) {
        resultStr += keys[i] + "\n";
        resultStr += objects[keys[i]];
    }
    return resultStr;
}

function getHours(str) {
    let hours = str.split(" ");
    hours = hours[1];
    hours = hours.slice(0, 2);
    return Number(hours);
}

async function getMessage(cityName, period) {
    let coords = await getCoords(cityName)
    const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords[0]}&lon=${coords[1]}&units=metric&appid=4a27331c96310083697f644cad62c3f5`
    let data = await getData(URL);
    let city = data["data"]["city"]["name"];
    let forecasts = data["data"]["list"];
    let resultStr = logWeather(city, forecasts, period);
    return resultStr;
}

function setCity(id, city) {
    let data = JSON.parse(readData("cities.json"));
    data[id] = city;
    writeData(data, "cities.json");
}

//getMessage("London");

async function main() {
    bot.command("start", (user) => {
        user.reply("Which city forecast do you want to know?");
    });

    bot.on("message", (user) => {
        const txt = user.message.text;
        if (txt.split(" ").length == 1) {
            setCity(user.chat.id, txt);
            bot.telegram.sendMessage(user.chat.id, "Which period you interested in?", {
                "reply_markup": {
                    "resize_keyboard": true,
                    "keyboard": [
                        [
                            "Every 3 hours",
                            "Every 6 hours"
                        ]
                    ]
                }

            });
        }
        else {
            if (txt == "Every 3 hours") {
                let data = JSON.parse(readData("cities.json"));
                console.log(data);
                console.log(Object.keys(data).includes(String(user.chat.id)));
                if (Object.keys(data).includes(String(user.chat.id))) {
                    getMessage(data[user.chat.id], 3).then((msg) => {
                        bot.telegram.sendMessage(user.chat.id, msg);
                    });
                }
                else {
                    bot.telegram.sendMessage(user.chat.id, "Seems like you didnt enter the city to check, try /start");
                }
            }
            else if (txt == "Every 6 hours") {
                let data = JSON.parse(readData("cities.json"));
                if (Object.keys(data).includes(String(user.chat.id))) {
                    getMessage(data[user.chat.id], 6).then((msg) => {
                        bot.telegram.sendMessage(user.chat.id, msg);
                    });
                }
                else {
                    bot.telegram.sendMessage(user.chat.id, "Seems like you didnt enter the city to check, try /start");
                }
            }
            else {
                bot.telegram.sendMessage(user.chat.id, "Something went wrong, try /start");
            }
        }
    });

    bot.launch();
}
main();
