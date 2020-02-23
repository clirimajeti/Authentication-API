const bcrypt = require('bcryptjs');

module.exports = {
  hashPassword: async function (password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);  
    return hash;
  },
  comparePassword: async function (password, current_password) {
    const equals = await bcrypt.compare(password, current_password);
    return equals;
  }
}