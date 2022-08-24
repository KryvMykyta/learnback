import { Telegraf } from "telegraf";
import fs, { writeFile } from 'fs';

const token = '';
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

function generateNumber() {
    const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    let result = "";
    while (result.length < 4) {
        let dig = Math.floor(Math.random() * 10);
        if (!result.includes(dig)) {
            result += dig;
        }
    }
    console.log(result);
    return result;
}

function generateMatch(id, enemy) {
    console.log("break on parse");
    const data = JSON.parse(readData("data.json"));
    console.log(data);
    console.log(id);
    console.log(enemy);

    if (!(id in data)) {
        const match = {};
        match["opponent"] = enemy;
        match["number"] = generateNumber();
        match["count"] = 0;
        data[id] = match;
    }
    else {
        if (data[id]["opponent"] != "") {
            //reply that player is in game
        }
        else {
            const match = {};
            match["opponent"] = enemy;
            match["number"] = generateNumber();
            match["count"] = 0;
            data[id] = match;
        }
    }

    writeData(data, "data.json");

}

function generateFight(id1, id2) {
    const data = JSON.parse(readData("data.json"));
    const match1 = {};
    match1["opponent"] = id2;
    match1["number"] = generateNumber();
    match1["count"] = 0;
    data[id1] = match1;

    const match2 = {};
    match2["opponent"] = id1;
    match2["number"] = generateNumber();
    match2["count"] = 0;
    data[id2] = match2;
    bot.telegram.sendMessage(id1, "Your number was generated, start guessing");
    bot.telegram.sendMessage(id2, "Your number was generated, start guessing");
    writeData(data, "data.json");
}

function isUniqueDigits(number) {
    let subArr = [];
    let resultArr = [];
    for (let i = 0; i < number.length; i++) {
        subArr.push(number[i]);
        if (!resultArr.includes(number[i])) {
            resultArr.push(number[i]);
        }
    }
    return resultArr.length == subArr.length;
}

function checkNumber(data, id, number) {
    data[id]["count"] += 1;
    let bulls = 0;
    let cows = 0;
    let arr1 = [];
    let arr2 = [];

    let win = data[id]["number"];

    for (let i = 0; i < 4; i++) {
        if (number[i] == win[i]) {
            bulls += 1
        }
        else {
            arr1.push(number[i])
            arr2.push(win[i])
        }
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr2.includes(arr1[i])) {
            cows += 1;
        }
    }

    if (bulls == 4) {
        bot.telegram.sendMessage(id, "You guessed the number in " + data[id]["count"] + " attempts");
        if (data[id]["opponent"] != "bot") {
            bot.telegram.sendMessage(data[id]["opponent"], "Your opponent " + id + " has ended game within " + data[id]["count"] + "attempts");
        }
        else {

        }
        data[id]["opponent"] = "";

    }
    else {
        bot.telegram.sendMessage(id, "You got  " + bulls + " bulls and " + cows + " cows");
    }
}

function guessNumber(id, number) {
    const data = JSON.parse(readData("data.json"));
    if (id in data && data[id]["opponent"] != "") {
        if (number.length == 4 && parseInt(number) == number) {
            if (isUniqueDigits(number)) {
                checkNumber(data, id, number);
                writeData(data, "data.json");
            }
            else {
                bot.telegram.sendMessage(id, "Seems like your number has wrong type, read the /rules");
            }
        }
        else {
            bot.telegram.sendMessage(id, "Seems like your number has wrong type, read the /rules");
        }
    }
    else {
        bot.telegram.sendMessage(id, "Looks like you didnt enter the game");
    }


}

function confirmMatch(id, confirm) {
    let data = readData("requests.json");
    data = JSON.parse(data);
    if (confirm == "yes") {
        if (id in data) {
            if (data[id] != "") {
                let id1 = id + "";
                let id2 = data[id] + "";
                generateFight(id1, id2);
            }
            data[id] = "";
        }
        else {
            bot.telegram.sendMessage(id, "Looks like you wasnt invited to a game");
        }
    }
    else {
        if (id in data) {
            //pass
        }
        else {
            bot.telegram.sendMessage(id, "Looks like you wasnt invited to a game");
        }
        data[id] = "";
    }
    writeData(data, "requests.json");
}

function createRequest(id1, id2) {
    let data = readData("requests.json");
    data = JSON.parse(data);

    let matches = readData("data.json");
    matches = JSON.parse(matches);
    if (id2 in matches && matches[id2]["opponent"] == "") {
        bot.telegram.sendMessage(id1, "Your invitation was sent");
        bot.telegram.sendMessage(id2, " You was invited to compete with " + id1 + ". Send /yes to accept, or /no to decline.");
        data[id2] = id1 + "";
        writeData(data, "requests.json");
    }
    else {
        bot.telegram.sendMessage(id1, "Looks like your opponent didnt used this bot or playing another match.");
    }


}

bot.command('guess', function (user) {
    user.reply('Random number from 1234 to 9876 was generated, start guessing!')
    generateMatch(user.chat.id, "bot");
});

bot.command('rules', function (user) {
    user.reply('Send to this bot "/guess" to generate a random number and begin guessing by sending 4 digits long numbers\n' +
        'Generated number will have 4 unique digits, your input should have similar type\n' +
        'If your number contains 1 correct digit but not in correct place, then amount of "cows" will increase by 1\n' +
        'and also if your number contains 1 correct digit in correct place, then amount of "bulls" will increase by 1\n' +
        'For example, generated number is 5467, you guessed 1234, here are only one "cow" because of "4" in incorrect place ' +
        'if only you guessed 1432, you would have 1 "bull" because "4" in correct place');
});

bot.command('start', function (user) {
    user.reply('Send to this bot "/guess" to generate a random number and begin guessing by sending 4 digits long numbers\n' +
        'Generated number will have 4 unique digits, your input should have similar type\n' +
        'If your number contains 1 correct digit but not in correct place, then amount of "cows" will increase by 1\n' +
        'and also if your number contains 1 correct digit in correct place, then amount of "bulls" will increase by 1\n' +
        'For example, generated number is 5467, you guessed 1234, here are only one "cow" because of "4" in incorrect place ' +
        'if only you guessed 1432, you would have 1 "bull" because "4" in correct place');
});


bot.on("message", function (user) {
    const txt = user.message.text;
    if (txt.split(" ")[0] == "/challenge") {
        if (txt.split(" ").length != 2) {
            bot.telegram.sendMessage(user.chat.id, "You should enter id of your opponent ( /challende id )");
        }
        else {
            let id1 = user.chat.id;
            let id2 = txt.split(" ")[1];

            createRequest(id1, id2);
        }
    }
    else if (txt == "/yes") {
        confirmMatch(user.chat.id, "yes");
    }
    else if (txt == "/no") {
        confirmMatch(user.chat.id, "no");
    }
    else {
        guessNumber(user.chat.id, txt);
    }

});

bot.launch();