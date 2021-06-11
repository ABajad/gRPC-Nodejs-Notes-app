const grpc = require("grpc"); //main grpc library
const protoLoader = require("@grpc/proto-loader"); //compile protocol buffer file to js file which will have schema and classes
const packageDef = protoLoader.loadSync("../proto/note.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const notePackage = grpcObject.notePackage;
const postgresClient = require("pg").Client;

const client = new postgresClient({
    user: "postgres",
    password: "password",
    host: "172.17.0.2",
    port: 5432,
    database: "notes",
});

client
    .connect()
    .then(() => {
        console.log("connected succesfully");
        client.query(
            "CREATE TABLE IF NOT EXISTS allnotes (id SERIAL PRIMARY KEY, note VARCHAR NOT NULL) "
        );
    })
    .catch((e) => console.log(e));

const server = new grpc.Server();
server.bind("0.0.0.0:4000", grpc.ServerCredentials.createInsecure());

server.addService(notePackage.Note.service, {
    createNote: createNote,
    readNotes: readNotes,
    readNotesStream: readNotesStream,
    deleteNote: deleteNote,
    droptable: droptable,
});
server.start();
notes = [];
async function createNote(call, callback) {
    const note = {
        id: notes.length + 1,
        text: call.request.text,
    };
    const id = await client.query(
        "INSERT INTO allnotes(note) VALUES($1) RETURNING id",
        [note.text]
    );
    console.log(id.rows[0]);
    notes.push(note);
    console.log(note);
    callback(null, id.rows[0]);
}

notesa = [{ 1: "gogogog" }, { 21212: "hjhjhj" }];

async function readNotes(call, callback) {
    try {
        const results = await client.query("select * from public.allnotes");
        notes = results.rows;

        callback(null, { items: notesa });
    } catch (error) {
        console.log(error);
    }
}

async function readNotesStream(call, callback) {
    try {
        const results = await client.query("select * from public.allnotes");
        notes = results.rows;

        notes.forEach((note) => call.write(note));
        call.end();
    } catch (error) {
        console.log(error);
    }
}

async function deleteNote(call, callback) {
    console.log(`delete Note with id ${call.request.id}`);
    try {
        await client.query("delete from public.allnotes where id = $1", [
            call.request.id,
        ]);
    } catch (error) {
        console.log(error);
    }
    callback(null, { items: call.request.id });
}

async function droptable(call, callback) {
    // await client.query("DROP TABLE if exists public.allnotes");
    console.log("Table deleted" + call.request.id);
    callback(null, { items: call.request.id });
}
