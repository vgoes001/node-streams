const { Readable } = require("stream");

function arrayToStream(array) {
  let index = 0;

  // Create a custom Readable stream by extending the Readable class
  const readableStream = new Readable({
    // Implement the `read` method to push data to the stream
    read() {
      array.forEach((element) => {
        this.push(element.toString());
      });
      this.push(null);
    },
  });

  return readableStream;
}

// Usage example:
const myArray = [
  {
    name: "Jose",
  },
  {
    name: "Maria",
  },
  {
    name: "Joao",
  },
  {
    name: "Pedro",
  },
  {
    name: "Mario",
  },
  {
    name: "Ricardo",
  },
];
const myStream = arrayToStream(myArray);

// Consume the stream
myStream.on("data", (chunk) => {
  console.log(chunk.toString());
});

myStream.on("end", () => {
  console.log("Stream ended");
});
