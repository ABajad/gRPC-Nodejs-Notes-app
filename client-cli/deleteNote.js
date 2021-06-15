//read all notes at once
const grpc = require("grpc"); //main grpc library
const protoLoader = require("@grpc/proto-loader"); //compile protocol buffer file to js file which will have schema and classes
const packageDef = protoLoader.loadSync("../proto/note.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const notePackage = grpcObject.notePackage;
const readline = require("readline");
const chalk = require("chalk");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const client = new notePackage.Note(
    "localhost:4000",
    grpc.credentials.createInsecure()
);

const call = client.readNotesStream();
console.log("All Notes");
call.on("data", (item) => {
    console.log(chalk.green("> ") + chalk.bgBlue(JSON.stringify(item)));
});

call.on("end", (e) => {
    rl.question(chalk.redBright.bold("Id of note to delete : "), (text) => {
        rl.close();

        var integer = parseInt(text, 10);
        if (integer) {
            console.log(
                chalk.bgGreen.black("\n" + "Sending your request to Server")
            );
            client.deleteNote(
                {
                    id: integer,
                },
                (err, response) => {
                    console.log(
                        "Response from server (Delete Note)" +
                            JSON.stringify(response)
                    );
                    return response;
                }
            );
        } else {
            console.log("Wrong input, ID must be an integer");
        }
    });
});
