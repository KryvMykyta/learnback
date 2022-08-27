import * as fs from 'fs';

function union(setA, setB) {
    var _union = new Set(setA);
    for (var elem of setB) {
        _union.add(elem);
    }
    return _union;
}

async function uniqueWords(fileName, set) {
    let words = await fs.readFileSync(fileName, { encoding: 'utf-8' }).split("\n");
    let unique = new Set(words);
    return union(set, unique);
}

async function amountOfWords(fileName, map) {
    let words = await fs.readFileSync(fileName, { encoding: 'utf-8' }).split("\n");
    let unique = new Set(words);
    for (let item of unique) {
        if (map.get(item) != undefined) {
            map.set(item, map.get(item) + 1);
        }
        else {
            map.set(item, 1);
        }
    };
    return map;
}

function appearsIn20Files(map) {
    let count = 0;
    for (const [key, value] of map) {
        if (value === 20) {
            count++;
        }
    }
    return count;
}

function appearsIn10plusFiles(map) {
    let count = 0;
    for (const [key, value] of map) {
        if (value >= 10) {
            count++;
        }
    }
    return count;
}

async function result(num) {
    console.log("num = ",num);
    let start = new Date().getTime();
    let set = new Set();
    let map = new Map();
    let item = 0;
    for (let i = 0; i < 20; i++) {
        set = await uniqueWords("./files"+num+"/out" + i + ".txt", set);
        map = await amountOfWords("./files"+num+"/out" + i + ".txt", map);
    }

    console.log("unique words : " + set.size);

    let unq = new Date().getTime();
    let time1 = unq - start;
    console.log("start-unique :" + time1 / 1000 +"\n");

    let inTwenty = await appearsIn20Files(map);
    let twenty = new Date().getTime();
    let time2 = twenty - unq;
    console.log("in twenty files : " + inTwenty);
    console.log("twenty - unique : " + time2 / 1000 +"\n");

    let inMoreTen = await appearsIn10plusFiles(map);
    let ten = new Date().getTime();
    let time3 = ten - twenty;
    console.log("more ten : " + inMoreTen);
    console.log("ten - twenty: " + time3 / 1000 +"\n");

    let total = ten - start;

    console.log("total time : " + total/1000);
}

async function main() {
    await result("");
    await result("1");
}

main();