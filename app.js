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

/*
	     _                    
	    / \     _ __    _ __  
	   / _ \   | '_ \  | '_ \ 
	  / ___ \  | |_) | | |_) |
	 /_/   \_\ | .__/  | .__/ 
	           |_|     |_|    
*/

/*
	Teste Request
*/
app.get('/', function (req, res) 
{
	var data = req.query;

	res.json({ username: 'Flavioa' });
	log("teste");
});

/*
	Register
*/
app.get('/register', function (req, res) 
{
	var data = req.query;

	var email = data.email;
	var password = data.password;
	var type = data.type;

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
	host     : 'localhost',
	user     : 'root',
	password : '',
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

function log(msg)
{
	console.log("[" + moment().format('MM/DD/YYYY HH:mm:ss') + "] " + msg);
}
