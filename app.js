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
var nodemailer = require('nodemailer');

/*
	Main variables
*/
var defaultstars = 2;	//Default stars on register
var mailtransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'XXXXX@XXXXXXXXX',
    pass: 'XXXXXXXXX'
  },
  secure: false,
  tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    },
});

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
	var email = (data.email != null ? data.email : "");
	var name = (data.name != null ? data.name : "");
	var password = (data.password != null ? data.password : "");
	var type = 0; //(data.type != null ? data.type : "");
	var cpf = (data.cpf != null ? data.cpf : "");

	var regex = /^[a-zA-Z ]{2,30}$/;


	if(regex.test(name))
	{
		res.status(400).json({ result: 'error', error: "invalid_name"});
		return;
	}

	//Check data
	if(!validateEmail(email))
	{
		res.status(400).json({ result: 'error', error: "invalid_email"});
		return;
	}

	if(!validateCpf(cpf))
	{
		res.status(400).json({ result: 'error', error: "invalid_cpf"});
		return;
	}

	if(password.length < 8)
	{
		res.status(400).json({ result: 'error', error: "short_password"});
		return;
	}


	if(password.length > 24)
	{
		res.status(400).json({ result: 'error', error: "long_password"});
		return;
	}

	//Encrypt password
	bcrypt.hash(password, 10, function(err, hash) 
	{
		//Do query
		con.query(sql("INSERT INTO user (email,name,type,password,cpf,created_at,status,rating) VALUES ('$email','$name',$type,'$hash','$cpf',NOW(),1,$defaultstars)",{email: email,name: name,hash: hash,type: type,cpf: cpf,defaultstars: defaultstars}), function (err, result) 
		{
			if(err)
			{
				
				con.query(sql("SELECT id FROM user WHERE email = '$email'",{email: email}), function (errb, result, fields) 
				{
					if(result.length > 0)
					{
						res.status(400).json({ result: 'error', error: "email_in_use"});
						return;
					}
					else
					{
						con.query(sql("SELECT id FROM user WHERE cpf = '$cpf'",{cpf: cpf}), function (errb, result, fields) 
						{
							if(result.length > 0)
							{
								res.status(400).json({ result: 'error', error: "cpf_in_use"});
								return;
							}
							else
							{
								res.status(400).json({ result: 'error', error: err});
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
	Login
*/
app.post('/user/login', function (req, res) 
{
	//Get data
	var data = req.body;

	//Get variables
	var email = (data.email != null ? data.email : "");
	var password = (data.password != null ? data.password : "");

	//Do query
	con.query(sql("SELECT id,password,status FROM user WHERE email = '$email'",{email: email}), function (err, result, fields) 
	{
		if(result.length > 0)
		{
			if(result[0].status == "0")
			{
				res.status(400).json({ result: 'error', error: "account_disabled"});
				return;
			}

			bcrypt.compare(password, result[0].password, function(err, result) {
			    if(result)
			    {
			    	var token = generateToken(30);

			    	con.query(sql("UPDATE user SET token= '$token',last_login = NOW() WHERE email = '$email'",{email: email,token: token}), function (err, result, fields)
			    	{
			    		if(err)
			    		{
							res.status(500).json({ result: 'error', error: "cant_login"});
							return;
			    		}
			    		else
			    		{
							res.status(200).json({ result: 'success', token: token});
							return;
			    		}
			    	});
			    }
			    else
			    {
			    	res.status(400).json({ result: 'error', error: "wrong_password"});
					return;
			    }
			});
		}
		else
		{
			res.status(400).json({ result: 'error', error: "invalid_email"});
			return;
		}
	});
});

/*
	Forgot password
*/
app.post('/user/forgotpassword', function (req, res) 
{
	//Get data
	var data = req.body;

	//Get variables
	var email = (data.email != null ? data.email : "");
	var token = generateToken(48);

	var mailOptions = 
	{
		from: 'oficial.leagueofdev@gmail.com',
		to: email,
		subject: 'Solicitação de Redefinição de Senha',
		text: 'That was easy!'
	};

	mailtransporter.sendMail(mailOptions, function(error, info)
	{
		if (error) 
		{
			res.status(400).json({ result: 'error', error: error});
		} 
		else 
		{
			res.status(200).json({ result: 'success'});
		}
	});
});

/*
	Get user profile info
*/
/*
app.post('/user/profileinfo', function (req, res) 
{
	//Get data
	var data = req.body;

	//Get variables
	var email = (data.email != null ? data.email : "");

	//Do query
	con.query(sql("SELECT name,date_creation,country,city,stars FROM user WHERE email = '$email'",{email: email}), function (err, result, fields) 
	{
		if(result.length > 0)
		{
			//Format date
			var jsDate = new Date(Date.parse((result[0].date_creation + "").replace(/[-]/g,'/')));
			result[0].date_creation = jsDate.toUTCString();

			//TO-DO: Get number of lends
			res.status(400).json({ result: 'success', data: result[0]});
			return;
		}
		else
		{
			res.status(400).json({ result: 'error', error: "invalid_user"});
			return;
		}
	});
});
*/

/*
	Set user address
*/
/*
app.post('/user/updateaddress', function (req, res) 
{
	//Get data
	var data = req.body;

	//Get variables
	var token = data.token;
	var state = (data.state != null ? data.state : "");
	var city = (data.city != null ? data.city : "");
	var chunk = (data.chunk != null ? data.chunk : "");
	var street = (data.stret != null ? data.stret : "");	
	var number = (data.number != null ? data.number : "");
	var complement = (data.complement != null ? data.complement : "");
	var cep = (data.cep != null ? data.cep : "");

});
*/

/*
	Get user simple info
	TO-DO in future
*/
/*
app.post('/user/simpleinfo', function (req, res) 
{
	//Get data
	var data = req.body;

	//Get variables
	var email = (data.email != null ? data.email : "");

	//Do query
	con.query(sql("SELECT name,date_creation,country,city,stars FROM user WHERE email = '$email'",{email: email}), function (err, result, fields) 
	{
		if(result.length > 0)
		{
			res.status(400).json({ result: 'success', data: result[0]});
			return;
		}
		else
		{
			res.status(400).json({ result: 'error', error: "invalid_user"});
			return;
		}
	});
});
*/

/*
	Get user profile image
	TO-DO in future
*/
/*
app.post('/user/profileimage', function (req, res) 
{
	//Get data
	var data = req.body;

	//Get variables
	var email = (data.email != null ? data.email : "");

	con.query(sql("SELECT profileimage FROM user WHERE email = '$email'",{email: email}), function (err, result, fields) 
	{
		if(result.length > 0)
		{
			res.status(400).json({ result: 'success', data: result[0].profileimage});
			return;
		}
		else
		{
			res.status(400).json({ result: 'error', error: "invalid_user"});
			return;
		}
	});
});
*/


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
	Generate token
*/
function generateToken(length) 
{
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) 
	{
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
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