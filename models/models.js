var path=require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

//Cargar modelo ORM
var Sequelize=require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  dialect,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

//importar definición de la tabla en quiz.js
var Quiz=sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz=Quiz;

//Crea e inicializa tabla
sequelize.sync().then(function()
{
   Quiz.count().then(function(count){
      if(count===0)
	  {
		 Quiz.create({
		    pregunta: 'Capital de Portugal',
			respuesta: 'Lisboa',
            tema: "humanidades"
		 });
		 Quiz.create({
		    pregunta: 'Color del plátano',
			respuesta: 'amarillo',
            tema: "tecnologia"
		 });
	     Quiz.create({
		    pregunta: 'Capital de Italia',
			respuesta: 'Roma',
            tema: "humanidades"
		 }).then(function(){
			console.log('Base de datos inicializada');
		 });
	  }
   });
   
}
); 
