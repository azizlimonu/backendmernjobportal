const createErrorResponse = (message, codeStatus) => ({
  message,
  codeStatus
});

module.exports = createErrorResponse;