const express = require("express");
const csv = require('csv-parser');
const fs = require('fs');
const { send } = require("process");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();

let array = [];

fs.createReadStream('./test-file.csv')
  .pipe(csv())
  .on('data', (row) => {
    array.push(row)
  })
  .on('end', () => {
    console.log("array: ", array)
  });

  const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
      {id: 'song', title: 'Song'},
      {id: 'album', title: 'Album'},
      {id: 'singer', title: 'Singer'},
    ]
  });

  const data = [
    {
      song: 'So Good',
      album: 'So Good Single',
      singer: 'Halsey'
    },
    {
      song: '2Step',
      album: '2Step Single',
      singer: 'Ed Sheeran'
    },
    {
      song: 'Doin\' This',
      album: 'Growin\' Up',
      singer: 'Luke Combs'
    }
  ]

  csvWriter
    .writeRecords(data)
    .then(() => {
      console.log("The CSV file was written successfully");
    })

app.get("/users", (req, res, next) => {
  res.json(array);
});

app.get("/names", (req, res, next) => {
  let names = []
  array.map((el) => {
    names.push(el.Name + el.LastName)
  })
  res.json(names);
})

app.get("/download", (req, res) => {
  res.download('./out.csv', function(err) {
    if(err) {
      console.log(err);
    }
  })
})

app.listen(3000, () => {
  console.log("Server's up!");
});