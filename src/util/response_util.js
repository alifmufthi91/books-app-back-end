const responseUtil = {}

responseUtil.success = (h, data, message, statusCode) => {
  const body = {
    status: 'success'
  }
  if(message) body.message = message
  if(data) body.data = data
  const response = h.response(body)
  response.code(statusCode || 200)
  return response
}

responseUtil.fail = (h, message, statusCode) => {
  const body = {
    status: 'fail',
  }
  if(message) body.message = message
  const response = h.response(body)
  response.code(statusCode || 400)
  return response
}

responseUtil.error = (h, message) => {
  const body = {
    status: 'error',
  }
  if(message) body.message = message
  const response = h.response(body)
  response.code(statusCode || 500)
  return response
}

module.exports = responseUtil
