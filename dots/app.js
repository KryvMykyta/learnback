function IncreaseLenBy1(arr) {
    let FirstArray = [];
    let SecondArray = [];
    for (let i = 0; i<arr.length; i++) {
        FirstArray.push(arr[i]+"0");
        SecondArray.push(arr[i]+"1");
    }
    let arr = FirstArray.concat(SecondArray);
    return arr;
    
}

function CreateBinStrByLen(len) {
    let arr = ["0","1"];
    for (let i = 0; i<len-1; i++) {
        arr = IncreaseLenBy1(arr);
    }
    return arr;
}

// abcd => a.b.c.d
function MakeDots(word) {
    let resultArr = [];
    let len = word.length;
    let arr = CreateBinStrByLen(len-1);
    for (let j = 0; j < arr.length; j++){
        let resultStr = "";
        for (let i = 0; i < 2*len - 1; i++) {
            if (i%2 == 0) {
                resultStr += word[Math.floor(i/2)];
            }
            else {
                if(arr[j][Math.floor(i/2)] == "1"){
                    resultStr += ".";
                }
            }
        }
        resultArr.push(resultStr);
    }
    return resultArr;
}

console.log(MakeDots("abc"));
console.log(MakeDots("abcdefg"))
