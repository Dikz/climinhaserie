#!/usr/bin/env node

const cli = require('inquirer')
const figlet = require('figlet')
const chalk = require('chalk')
const clear = require('clear')

const SerieController = require('./src/controllers/SerieController')

clear()
console.log(
    chalk.blue(
        figlet.textSync("Minha Serie", {
            horizontalLayout: "full"
        })
    )
)

cli
    .prompt([{
        type: "list",
        name: "main_option",
        message: chalk.hex("#72e060").bold("O que deseja fazer?"),
        prefix: "*",
        choices: [{
                value: 1,
                name: "Top series"
            },
            {
                value: 2,
                name: "Buscar serie"
            },
        ]
    }])
    .then(answers => {
        if (answers.main_option === 1) {
            SerieController.top()
        }
    })
    .catch(err => {
        console.log(err)
    })