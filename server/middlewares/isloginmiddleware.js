module.exports = (req, res, next) => {
    console.log('this is middle ware',req.user)
    if (req.isAuthenticated()) {
        next();
      } else {
        console.log('User is not authenticated');
        return res.status(401).send({
          isLoggedIn: false,
          message:'User is not logged in',
        });
      }
  };
  