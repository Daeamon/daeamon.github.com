var express = require('express');
var app = express();
 
app.configure(function() {
    app.engine('html', require('uinexpress').__express) // ���������� ������� "template" ���������� underscore ��� ����������
    app.set('view engine', 'html')                      
    app.set('views', __dirname + "/tpl");
    app.set("view options", {layout: 'layout.html'});   // ���� layout.html �� ��������� ����� ����������� ��� �������
    app.use(express.static(__dirname + "/public"));     // ������ ����� �� ����� public ���������� �� �����
});

app.get('/', function(req, res){          // ������������ ������ �������� �������� "/"
    //res.render('index.html');
	var walk    = require('walk');
	var files   = [];

	// Walker options
	var walker  = walk.walk('./test', { followLinks: false });

	walker.on('file', function(root, stat, next) {
		// Add this file to the list of files
		files.push(root + '/' + stat.name);
		next();
	});

	walker.on('end', function() {
		console.log(files);
	});
});
/*
app.get('/portfolio', function(req, res){ // ������������ ������ �������� "/portfolio"
    res.render('portfolio.html');
});
*/
var port = process.env.PORT || 5000;       
app.listen(port)                           // ��������� ������ �� 5000 �����, ���� �� ������� ���������� ��������� "port" 
console.log("Listening at " + port)        // ����� � �������, ��� �����������