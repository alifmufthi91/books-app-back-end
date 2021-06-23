const responseUtil = {}

responseUtil.success = (h, message, data) => {
  const body = {
    status: 'success',
    message: message || null,
    data
  }
  const response = h.response(body)
  response.code(201)
  return response
}

responseUtil.querySuccess = (h, data) => {
  const body = {
    status: 'success',
    data
  }
  const response = h.response(body)
  response.code(200)
  return response
}

responseUtil.fail = (h, message) => {
  const body = {
    status: 'fail',
    message: message || null
  }
  const response = h.response(body)
  response.code(400)
  return response
}

responseUtil.error = (h, message) => {
  const body = {
    status: 'error',
    message: message || null
  }
  const response = h.response(body)
  response.code(500)
  return response
}

module.exports = responseUtil
