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

// const text = process.argv[2];

const client = new notePackage.Note(
    "localhost:4000",
    grpc.credentials.createInsecure()
);

rl.question(chalk.blueBright.bold("Enter Your Note : "), (note) => {
    rl.close();
    console.log(chalk.bgGreen.black("\n" + "Sending your note to Server"));
    client.createNote(
        {
            text: note,
        },
        (err, response) => {
            console.log(
                chalk.bgCyanBright.black("Response from server :") +
                    "\n" +
                    chalk.bgCyanBright.black.bold("Note id :" + response.id)
            );
        }
    );
});
