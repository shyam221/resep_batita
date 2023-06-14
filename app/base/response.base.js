exports.success = (message, data, statusCode) => {
  return {
    errorCode: statusCode,
    errorMessage: message,
    data: data
  }
}

exports.paginationData = (data, page, limit) => {
  const { count: totalItems, rows: con } = data
  const content = []
  for (a of con) {
    let o = a
    if (a.image) {
      let imgBase64 = Buffer.from(a.image).toString('base64');
      // imgBase64 = `data:image/jpeg;base64,${imgBase64}`;
      o.image = `data:image/jpeg;base64,${imgBase64}`
    }
    if (a.favorites) {
      let isFavorited = a.favorites.length > 0 ? true : false
      o.isFavorited = isFavorited
    }
    content.push(o)
  }
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)
  const nextPage = currentPage < totalPages ? Math.ceil(currentPage + 1) : 0
  const prevPage = currentPage != 1 ? Math.ceil(currentPage - 1) : 0

  return { totalItems, totalPages, currentPage, nextPage, prevPage, content }
}

exports.getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
}