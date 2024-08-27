/**
 * @desc    Send any success response
 *
 * @param   {string} message
 * @param   {object | array} results
 * @param   {number} statusCode
 */

exports.successRes = (response = {}) => {
    return {
        success: true,
        data: response,
    };
};
