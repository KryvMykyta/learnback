import * as fs from 'fs';

function createArray(fileName) {
    let data = fs.readFileSync(fileName, {encoding : "utf-8"});
    data = JSON.parse(data);
    let arr = [];
    for (let i = 0; i<data.length;i++){
        if (!arr.includes(data[i]["user"]["_id"])) {
            arr.push(data[i]["user"]["_id"]);
        }
    }
    return arr;
}

async function reWork(fileOld,fileNew) {
    let data = await createArray(fileOld);
    let old = await fs.readFileSync(fileOld, {encoding : "utf-8"});
    old = JSON.parse(old)
    let newData = [];
    let object = {};
    for (let i = 0; i<data.length; i++) {
        object = {};
        let res = old.filter(item => { return item["user"]["_id"] == data[i]});
        object["id"] = res[0]["user"]["_id"];
        object["name"] = res[0]["user"]["name"];
        let weekendDays = [];
        for (let j = 0; j<res.length; j++){
            weekendDays.push({"startDate":res[j]["startDate"], "endDate":res[j]["endDate"]});
        }
        object["weekends"] = weekendDays;
        newData.push(object);
    }
    console.log(newData);
    fs.writeFile("new.json",JSON.stringify(newData), (err) => {
        console.error(err);
    });
}

reWork("old.json","new.json");
