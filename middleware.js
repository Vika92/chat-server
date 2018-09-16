export function corsHandler(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', `http://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
}