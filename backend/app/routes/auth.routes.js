const { verifySignUp } = require("../middlewares");
const authJwt = require("../middlewares/authJwt");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept, x-access-token, authorization"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.get("/api/auth/me", [authJwt.verifyToken], controller.me);
  app.put("/api/auth/profile", [authJwt.verifyToken], controller.updateProfile);
  app.get("/api/auth/analytics", [authJwt.verifyToken, authJwt.isAdmin], controller.analytics);
  app.post("/api/auth/signout", controller.signout);
};
