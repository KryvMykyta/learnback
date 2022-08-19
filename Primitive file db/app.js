import inquirer from 'inquirer'
import fs from 'fs'

let people = []
function Add() {
    inquirer
        .prompt([{
            name: "Name",
            type: "input",
            message: "name"
        }
        ])
        .then(function (answer) {
            if (answer.Name != "") {
                inquirer
                    .prompt([
                        {
                            name: "Age",
                            type: "input",
                            message: "Age"
                        },

                        {
                            name: "Gender",
                            type: "list",
                            message: "Choose your fighter: ",
                            choices: ["male", "female", "Tyubik"]
                        }
                    ])
                    .then(function (answers) {
                        let human = Object.assign(answer, answers)

                        fs.readFile('DB.txt', 'utf-8', (err, data) => {
                            if (err) {
                                console.log("An error occured while writing JSON Object to File.");
                            }

                            let content = [human];

                            if (data != "") {
                                content = content.concat(JSON.parse(data));
                            }

                            fs.writeFile("DB.txt", JSON.stringify(content), 'utf8', function (err) {
                                if (err) {
                                    console.log("An error occured while writing JSON Object to File.");
                                    return console.log(err);
                                }
                            });

                        });

                        Add();
                    })
            }
            else {
                inquirer
                    .prompt([
                        {
                            name: "ProgrammFate",
                            type: "list",
                            choices: ["Yes", "No"],
                            message: "Would you check DB?"
                        }
                    ])
                    .then(function (question) {
                        if (question.ProgrammFate == "Yes") {
                            fs.readFile('DB.txt', 'utf-8', (err, data) => {
                                if (err) {
                                    console.log("An error occured while writing JSON Object to File.");
                                }
                                data = JSON.parse(data);
                                console.log(data);
                            });
                            inquirer
                                .prompt([
                                    {
                                        name: "FoundName",
                                        type: "input",
                                        message: "Who you want to find?"
                                    }
                                ])
                                .then(function (Filter) {

                                    fs.readFile('DB.txt', 'utf-8', (err, data) => {
                                        if (err) {
                                            console.log("An error occured while writing JSON Object to File.");
                                        }
                                        data = JSON.parse(data);
                                        let found = [];
                                        for (let i = 0; i < data.length; i++) {
                                            if (data[i].Name == Filter.FoundName){
                                                found.push(data[i]);
                                            }

                                        }
                                        if (JSON.stringify(found) == "[]") {
                                            console.log("Looks like there is no human with that name D:");
                                        }
                                        else {
                                            console.log(found);
                                        }
                                        
                                    });

                                    
                                })
                        }
                        else {
                            process.exit(123);
                        }
                    })
            }
        });
}

Add();