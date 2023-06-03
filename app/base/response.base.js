exports.success = (message, data, statusCode) => {
  return {
    errorCode: statusCode,
    errorMessage: message,
    data: data
  }
}

exports.paginationData = (data, page, limit) => {
  const { count: totalItems, rows: content } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, totalPages, currentPage, content }
}

exports.getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
}