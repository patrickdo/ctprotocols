// ORIGINAL
// var options = {
// 	valueNames: ['protNum', 'protDesc', 'protIndic', 'protMDCT']
// };

// var protocolList = new List('protocolDIV', options);

// STUFF THAT WORKS

var options = {
	valueNames: ['protNum', 'protDesc', 'protIndic', 'protMDCT']
};

// var values = [
// 	{protNum: '285', protDesc: 'Stockholm', protIndic: 'indication', protMDCT: 'MDCT protocol'}
// ];

var protocolList = new List('protocolDIV', options);
protocolList.remove({protNum: '0'});

// protocolList.add({
// 	protNum: '284',
// 	protDesc: 'descrip',
// 	protIndic: 'indication',
// 	protMDCT: 'mdct protocol'
// });

// protocolList.add(values);

// CSV STUFF

var CSVProtocols = new XMLHttpRequest();
CSVProtocols.open('GET', 'ctprotocols.csv', true);
CSVProtocols.send();
var CSVText = '', CSVLines = [];

		CSVLines = CSVProtocols.responseText.split('\n');
		parseCSV();
		addProtocols();

CSVProtocols.onreadystatechange = function() {
	if (CSVProtocols.readyState == 4) {	// have to wait for AJAX call to complete
		CSVLines = CSVProtocols.responseText.split('\n');
		parseCSV();
		addProtocols();
	}
};

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

function parseCSV() {
	var i, len;
	for (i = 0, len = CSVLines.length; i < len; i++) {
		CSVLines[i] = parseCSV2(CSVLines[i]);
	}
}

function CSVtoArray(text) {
	var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
	var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
	// Return NULL if input string is not well formed CSV string.
	if (!re_valid.test(text)) return null;
	var a = [];	// Initialize array to receive values.
	text.replace(re_value,	// "Walk" the string using replace with callback.
		function(m0, m1, m2, m3) {
			// Remove backslash from \' in single quoted values.
			if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
			// Remove backslash from \" in double quoted values.
			else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
			else if (m3 !== undefined) a.push(m3);
			return '';	// Return empty string.
		});
	// Handle special case of empty last value.
	if (/,\s*$/.test(text)) a.push('');
	return a;
}


function parseCSV2(str) {
    var arr = [];
    var quote = false;  // true means we're inside a quoted field

    // iterate over each character, keep track of current row and column (of the returned array)
    for (var row = col = c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];        // current character, next character
        arr[row] = arr[row] || [];             // create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') { quote = !quote; continue; }

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == ',' && !quote) { ++col; continue; }

        // If it's a newline and we're not in a quoted field, move on to the next
        // row and move to column 0 of that new row
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }
    return arr;
}
