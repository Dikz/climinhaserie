const cli = require('inquirer')
const axios = require('axios')
const chalk = require('chalk')
const Table = require('cli-table')
const Spinner = require('cli-spinner').Spinner

class SeriePart {
    constructor () {
        this.spinner = new Spinner({
            text: '%s Buscando... ',
        })
        this.spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠏')

        this.serieTable = new Table({
            style: {
                'padding-left': 1,
                'padding-right': 1
            }
        })
    }

    top() {
        this.spinner.start()
        axios.get('http://minhaserieapi.herokuapp.com/series')
            .then(res => {
                let listchoices = [];
                res.data.results.map(serie => {
                    listchoices.push({
                        value: serie.name,
                        name: serie.title
                    })
                })
                cli.prompt([{
                        type: "list",
                        name: "serie",
                        message: chalk.hex("#FFD762").bold("\nEscolha a serie: "),
                        choices: listchoices
                    }])
                    .then(res => {
                        //console.log(res.serie)
                        this.spinner.start()
                        axios.get(`https://minhaserieapi.herokuapp.com/series/${res.serie}`)
                            .then(res => {
                                let serie = res.data;

                                console.log("\n\n  📺 Informações da serie: \n")
                                this.serieTable.push(
                                    [chalk.hex("#9e82a8").bold("Titulo:"), chalk.white(serie.title)],
                                    [chalk.hex("#9e82a8").bold("Categoria:"), chalk.white(serie.category)],
                                    [chalk.hex("#9e82a8").bold("Lançamento:"), chalk.white(serie.debut)],
                                    [chalk.hex("#9e82a8").bold("Temporadas:"), chalk.white(serie.seasons)],
                                    [chalk.hex("#9e82a8").bold("Epsodios:"), chalk.white(serie.episodes)],
                                    [chalk.hex("#9e82a8").bold("Link:"), chalk.white(serie.link)],
                                    //[serie.description]
                                )
                                console.log(this.serieTable.toString())
                            })
                            .catch(err => {
                                console.log(err)
                            })
                            .then(() => {
                                this.spinner.stop()
                            })
                    })
            })
            .catch(err => {
                console.log(err)
            })
            .then(() => {
                this.spinner.stop()
            })
    }
}

module.exports = new SeriePart()