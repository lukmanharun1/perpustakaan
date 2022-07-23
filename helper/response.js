module.exports = (res, obj, httpCode = 200) => res.status(httpCode).json(obj);
