import { createClient } from 'redis';
import csv from 'csv-parser';
import fs from 'fs';



await client.connect();
// READ CSV INTO STRING
var data = fs.readFileSync("grupo.csv").toLocaleString();

// STRING TO ARRAY
var rows = data.split("\n"); // SPLIT ROWS
console.log(rows[0]);
// for loop from 1 to rows.length
for (var i = 1; i < rows.length; i++) {
	console.log(rows[i]);
	var columns = rows[i].split(","); // SPLIT COLUMNS
	// console.log(columns[0]);
	// console.log(columns[1]);
	client.set(columns[0], columns[1], function(err, reply) {
		console.log(reply);
	}
	);
}

// close the connection to the database
await client.quit();	