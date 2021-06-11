var pgtools = require("pgtools");
const config = {
    user: "postgres",
    host: "172.17.0.2",
    password: "password",
    port: 5432,
};

pgtools.createdb(config, "notes", function (err, res) {
    if (err) {
        console.log("Notes DB already exist");
    } else {
        console.log("Created Notes DB");
    }
});
