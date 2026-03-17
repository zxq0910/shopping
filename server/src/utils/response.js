function success(res, data, message = 'ok') {
  return res.json({ success: true, message, data });
}

module.exports = { success };
