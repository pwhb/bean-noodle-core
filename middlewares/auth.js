function verifyJWT(request, reply, done) {
  const [bearer, token] = request.headers.authorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    return done(new Error("Missing token header"));
  }
  const user = this.jwt.decode(token);
  console.log(user);
  if (!user) {
    return done(new Error("Failed to authorize"));
  }
  request.user = user;
  return done();
}

module.exports = { verifyJWT };
