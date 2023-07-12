const createPaginationResponse = (limit, offset, count, rows) => {
  const result = {
    message: "success",
    result: {
      //   current_page: parseInt(page),
      data: rows,

      offset: parseInt(offset),
      //   last_page: totalPages,

      limit: parseInt(limit),

      //   to: offset + rows.length,
      total: count
    },
    success: true
  }
  return result
}
module.exports = {
  createPaginationResponse
}
