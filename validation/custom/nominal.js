module.exports = (nominal, { req }) => {
  if (req.body.status && !nominal) {
    throw new Error("nominal wajib diisi!");
  } else if (nominal) {
    if (typeof nominal !== "number") {
      throw new Error("nominal harus number!");
    } else if (nominal < 500) {
      throw new Error("nominal minimal haru 500");
    }
  }
  return true;
};
