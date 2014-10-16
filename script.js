var options = {
	valueNames: ['protNum', 'protDesc', 'protIndic', 'protMDCT'],
	page: [2000]
};

var protocolList = new List('protocolDIV', options);
protocolList.remove('protNum', '0');	// remove first blank entry (template)

// CSV STUFF
var CSVProtocols = new XMLHttpRequest(), CSVText = '', CSVLines = [];
CSVProtocols.open('GET', 'ctprotocols.csv', true);
CSVProtocols.overrideMimeType("text/plain");
CSVProtocols.send();

CSVProtocols.onreadystatechange = function() {
	if (CSVProtocols.readyState === 4) {	// have to wait for AJAX call to complete
		CSVLines = CSVProtocols.responseText.split('\n');
		parseCSV();
		addProtocols();
	}
};

function parseCSV() {
	var i, len;
	for (i = 1, len = CSVLines.length; i < len; i++) {
		CSVLines[i] = CSVtoArray(CSVLines[i]);
	}
}

function addProtocols() {
	var i, len;
	for (i = 1, len = CSVLines.length; i < len; i++) {
		protocolList.add({
			protNum: CSVLines[i][0],
			protDesc: CSVLines[i][1],
			protIndic: CSVLines[i][2],
			protMDCT: CSVLines[i][3]
		});
	}
}

function CSVtoArray(data, delimiter) {
	// Retrieve the delimiter
	if (delimiter === undefined) {
		delimiter = ',';
	}
	if (delimiter && delimiter.length > 1) {
		delimiter = ',';
	}

	// initialize variables
	var	newline = '\n',
		eof = '',
		i = 0,
		c = data.charAt(i),
		array = [];

	while (c != eof) {
		// get value
		var value = "";
		if (c == '\"') {
			// value enclosed by double-quotes
			c = data.charAt(++i);

			do {
				if (c != '\"') {
					// read a regular character and go to the next character
					value += c;
					c = data.charAt(++i);
				}

				if (c == '\"') {
					// check for escaped double-quote
					var cnext = data.charAt(i+1);
					if (cnext == '\"') {
						// this is an escaped double-quote.
						// Add a double-quote to the value, and move two characters ahead.
						value += '\"';
						i += 2;
						c = data.charAt(i);
					}
				}
			} while (c != eof && c != '\"');

			if (c == eof) {
				throw "Unexpected end of data, double-quote expected";
			}

			c = data.charAt(++i);
		} else {
			// value without quotes
			while (c != eof && c != delimiter && c!= newline && c != '\t' && c != '\r') {
				value += c;
				c = data.charAt(++i);
			}
		}

		array.push(value);

		// unexpected character
		if (c !== delimiter && c != eof) {
			throw "Delimiter expected after character " + i;
		}

		// go to the next character
		c = data.charAt(++i);
	}

	return array;
}
