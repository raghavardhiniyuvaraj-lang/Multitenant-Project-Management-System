const bcrypt = require("bcryptjs");

const hash =
"$2b$10$wc20.1Etk/pACEgzEUAqCOwyELO8S0u5mAsk82BKYmzwtHis8.Nii";

const password = "1234567"; // Change this

bcrypt.compare(password, hash)
.then(result => console.log(result));