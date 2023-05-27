declare global {
  interface Global {
    [key: string]: any;
  }
}

const globalThisWithIndexSignature = globalThis as Record<string, any> & typeof globalThis;

import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // persists across module reloads caused by HMR (Hot Module Replacement).
  if (!globalThisWithIndexSignature.__MONGO_CLIENT__) {
    globalThisWithIndexSignature.__MONGO_CLIENT__ = new MongoClient(uri, {
      // useUnifiedTopology: true, // remove this line
    });
  }

  client = globalThisWithIndexSignature.__MONGO_CLIENT__;
} else {
  clientPromise = MongoClient.connect(uri, {
    // useUnifiedTopology: true, // remove this line
  }).then((client) => {
    console.log("Connected to MongoDB");
    return client;
  });

  clientPromise.then((client) => {
    client.on("close", () => {
      console.log("Disconnected from MongoDB");
    });
  });

  client = await clientPromise;
}

export default client;


// declare global {
//   interface Global {
//     [key: string]: any;
//   }
// }

// import { MongoClient } from "mongodb";

// if (!process.env.MONGODB_URI) {
//   throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
// }

// const uri = process.env.MONGODB_URI;

// let client: MongoClient;
// let clientPromise: Promise<MongoClient>;

// if (process.env.NODE_ENV === "development") {
//   // In development mode, use a global variable so that the value
//   // is preserved across module reloads caused by HMR (Hot Module Replacement).
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   // In production mode, it's best to not use a global variable.
//   client = new MongoClient(uri);
//   clientPromise = client.connect();
// }

// // Export a module-scoped MongoClient promise. By doing this in a
// // separate module, the client can be shared across functions.
// export default clientPromise;