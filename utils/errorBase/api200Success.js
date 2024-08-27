function returnSuccess(data, req, res, next) {
    // console.log('run returnSuccess')

    res.status(data.statusCode || 200);
    res.json(data);
}

module.exports = { returnSuccess };
