const Joi = require('joi')
const { getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler, addBookHandler } = require('./handler')

const queryScheme = Joi.object({
  name: Joi.string(),
  reading: Joi.number(),
  finished: Joi.number()
})

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
    options: {
      validate: {
        query: queryScheme
      }
    }
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookByIdHandler
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBookByIdHandler
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookByIdHandler
  }
]

module.exports = routes
