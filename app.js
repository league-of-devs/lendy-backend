/*
	                   ,╦▓╣@╦,
	                 ╓▓╣╣╢╩]╣▓                                     ,╦@▓╬╗
	               ╔▓╣╣▓"  ╜`                                    ╔▓╣╣╩,╬╣Ñ
	             ╓▓╣╣Ñ                                         ╔▓╣╣╝╓@╢╩`
	           ,╬╣╣╣                                         ╓▓╣╣╣╬▓╝`
	          ╔╢╣╬"    ,╥#@m²      ╥╬╬╕   ╓#@╖       ╓@@N╥² @╣╣╢Ñ╙  ,╦@╗    ,@▓@,
	         ╬╣╣Ñ   ╓╬╢╢Ñ╜"]╣▓   φ╢╣╢╝,╥▓╢Ñ╫╣╣▓   ╓▓╣╣╩╙"╙╬╢╣╣╝   ,╬╣╣▓╙   ╬╣╣▓"
	        ╬╣╣╜   ╬╣╣╬  ,╓▓╣Ñ ,▓╣╣Ñ╓╬╢▓",▓╣╣Ñ  ╓▓╣▓"    φ╢╣▓`   Æ╣╣╣┘   ┌▓╣╢╜    ╬╝
	       ▓╣╢┘   ╬╣╣ ╫╢╣╢▓╝  ╦╢╣╣╣╬╣Ñ  ╔╢╣╣╜  Æ╣╣╣    g╣╣╣▓   ╓╬╣╣╢`   d╢╣▓    d╣╜
	      ╬╣╣┘    ╣╣╣,    ²╥╬╣Ñ╣╣╣╣▓`  ]╣╣╣╣,╦▓╢╣╢  ╓@╢▓╣╣╣,╓#▓╣╣╣╣╢ ,@╣╣╣▓  ,φ╣╝
	     ╫╣╣╜      ╨▓╣╣╣╣╣╢Ñ╙  "▓╣▓     ╟╢╣╣▓╝  ╟╢╢╣▓╜  ╫╢╣╣╢Ñ" `╫╣╣╣▓╫╣╣╣╓@▓▓╜
	    ╓╣╣╣                                                      ,╦@╬╣╣╣▓╩"
	    ╣╣╣▓╣╣╣╣╣╣╣╣▓@@@@##╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦############%##@@  ,╦▓╣╢╬╣╣╣▓
	╓╬╢╣╣╣╣╢▓Ñ╩╩╨╨╙╙""``                                 ,╬╜  ╢╣╝,g╣╣╢╝
	 ╩╜"                                                      ╫╣╢╣╣╣╝

	-- League of Devs:

	- Árnilsen Arthur Castilho Lopes
	- Daniel Oliveira Nascimento
	- Davi Rodrigues Coelho
	- Pablo Henrique Ramos dos Reis
	- Rafael Freitas 

	-- 11/02/2020
*/

/*
	Require external modules
*/
var express = require('express');
var app = express();
var mysql = require('mysql');
var moment = require('moment');
var bcrypt = require('bcrypt');
require('dotenv').config();

/*
	     _                    
	    / \     _ __    _ __  
	   / _ \   | '_ \  | '_ \ 
	  / ___ \  | |_) | | |_) |
	 /_/   \_\ | .__/  | .__/ 
	           |_|     |_|    
*/


/*
	Main middleware
*/
app.use(express.json())

/*
	Main route
*/
app.use((req, res, next) => 
{
	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	log(ip + " requesting " + req.path);

	return next()
})


/*
	Teste Request
*/
app.post('/', function (req, res) 
{
	var data = req.query;

	
	log("teste");
});

/*
	Register
*/
app.post('/user/register', function (req, res) 
{
	//Get data
	var data = req.body;

	//Get variables
	var email = data.email;
	var name = data.name;
	var password = (data.password != null ? data.password : "");
	var type = data.type;
	var cpf = (data.cpf != null ? data.cpf : "");

	//Check data
	if(!validateEmail(email))
	{
		res.status(400).json({ result: 'error',error: "invalid_email"});
		return;
	}

	if(!validateCpf(cpf))
	{
		res.status(400).json({ result: 'error',error: "invalid_cpf"});
		return;
	}

	if(password.length < 8)
	{
		res.status(400).json({ result: 'error',error: "short_password"});
		return;
	}


	if(password.length > 24)
	{
		res.status(400).json({ result: 'error',error: "long_password"});
		return;
	}

	//Encrypt password
	bcrypt.hash(password, 10, function(err, hash) 
	{
		//Do query
		con.query(sql("INSERT INTO user (email,name,password,type,cpf,date_creation) VALUES ('$email','$name','$hash','$type','$cpf',NOW())",{email: email,name: name,hash: hash,type: type,cpf: cpf}), function (err, result) 
		{
			if(err)
			{
				
				con.query(sql("SELECT id FROM user WHERE email = '$email'",{email: email}), function (err, result, fields) 
				{
					if(result.length > 0)
					{
						res.status(400).json({ result: 'error', error: "email_in_use"});
						return;
					}
					else
					{
						con.query(sql("SELECT id FROM user WHERE cpf = '$cpf'",{cpf: cpf}), function (err, result, fields) 
						{
							if(result.length > 0)
							{
								res.status(400).json({ result: 'error', error: "cpf_in_use"});
								return;
							}
							else
							{
								res.status(400).json({ result: 'error', error: err.code});
								return;
							}
						});	
					}
				});	
			}
			else
			{			
				res.status(201).json({ result: 'success' });
				return;
			}
		});
	});
});

/*
	  ___           _   _     _           _   _                 _     _                 
	 |_ _|  _ __   (_) | |_  (_)   __ _  | | (_)  ____   __ _  | |_  (_)   ___    _ __  
	  | |  | '_ \  | | | __| | |  / _` | | | | | |_  /  / _` | | __| | |  / _ \  | '_ \ 
	  | |  | | | | | | | |_  | | | (_| | | | | |  / /  | (_| | | |_  | | | (_) | | | | |
	 |___| |_| |_| |_|  \__| |_|  \__,_| |_| |_| /___|  \__,_|  \__| |_|  \___/  |_| |_|	                                                                                    
*/

/*
	MySQL
*/
var con = mysql.createConnection(
{
	host    : 'localhost',
	user    : 'root',
	password: '',
	database: 'lendy',
});

con.connect();

/*
	App Listening
*/
app.listen(3000, function () 
{
	log('Server listening on port 3000');
});

/*
	Log message in console
*/
function log(msg)
{
	console.log("[" + moment().format('MM/DD/YYYY HH:mm:ss') + "] " + msg);
}

/*
	Create sql query
*/
function sql(query,values)
{
	let s = query;
	let ks = Object.keys(values);

	for(let k in ks)
	{
		s = s.replace("$" + ks[k],values[ks[k]]);
	}

	return s;
}

/*
	Email validation system
	//https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
*/
function validateEmail(email) 
{
    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
}

/*
	CPF validation system
	https://www.devmedia.com.br/validar-cpf-com-javascript/23916
*/
function validateCpf(strCPF) 
{
	var Soma;
	var Resto;
	Soma = 0;
	if (strCPF == "00000000000") return false;

	if(strCPF.length != 11)
		return;

	for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
		Resto = (Soma * 10) % 11;

	if ((Resto == 10) || (Resto == 11))  Resto = 0;
		if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

	Soma = 0;
	for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
		Resto = (Soma * 10) % 11;

	if ((Resto == 10) || (Resto == 11))  Resto = 0;
	if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
	return true;
}