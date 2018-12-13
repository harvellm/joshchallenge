#!/usr/bin/env node

var Table = require('cli-table2');

const moment = require('moment');
const chalk = require('chalk');
const argv = require('yargs')
    .usage('Usage: $0 --d1 [valid date] --d2 [valid date] --dtFormat [MM-DD-YYY]')
    .default('dtFormat', 'MM-DD-YYY')
    .demandOption(['d1','d2'])
    .argv;

const dtFormat = argv.dtFormat;
const d1 = moment(argv.d1, dtFormat);
const d2 = moment(argv.d2, dtFormat);
if (!d1.isValid()||!d2.isValid()) {
    chalk.red('Date inputs must both match valid dtFormat input (MM-DD-YYYY recommended)');
    return;
}

//d1.day(1) Monday of that week
//d2.day(8) Monday of next week (this is effectively adding one to the number of actual weeks to make it inclusive)

let weeks = [...Array(moment.duration(d2.day(8).diff(d1.day(1))).asWeeks()).keys()].reduce((final,element) => {let thisDate = d1.clone().add(element,'week');final.push({weekNumber:element, startDate:thisDate.day(1).format(dtFormat), endDate:thisDate.day(7).format(dtFormat)}); return final;}, [] );

if(weeks.length>0){
    var table = new Table({
        head: Object.keys(weeks[0])
    });
    weeks.forEach(week=>{
        table.push(Object.values(week));
    });
    console.log(table.toString());
} else {
    console.log('No data to display');
}
  
