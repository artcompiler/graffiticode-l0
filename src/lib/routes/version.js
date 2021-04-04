module.exports = (compiler) => {
  return (req, res) => {
    res.send(compiler.version || "v0.0.0");
  };
};
