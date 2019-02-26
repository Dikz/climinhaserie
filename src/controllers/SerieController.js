const cli = require('inquirer')
const axios = require('axios')
const chalk = require('chalk')
const Table = require('cli-table')

let serieTable = new Table({
    style: {
        'padding-left': 1,
        'padding-right': 1
    }
})

class SeriePart {
    top() {
        axios.get('http://minhaserieapi.herokuapp.com/series')
            .then(res => {
                let listchoices = [];
                res.data.results.map(serie => {
                    let add = {
                        value: serie.name,
                        name: serie.title
                    }
                    listchoices.push(add)
                })
                cli.prompt([{
                        type: "list",
                        name: "serie",
                        message: chalk.hex("#FFD762").bold("Escolha a serie: "),
                        choices: listchoices
                    }])
                    .then(res => {
                        //console.log(res.serie)
                        axios.get(`https://minhaserieapi.herokuapp.com/serie/${res.serie}`)
                            .then(res => {
                                let serie = res.data;

                                console.log("\n\n  📺 Informações da serie: \n")
                                //console.log(chalk.hex("#9e82a8").bold("Titulo: "), chalk.white(serie.title))
                                //console.log(chalk.hex("#9e82a8").bold("Categoria: "), chalk.white(serie.category))
                                //console.log(chalk.hex("#9e82a8").bold("Lançamento:\n"), chalk.white(serie.debut))
                                //console.log(chalk.hex("#9e82a8").bold("Visitas: "), chalk.white(`${serie.visits} visitas.`))
                                //console.log(chalk.hex("#9e82a8").bold("Descrição:\n"), chalk.white(serie.description))
                                //console.log(chalk.hex("#9e82a8").bold("Link: "), chalk.white(serie.link))
                                serieTable.push(
                                    [chalk.hex("#9e82a8").bold("Titulo:"), chalk.white(serie.title)],
                                    [chalk.hex("#9e82a8").bold("Categoria:"), chalk.white(serie.category)],
                                    [chalk.hex("#9e82a8").bold("Lançamento:"), chalk.white(serie.debut)],
                                    [chalk.hex("#9e82a8").bold("Visitas:"), chalk.white(serie.visits)],
                                    [chalk.hex("#9e82a8").bold("Link:"), chalk.white(serie.link)],
                                    //[serie.description]
                                )
                                console.log(serieTable.toString())
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }
}

module.exports = new SeriePart()