# gRPC-Nodejs-Notes-app

Install node modules : npm i 

Postgres db in docker : docker run -p 5432:5432 --name pg -e POSTGRES_PASSWORD=password postgres
(If you have any problems to connect the db , try : "docker network ls", choose name, then:  "docker network inspect bridge" for the IPv4Address)

pgAdmin in docker : docker run -p 5555:80 --name pgadmin -e PGADMIN_DEFAULT_EMAIL=lavi@lavi.com -e PGADMIN_DEFAULT_PASSWORD=password dpage/pgadmin4

launch notes app server : npm start

test app : npm test


Usage : run scripts in client folder,

Create a new note: node createNote.js 

Receive all notes at once from server : node readNotes.js

Receive notes in stream(one by one) : node readNotesStream.js

Delete a note : node deleteNote.js
