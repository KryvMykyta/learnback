const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function Repeat() {
    rl.question('Enter words: ', function (words) {
        let arr = words.split(" ");
        let checker = true;
        console.log(arr);
        function Action() {
            rl.question("what do you want to do?\n"+ 
            "1) Alphabetical sort\n"+
            "2) Sort digits from the smallest to the biggest\n"+
            "3) Sort digits from the biggest to the smallest\n"+
            "4) Sort words by quantity of letters\n"+
            "5) Show only unique words\n"+
            "or 'exit' to execute the programm\n", function (func) {
                switch (func) {
                    case "exit":
                        process.exit(0);
                        break;
                    case "1":
                        arr.sort();
                        console.log(arr);
                        Repeat();
                        break;
                    case "2":
                        let digits = [];
                        for (let i = 0; i<arr.length; i++) {
                            if (Number.isInteger(Number(arr[i]))) {
                                digits.push(arr[i]);
                            }
                        }
                        digits.sort(function(a,b) {
                            return Number(a) - Number(b);
                        });
                        console.log(digits);
                        Repeat();
                        break;
                    case "3":
                        let digit = [];
                        for (let i = 0; i<arr.length; i++) {
                            if (Number.isInteger(Number(arr[i]))) {
                                digit.push(arr[i]);
                            }
                        }
                        digit.sort(function(a,b) {
                            return Number(a) - Number(b);
                        }).reverse();
                        console.log(digit);
                        Repeat();
                        break;
                    case "4":
                        let lens = [];
                        for (let i = 0; i<arr.length; i++) {
                            if (!lens.includes(arr[i].length)) {
                                lens.push(arr[i].length);
                            }
                        }
                        lens.sort();
                        let resultArr = [];
                        for (let i = 0; i<lens.length; i++) {
                            let WordWithLen = [];
                            for (let j = 0; j<arr.length; j++) {
                                if (arr[j].length == lens[i]) {
                                    WordWithLen.push(arr[j]);
                                }
                            }
                            WordWithLen.sort();
                            resultArr = resultArr.concat(WordWithLen);
                        }
                        console.log(resultArr);
                        Repeat();
                        break;
                    case "5":
                        let result = [];
                        for (let i = 0; i<arr.length; i++) {
                            if (!result.includes(arr[i])) {
                                result.push(arr[i]);
                            }
                        }
                        console.log(result);
                        Repeat();
                        break;
                    default:
                        console.log("Choose 1-5 or exit");
                        Action();
                        break;
                }
            });
        }
        Action();
    });
}

Repeat();