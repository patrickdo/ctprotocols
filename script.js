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
		CSVLines[i] = CSVLines[i].csvToArray();
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


String.prototype.csvToArray = function (o) {
    var od = {
        'fSep': ',',
        'rSep': '\r\n',
        'quot': '"',
        'head': false,
        'trim': false
    };
    if (o) {
        for (var i in od) {
            if (!o[i]) o[i] = od[i];
        }
    } else {
        o = od;
    }
    var a = [
        ['']
    ];
    for (var r = f = p = q = 0; p < this.length; p++) {
        switch (c = this.charAt(p)) {
        case o.quot:
            if (q && this.charAt(p + 1) == o.quot) {
                a[r][f] += o.quot;
                ++p;
            } else {
                q ^= 1;
            }
            break;
        case o.fSep:
            if (!q) {
                if (o.trim) {
                    a[r][f] = a[r][f].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                }
                a[r][++f] = '';
            } else {
                a[r][f] += c;
            }
            break;
        case o.rSep.charAt(0):
            if (!q && (!o.rSep.charAt(1) || (o.rSep.charAt(1) && o.rSep.charAt(1) == this.charAt(p + 1)))) {
                if (o.trim) {
                    a[r][f] = a[r][f].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                }
                a[++r] = [''];
                a[r][f = 0] = '';
                if (o.rSep.charAt(1)) {
                    ++p;
                }
            } else {
                a[r][f] += c;
            }
            break;
        default:
            a[r][f] += c;
        }
    }
    if (o.head) {
        a.shift();
    }
    if (a[a.length - 1].length < a[0].length) {
        a.pop();
    }
    return a;
};
