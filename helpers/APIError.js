/** Class representing an API Error Response with a related HTTP Status Code **/
class APIError extends Error {
  /**
   * Create an Error Object
   * @param {String} title - The title corresponding to the Status Code (e.g. Bad Request)
   * @param {String} message - Specific information about what caused the error
   */
  constructor(status = 500, message = 'Internal Server Error.') {
    super(message);
    this.status = status;
    this.message = message;
    // let's get a stack trace going
    Error.captureStackTrace(this);
  }

  /*
    Defines the JSON representation of this class
	 Automatically invoked when you pass an API Error to res.json
   */
  toJSON() {
    const { status, message } = this;
    return {
      error: {
        status,
        message
      }
    };
  }
}

module.exports = APIError;
