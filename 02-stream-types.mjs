import { Readable, Writable, Transform } from "node:stream";
import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";

// data source: file, database, website, anything you can consume on demannd!
const readable = Readable({
  read() {
    for (let index = 0; index < 1e6; index++) {
      const person = { id: randomUUID(), name: `Erick-${index}` };
      const data = JSON.stringify(person);
      this.push(data);
    }
    // notify that the data is empty (consumed everything)
    this.push(null);
  },
});

const mapFields = Transform({
  transform(chunk, enc, cb) {
    const data = JSON.parse(chunk);
    const result = `${data.id}, ${data.name.toUpperCase()}\n`;
    cb(null, result);
  },
});

const mapHeaders = Transform({
  transform(chunk, enc, cb) {
    this.counter = this.counter ?? 0;
    if (this.counter) {
      return cb(null, chunk);
    }
    this.counter += 1;
    cb(null, "id,name\n".concat(chunk));
  },
});

// writable is always the output => print something, save, ignore, send email
// readable.pipe(mapFields).pipe(mapHeaders).pipe(process.stdout);

const pipeline = readable
  .pipe(mapFields)
  .pipe(mapHeaders)
  .pipe(createWriteStream("my.csv"));

pipeline.on("end", () => console.log("task finished..."));
