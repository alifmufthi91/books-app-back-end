const { nanoid } = require('nanoid')
const books = require('./books')
const responseUtil = require('./util/response_util')

const addBookHandler = (request, h) => {
  try {
    const book = request.payload
    if (!book.name) return responseUtil.fail(h, 'Gagal menambahkan buku. Mohon isi nama buku')
    if (book.readPage > book.pageCount) return responseUtil.fail(h, 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount')
    const id = nanoid(16)
    const finished = book.pageCount === book.readPage
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt
    const newBook = {
      id, ...book, finished, insertedAt, updatedAt
    }
    books.push(newBook)
    const isSuccess = books.filter((book) => book.id === id).length > 0
    if (isSuccess) return responseUtil.success(h, 'Buku berhasil ditambahkan', { bookId: newBook.id })
  } catch {
    return responseUtil.error(h, 'Buku gagal ditambahkan')
  }
}

const getAllBooksHandler = (_request, h) => {
  const mappedBooks = books.map((book) => {
    const { id, name, publisher } = book
    return { id, name, publisher }
  })
  return responseUtil.querySuccess(h, { books: mappedBooks })
}

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params
  const note = books.filter((n) => n.id === id)[0]
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note
      }
    }
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan'
  })
  response.code(404)
  return response
}

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params
  const { title, tags, body } = request.payload
  const updatedAt = new Date().toISOString()

  const index = books.findIndex((note) => note.id === id)

  if (index !== -1) {
    books[index] = {
      ...books[index],
      title,
      tags,
      body,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((note) => note.id === id)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addBookHandler, getAllBooksHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler }
