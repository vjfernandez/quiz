var models=require('../models/models.js');

//autoload
exports.load=function(req,res,next, quizId) {
    models.Quiz.find(quizId).then(
        function(quiz) {
            if (quiz) {
                req.quiz=quiz;
                next();
            } else {
                next(new Error('No existe quizId='+quizId));
            }
        }
    ).catch(function(error){next(error);});
};

exports.index=function(req,res) {
    var search="%";
    
    if (req.query["search"])
    {
        console.log("Búsqueda por: "+req.query['search']);
        search="%"+req.query.search.replace(" ","%")+"%";
    }
        
	models.Quiz.findAll({where:["pregunta like ?", search]}).then(function(quizes) {
		res.render('quizes/index.ejs', {quizes: quizes});
    }).catch(function(ex) {
          console.log("ERROR:"+ex);
          next(ex);
    });
}

//GET /quizes/show

exports.show = function(req, res) {
	res.render('quizes/show', {quiz:req.quiz});
}


//GET /quizes/answer
exports.answer=function(req,res) {
	var resultado='Incorrecto';
    
    if (req.query.respuesta=== req.quiz.respuesta) {
        resultado='Correcto';
	}
	res.render('quizes/answer', {quiz:req.quiz, respuesta:resultado});
}

//GET /quizes/new
exports.new =function(req,res) {
    var quiz=models.Quiz.build( //crear objeto quiz
        {pregunta:"", respuesta:""}
    );
    res.render('quizes/new', {quiz:quiz,errors:[]});
}


//POST /quizes/create

exports.create=function(req,res) {
    var elQuiz=req.body.quiz;
    
    
    var quiz=models.Quiz.build(elQuiz);
    console.log("ANTES DE VALIDAR");
    //guardar en BD.
    quiz
    .validate()
    .then(
        function(err) {
            
            if (err) {
                res.render('quizes/new', {quiz: quiz , errors: err.errors});
            } else {
                quiz.
                save({fields: ["pregunta", "respuesta"]})
                .then(function(){
                    res.redirect('/quizes');
                });
            }
            
            console.log("En validate");
        });
};


