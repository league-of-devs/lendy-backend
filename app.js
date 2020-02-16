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
var request = require("request")

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

	//Validate token
	if(req.path != "/user/register" && req.path != "user/login")
	{
		var token = req.headers.get('authorization');

		if(token == "")
		{
			res.status(401).json({ result: 'error', error: "invalid_token"});
			return;
		}

		con.query(sql("SELECT id,max_offers FROM user WHERE token = '$token'",{token: token}), function (err, result) 
		{
			if(err)
			{
				res.status(401).json({ result: 'error', error: "internal_server_error"});
				return;
			}

			if(result.length == 0)
			{
				res.status(401).json({ result: 'error', error: "invalid_token"});
				return;
			}
			else
			{
				req.body.user_id = result[0].id + "";
				req.body.max_offers = result[0].max_offers + "";
				
				return next();
			}
		});
	}

	return;
});

/*      _   _                     
  _    | | | |  ___    ___   _ __ 
 (_)   | | | | / __|  / _ \ | '__|
  _    | |_| | \__ \ |  __/ | |   
 (_)    \___/  |___/  \___| |_|   

*/

/*
	Register User
	Falta: tratar as variáveis de endereço
	https://viacep.com.br/ws/00000000/json/
*/
app.post('/user/register', function (req, res) 
{
	//Get data
	var data = req.body;

	var email = data.get("email");
	var name = data.get("name"); 
	var cpf = data.get("cpf");
	var password = data.get("password");
	var status = 1;
	var type = 0;

	var addr_country = "";
	var addr_state = "";
	var addr_city = "";
	var addr_neighborhood = "";
	var addr_cep = data.get("addr_cep");
	var addr_street = "";
	var addr_number = data.get("addr_number");
	var addr_complement = data.get("addr_complement");

	var rating = 0;
	var max_offers = 5;
	var image = "";

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

	request({
    	url: "https://brasilapi.com.br/api/cep/" + addr_cep ,
    	json: true
	}, function (error, response, body) {

	    if (!error && response.statusCode === 200) 
	    {
	        if(body.error == null)
	        {
	        	addr_country = "Brasil";
	        	addr_state = body.state;
	        	addr_street = body.street;
	        	addr_city = body.city;
	        	addr_neighborhood = body.neighborhood;

	        	if(isNaN(addr_number) || addr_number == "")
	        	{
	        		res.status(400).json({ result: 'error', error: "invalid_address_number"});
	        		return;
	        	}
  
	        	if(addr_complement > 8)
	        	{
	        		res.status(400).json({ result: 'error', error: "invalid_complement"});
	        		return;
	        	}

	        	//Encrypt password
				bcrypt.hash(password, 10, function(err, hash) 
				{
					//Do query
					con.query(sql("INSERT INTO user (email,name,cpf,password,status,type,addr_country,addr_state,addr_city,addr_neighborhood,addr_cep,addr_street,addr_number,addr_complement,rating,image,created_at,updated_at,max_offers) VALUES ('$email','$name','$cpf','$password','$status','$type','$addr_country','$addr_state','$addr_city','$addr_neighborhood','$addr_cep','$addr_street','$addr_number','$addr_complement','$rating','$image',NOW(),NOW(),$max_offers)",{max_offers: max_offers,email: email,name: name,cpf: cpf,password: hash,status: status,type: type,addr_country: addr_country,addr_state: addr_state,addr_city: addr_city,addr_neighborhood: addr_neighborhood,addr_cep: addr_cep,addr_street: addr_street,addr_number: addr_number,addr_complement: addr_complement,rating: rating,image: image}), function (err, result) 
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
	        }
	    }
	    else
	    {
	    	res.status(400).json({ result: 'error', error: "invalid_cep"});
	    	return;
	    }
	})

	
});

/*
	Login
*/
app.post('/user/login', function (req, res) 
{
	//Get data
	var data = req.body;

	//Get variables
	var cpf = (data.cpf != null ? data.cpf : "");
	var password = (data.password != null ? data.password : "");

	//Do query
	con.query(sql("SELECT id,password,status FROM user WHERE cpf = '$cpf'",{cpf: cpf}), function (err, result, fields) 
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

			    	con.query(sql("UPDATE user SET token= '$token',last_login = NOW() WHERE cpf = '$cpf'",{cpf: cpf,token: token}), function (err, result, fields)
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
			res.status(400).json({ result: 'error', error: "invalid_cpf"});
			return;
		}
	});
});

/*      ____                                        _   
  _    |  _ \    ___    __ _   _   _    ___   ___  | |_ 
 (_)   | |_) |  / _ \  / _` | | | | |  / _ \ / __| | __|
  _    |  _ <  |  __/ | (_| | | |_| | |  __/ \__ \ | |_ 
 (_)   |_| \_\  \___|  \__, |  \__,_|  \___| |___/  \__|
                          |_|                           
*/

/*
 Create a request
*/
app.post('/request/create', function (req, res) 
{
	//Get data
	var data = req.body;

	var active = 1;
	
	var value = data.get("value");
	var fee = data.get("fee");
	var days = data.get("days");

	var from_user = data.get("user_id");

	if(value == "" || isNaN(value))
	{
		res.status(400).json({ result: 'error', error: "invalid_value"});
		return;
	}

	if(fee == "" || isNaN(fee))
	{
		res.status(400).json({ result: 'error', error: "invalid_fee"});
		return;
	}

	if(days == "" || isNaN(days))
	{
		res.status(400).json({ result: 'error', error: "invalid_days"});
		return;
	}


	con.query(sql("INSERT INTO request (active,from_user,value,fee,days,created_at,updated_at) VALUES ('$active','$from_user','$value','$fee','$days',NOW(),NOW()) ",{active: active,from_user: from_user,value: value,fee: fee,days: days}), function (err, result, fields)
	{
		if(err)
		{
			res.status(400).json({ result: 'error', error: err.code});
			return;
		}
		else
		{	
			res.status(201).json({ result: 'success', id: result.insertId});
			return;
		}
	});
	
});

/*
	List my active requests
*/
app.get('/request/my_requests', function (req, res) 
{
	//Get data
	var data = req.body;

	var from_user = data.get("user_id");

	con.query(sql("SELECT * FROM request WHERE from_user='$from_user' AND active=1 ",{from_user: from_user}), function (err, result, fields)
	{
		if(err)
		{
			res.status(400).json({ result: 'error', error: err.code});
			return;
		}
		else
		{
			for(var i = 0; i < result.length; i ++)
			{
				result[i].created_at = fixDate(result[i].created_at);
				result[i].updated_at = fixDate(result[i].updated_at);
			}

			res.status(201).json({ result: 'success', list: result});
			return;
		}
	});
});

/*       ___     __    __               
  _     / _ \   / _|  / _|   ___   _ __ 
 (_)   | | | | | |_  | |_   / _ \ | '__|
  _    | |_| | |  _| |  _| |  __/ | |   
 (_)    \___/  |_|   |_|    \___| |_|   

*/

/*
	Create offer
*/
app.post('/offer/create', function (req, res) 
{
	//Get data
	var data = req.body;

	var active = 1;
	
	var value = data.get("value");
	var fee = data.get("fee");
	var days = data.get("days");

	var from_user = data.get("user_id");

	if(value == "" || isNaN(value))
	{
		res.status(400).json({ result: 'error', error: "invalid_value"});
		return;
	}

	if(fee == "" || isNaN(fee))
	{
		res.status(400).json({ result: 'error', error: "invalid_fee"});
		return;
	}

	if(days == "" || isNaN(days))
	{
		res.status(400).json({ result: 'error', error: "invalid_days"});
		return;
	}

	//Count active requests of user
	con.query(sql("SELECT COUNT(id) AS count FROM offer WHERE from_user=$from_user AND active = 1",{from_user: from_user}), function (err, result, fields){
		
		if(err)
		{
			res.status(400).json({ result: 'error', error: err.code});
			return;
		}

		//Created offers
		var count = result[0].count;
		
		if(count >= data.max_offers)
		{
			res.status(400).json({ result: 'error', error: "offers_limit_reached"});
			return;
		}

		con.query(sql("INSERT INTO offer (active,from_user,value,fee,days,created_at,updated_at) VALUES ('$active','$from_user','$value','$fee','$days',NOW(),NOW()) ",{active: active,from_user: from_user,value: value,fee: fee,days: days}), function (err, result, fields)
		{
			if(err)
			{
				res.status(400).json({ result: 'error', error: err.code});
				return;
			}
			else
			{	
				res.status(201).json({ result: 'success', id: result.insertId});
				return;
			}
		});
	});	
});

/*
	List my active offers
*/
app.get('/offer/my_offers', function (req, res) 
{
	//Get data
	var data = req.body;

	var from_user = data.get("user_id");

	con.query(sql("SELECT * FROM offer WHERE from_user='$from_user' AND active=1 ",{from_user: from_user}), function (err, result, fields)
	{
		if(err)
		{
			res.status(400).json({ result: 'error', error: err.code});
			return;
		}
		else
		{
			for(var i = 0; i < result.length; i ++)
			{
				result[i].created_at = fixDate(result[i].created_at);
				result[i].updated_at = fixDate(result[i].updated_at);
			}

			res.status(201).json({ result: 'success', list: result});
			return;
		}
	});
});

/*
	Get offers for request
*/
app.get('/offer/search', function (req, res) 
{
	//Get data
	var data = req.body;

	var min_value = data.get("min_value");
	var max_fee = data.get("max_fee");
	var min_days = data.get("min_days");

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

*/

/*
	Variable helper
*/
Object.prototype.get = function(key)
{
	return this[key] == null ? "" : this[key].trim();
}

function fixDate(date)
{
	return date;
	//var jsDate = new Date(Date.parse((date + "").replace(/[-]/g,'/')));
	//return jsDate.toUTCString();
}

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
		s = s.split("$" + ks[k]).join(values[ks[k]]);
		//s = s.replace("$" + ks[k],values[ks[k]]);
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