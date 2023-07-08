import { createClient } from 'redis';
import csv from 'csv-parser';
import fs from 'fs';



function storeNumbersToCSV(numbers, filename) {

}





async function loadDatabase(percentage_of_load) {
	// returns the number of rows loaded



	const client = createClient({
	password: '',
	socket: {
		host: 'redis-13013.c14.us-east-1-3.ec2.cloud.redislabs.com',
		port: 13013,
	},
	});


	await client.connect();
	// flush the database
	client.flushAll();

	// load the database
	// READ CSV INTO STRING
	var data = fs.readFileSync("grupo.csv").toLocaleString();

	// STRING TO ARRAY
	var rows = data.split("\n"); // SPLIT ROWS
	// for loop from 1 to rows.length
	for (var i = 1; i < rows.length; i++) {
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
	return rows.length*percentage_of_load;
}

const client = createClient({
password: '',
socket: {
	host: 'redis-13013.c14.us-east-1-3.ec2.cloud.redislabs.com',
	port: 13013,
},
});


for (var j = 0; j < 7; j++) {
	const percentage_of_load = 0.3 + j*0.1;
	const number_of_rows = await loadDatabase(percentage_of_load);

	await client.connect();
	// we want to test the time it takes to query a value from a recursive relationship in a graph and 
	// getting the father node and the child node
	// redis has the values cod_grupo:cod_grupo_padre loaded in the database
	const TEST_RUNS = 100;
	// get a list of keys 
	const keys = await client.keys("*");
	console.log(keys);
	// time of the i query
	const results = [];
	// random key

	for (var i = 0; i < TEST_RUNS; i++) {
		var start = new Date();
		var random_key = keys[Math.floor(Math.random() * keys.length)];
		var value = await client.get(random_key);
		// calculate the time it took to get the value
		var end = new Date() - start;
		results.push(end);
	}

	await client.quit();

	// store the results in a csv file
	const file = fs.createWriteStream(`results${percentage_of_load}.csv`);
	file.on('error', function(err) { /* error handling */ });
	results.forEach(function(v) { file.write(v + '\n'); });
	file.end();
	
	console.log("success: stored results in csv file for percentage of load: " + percentage_of_load );
	
}
