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

var xmlDoc = loadXMLDoc('test.xml');
// alert(xmlDoc.documentElement.nodeName);





function loadXMLDoc(XMLname) {
	var xmlDoc;

	if (window.XMLHttpRequest) {
		xmlDoc = new window.XMLHttpRequest();
		xmlDoc.open("GET", XMLname, false);
		xmlDoc.overrideMimeType('text/xml');
		xmlDoc.send("");
		return xmlDoc.responseXML;
	}

	// IE 5 and IE 6
	else if (ActiveXObject("Microsoft.XMLDOM")) {
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = false;
		xmlDoc.load(XMLname);
		return xmlDoc;
	}
	else {
		xmlhttp = new XMLHttpRequest();

		//Open the file using the GET routine
		xmlhttp.open("GET", XMLname, false);

		xmlhttp.overrideMimeType('text/xml');

		//Send request
		xmlhttp.send(null);

		//xmlDoc holds the document information now
		return xmlDoc.responseXML;
	}

	return null;
}










// XML STUFF THAT DOESN'T WORK
// xmlhttp = new XMLHttpRequest();
// xmlhttp.open('GET', 'test.xml', false);
// xmlhttp.send();
// xmlDoc = xmlhttp.responseXML;

// console.log(xmlDoc.getElementsByTagName('from')[0].childNodes[0].nodeValue);
