const bc = require('bcrypt');
let salt;
bc.genSalt(10).then((res) => {
    salt = res;
    console.log("salt:", salt);
    bc.hash('1234', salt).then((hashedPassword) => {
    console.log("hashed password:", hashedPassword);
})

})

