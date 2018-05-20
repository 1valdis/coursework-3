exports.catchAsyncErrors = fn => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next)
  }
}

exports.notFound = (req, res, next) => {
  const err = new Error('Not found')
  err.status = 404
  next(err)
}

exports.textError = (err, req, res, next) => {
  if (typeof err === 'string') {
    req.flash('danger', err)
    return res.redirect('back')
  }
  next(err)
}

exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || ''
  const errorDetails = {
    message: err.message,
    status: err.status,
    title: err.status,
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      '<mark>$&</mark>'
    )
  }
  res.render('error', errorDetails)
}

exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    status: err.status,
    title: err.status || 'Ошибка',
    error: {}
  })
}
