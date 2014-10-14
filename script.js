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
		CSVLines[i] = CSVToArray(CSVLines[i]);
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


    function CSVToArray( strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
            );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
                ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        return( arrData );
    }
