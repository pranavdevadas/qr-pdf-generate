const noCacheMiddleware = (req, res, next) => {
  if (req.url === "/") {
    res.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
  }
  next();
};

export default noCacheMiddleware;
