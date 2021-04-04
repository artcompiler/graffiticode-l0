module.exports = (compiler) => {
  return (req, res) => {
    const langID = compiler.langID || '0';
    res.send(`Hello, L${langID}!`);
  };
};
