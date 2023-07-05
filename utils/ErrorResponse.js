function ErrorResponse(message, codeStatus) {
  this.message = message;
  this.codeStatus = codeStatus;
}

module.exports = ErrorResponse;