// ORIGINAL
// var options = {
// 	valueNames: ['protNum', 'protDesc', 'protIndic', 'protMDCT']
// };

// var protocolList = new List('protocolDIV', options);

// STUFF THAT WORKS

var options = {
	valueNames: ['protNum', 'protDesc', 'protIndic', 'protMDCT']
};

var values = [
	{protNum: '285', protDesc: 'Stockholm', protIndic: 'indication', protMDCT: 'MDCT protocol'}
];

var protocolList = new List('protocolDIV', options);
protocolList.remove({protNum: '0'});

protocolList.add({
	protNum: '284',
	protDesc: 'descrip',
	protIndic: 'indication',
	protMDCT: 'mdct protocol'
});

protocolList.add(values);

var CSVProtocols = new XMLHttpRequest();
CSVProtocols.open('GET', 'ctprotocols.csv');
CSVProtocols.onreadystatechange = function() {
	alert(CSVProtocols.responseText);
};
CSVProtocols.send();





