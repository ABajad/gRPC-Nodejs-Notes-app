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
        client.query(
            "CREATE TABLE IF NOT EXISTS allnotes (id SERIAL PRIMARY KEY, text VARCHAR NOT NULL) "
        );
    })
    .then(() => {
        console.log("Succesfully connected to db ");
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

async function createNote(call, callback) {
    try {
        const id = await client.query(
            "INSERT INTO allnotes(text) VALUES($1) RETURNING id",
            [call.request.text]
        );
        callback(null, id.rows[0]);
    } catch (error) {
        console.log(error);
    }
}

async function readNotes(call, callback) {
    try {
        const results = await client.query("select * from public.allnotes");
        callback(null, { items: results.rows });
    } catch (error) {
        console.log(error);
    }
}

async function readNotesStream(call, callback) {
    try {
        const results = await client.query("select * from public.allnotes");
        results.rows.forEach((note) => call.write(note));
        call.end();
    } catch (error) {
        console.log(error);
    }
}

async function deleteNote(call, callback) {
    try {
        console.log(`delete Note with id ${call.request.id}`);
        await client.query("delete from public.allnotes where id = $1", [
            call.request.id,
        ]);
    } catch (error) {
        console.log(error);
    }
    callback(null, { id: call.request.id });
}

async function droptable(call, callback) {
    await client.query("DROP TABLE if exists public.allnotes");
    console.log("Table deleted" + JSON.stringify({ items: { text: "aqsas" } }));
    callback(null, { text: "Table Deleted" });
}
