const bcrypt = require("bcryptjs");

bcrypt.hash("Raghav@123",10)
.then(hash=>console.log(hash));