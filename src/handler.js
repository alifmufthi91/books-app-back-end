const { nanoid } = require('nanoid')
const books = require('./books')
const responseUtil = require('./util/response_util')

const addBookHandler = (request, h) => {
  try {
    const book = request.payload
    if (!book.name) {
      return responseUtil.fail(h, 'Gagal menambahkan buku. Mohon isi nama buku')
    }
    if (book.readPage > book.pageCount) {
      return responseUtil.fail(h, 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount')
    }
    const id = nanoid(16)
    const finished = book.pageCount === book.readPage
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt
    const newBook = {
      id, ...book, finished, insertedAt, updatedAt
    }
    books.push(newBook)
    const isSuccess = books.filter((book) => book.id === id).length > 0
    if (isSuccess) {
      return responseUtil.success(h, { bookId: newBook.id }, 'Buku berhasil ditambahkan', 201)
    }
  } catch {
    return responseUtil.error(h, 'Buku gagal ditambahkan')
  }
}

const getAllBooksHandler = (request, h) => {
  let filteredBooks = [...books]
  if (!isEmptyObject(request.query)) {
    filteredBooks = filterBooksByQuery(filteredBooks, request.query)
  }
  const mappedBooks = filteredBooks.map((book) => {
    const { id, name, publisher } = book
    return { id, name, publisher }
  })
  return responseUtil.success(h, { books: mappedBooks })
}

const getBookByIdHandler = (request, h) => {
  const { id } = request.params
  const book = books.filter((book) => book.id === id)[0]
  if (book !== undefined) {
    return responseUtil.success(h, { book })
  }
  return responseUtil.fail(h, 'Buku tidak ditemukan', 404)
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params
  const updatedBook = request.payload
  if (!updatedBook.name) {
    return responseUtil.fail(h, 'Gagal memperbarui buku. Mohon isi nama buku')
  }
  if (updatedBook.readPage > updatedBook.pageCount) {
    return responseUtil.fail(h, 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount')
  }
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((book) => book.id === id)
  if (index !== -1) {
    Object.assign(books[index], { ...updatedBook, updatedAt })
    return responseUtil.success(h, undefined, 'Buku berhasil diperbarui')
  }
  return responseUtil.fail(h, 'Gagal memperbarui buku. Id tidak ditemukan', 404)
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((book) => book.id === id)

  if (index !== -1) {
    books.splice(index, 1)
    return responseUtil.success(h, undefined, 'Buku berhasil dihapus')
  }
  return responseUtil.fail(h, 'Buku gagal dihapus. Id tidak ditemukan', 404)
}

const filterBooksByQuery = (books, query) => {
  let filteredBooks = books
  if (query.name && query.name !== '') {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(query.name.toLowerCase()))
  }
  if (query.reading === 1 || query.reading === 0) {
    filteredBooks = filteredBooks.filter((book) => !!query.reading === book.reading)
  }
  if (query.finished === 1 || query.finished === 0) {
    filteredBooks = filteredBooks.filter((book) => !!query.finished === book.finished)
  }
  return filteredBooks
}

const isEmptyObject = (obj) => (Object.keys(obj).length === 0)

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
