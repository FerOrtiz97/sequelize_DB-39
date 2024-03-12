const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        db.Genres.findAll()
            .then(allGenres => {
                res.render('moviesAdd', { allGenres });
            }
            )
    },
    create: function (req, res) {
        const { title, rating, awards, release_date, length, genre_id } = req.body;
        db.Movies.create({
            title, rating, awards, release_date, length, genre_id
        }
        ).then((resp) => {
            res.redirect('/movies',);
        })
    },
    edit: (req, res) => {
        const id = req.params.id;
        db.Movies.findByPk(id)
            .then((Movie) => {
                Genres.findAll()
                    .then((allGenres) => {
                        res.render('moviesEdit', { Movie, allGenres })
                    })
            })
    },
    update: function (req, res) {
        const { id } = req.params;
        const { title, rating, awards, release_date, length, genre_id } = req.body;
        db.Movies.update(
            req.body,
            {
                where: { id }
            }
        ).then(() => {
            res.redirect('/movies',);
        })
    },
    delete: function (req, res) {
        const { id } = req.params;
        db.Movies.findByPk(id)
            .then(Movie => {
                res.render('moviesDelete', { Movie });
            })
    },
    destroy: function (req, res) {
        const { id } = req.params;
        db.Movies.destroy({ where: { id } })
            .then(() => {
                res.redirect('/movies');
            })
    }
}

module.exports = moviesController;