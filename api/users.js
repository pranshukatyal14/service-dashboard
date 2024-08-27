const { login } = require("../controllers/user.controller");
const { authJwt } = require("../middleware");


module.exports = (app, options) => {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        req.repo = options.repo;
        next();
    });

    app.get("/dashboard/test", (req, res) => {
        res.status(200).send({
            success: true,
            message: "dashboard is working",
        });
    });
    app.post('/dashboard/login', login);


  };
