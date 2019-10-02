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

                listchoices.push({
                    value: 'teste',
                    name: 'teste'
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
                        this.showSerie(res.serie)
                    })
            })
            .catch(err => {
                console.log(err)
            })
            .then(() => {
                this.spinner.stop()
            })
    }

    search() {
        cli.prompt([{
            type: "input",
            name: "serie",
            message: chalk.hex("#FFD762").bold('\nDigite o nome da serie: '),
            validate: function (input) {
                let done = this.async();

                setTimeout(function() {
                  if (input.length <= 0) return done('Você precisa digitar algo')
                  
                  done(null, true);
                }, 200);
            }
        }])
        .then(res => {
            this.spinner.start()
   
            let { serie } = res
            axios.get(`https://minhaserieapi.herokuapp.com/search/${serie}`)
                .then(response => {
                    let listchoices = [];
                    let series = response.data.results
                    series.map(serie => {
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
                        this.showSerie(res.serie)
                    })
                    .catch(err => console.log(err))

                })
                .catch(err => console.log(err))
                .then(() => {
                    this.spinner.stop()
                })
        })
        .catch(err => console.log(err))
    }

    showSerie(name) {
        axios.get(`https://minhaserieapi.herokuapp.com/series/${name}`)
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
                console.log(`\nErro ao buscar informações da serie: ${chalk.bold.red(name)}`)
            })
            .then(() => {
                this.spinner.stop()
            })
    }
}

module.exports = new SeriePart()