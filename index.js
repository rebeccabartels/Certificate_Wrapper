//Load and instantiate node-openssl-cert
const node_openssl = require('node-openssl-cert');
const openssl = new node_openssl();
const fs = require('fs');
//openssl executable is already in path, so we can generate a RSA private key. 
//If not in path, consult docs https://github.com/lspiehler/node-openssl-cert
//*************************************************************
//Generate an RSA privatekey with the default options and show 
//the openssl command used to create it. Will return in terminal backend.
openssl.generateRSAPrivateKey({}, function(err, key, cmd) {
	console.log(cmd);
	console.log(key);
});

//Generate an RSA private key with custom options and show 
//the openssl command used to create it. Will return in terminal backend.
var rsakeyoptions = {
	encryption: {
		password: 'test',
		cipher: 'des3'
	},
	rsa_keygen_bits: 2048,
	rsa_keygen_pubexp: 65537,
	format: 'PKCS8'
}

openssl.generateRSAPrivateKey(rsakeyoptions, function(err, key, cmd) {
	console.log(cmd);
	console.log(key);
});
//Generating a private key with custom options and using it to 
//generate a CSR showing the commands for both and the openssl config for the CSR.

var rsakeyoptions = {
	encryption: {
		password: 'test',
		cipher: 'des3'
	},
	rsa_keygen_bits: 2048,
	rsa_keygen_pubexp: 65537,
	format: 'PKCS8'
}

var csroptions = {
	hash: 'sha512',
	subject: {
		countryName: 'Arda',
		stateOrProvinceName: 'Oregon',
		localityName: 'The Shire',
		postalCode: '092831',
		streetAddress: 'Baggend',
		organizationName: 'The Shire Inc.',
		organizationalUnitName: 'Middle Earth',
		commonName: [
			'certificatetools.com',
			'www.certificatetools.com'
		],
		emailAddress: 'thenetworknightowl@proton.me'
	},
	extensions: {
		basicConstraints: {
			critical: true,
			CA: true,
			pathlen: 1
		},
		keyUsage: {
			//critical: false,
			usages: [
				'digitalSignature',
				'keyEncipherment'
			]
		},
		extendedKeyUsage: {
			critical: true,
			usages: [
				'serverAuth',
				'clientAuth'
			]	
		},
		SANs: {
			DNS: [
				'certificatetools.com',
				'www.certificatetools.com'
			]
		}
	}
}

openssl.generateRSAPrivateKey(rsakeyoptions, function(err, key, cmd) {
	console.log(cmd);
	console.log(key);
	openssl.generateCSR(csroptions, key, 'test', function(err, csr, cmd) {
		if(err) {
			console.log(err);
		} else {
			console.log(cmd.command);
			console.log(csr);
			console.log(cmd.files.config);
		}
			
	});
});


//Import an existing RSA private key with password test and generate a CSR using it

var csroptions = {
	hash: 'sha512',
	subject: {
		countryName: 'Arda',
		stateOrProvinceName: 'Oregon',
		localityName: 'The Shire',
		postalCode: '092831',
		streetAddress: 'Baggend',
		organizationName: 'The Shire Inc.',
		organizationalUnitName: 'Middle Earth',
		commonName: [
			'certificatetools.com',
			'www.certificatetools.com'
		],
		emailAddress: 'thenetworknightowl@proton.me'
	},
	extensions: {
		basicConstraints: {
			critical: true,
			CA: true,
			pathlen: 1
		},
		keyUsage: {
			//critical: false,
			usages: [
				'digitalSignature',
				'keyEncipherment'
			]
		},
		extendedKeyUsage: {
			critical: true,
			usages: [
				'serverAuth',
				'clientAuth'
			]	
		},
		SANs: {
			DNS: [
				'certificatetools.com',
				'www.certificatetools.com'
			]
		}
	}
}

//make sure you store your key first so the fs module can fetch the right object, else you'll get a undefined data type error. 
fs.readFile('./test/rsa.key', function(err, contents) {
    openssl.importRSAPrivateKey(contents, 'test', function(err, key, cmd) {
		openssl.generateCSR(csroptions, key, 'test', function(err, csr, cmd) {
			if(err) {
				console.log(err);
			} else {	
				console.log(csr);
			}
				
		});
	});
});