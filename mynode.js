const fs = require("fs");
const path = require("path");
const successColor = "\x1b[32m%s\x1b[0m";
const checkSign = "\u{2705}";
const dotenv = require("dotenv").config({ path: "src/.env" });

const envFile = `export const environment = {
 firebaseConfig: {
 apiKey: '${process.env.API_KEY}',
 authDomain: '${process.env.AUTH_DOMAIN}',
 projectId: '${process.env.PROJECT_ID}',
 storageBucket: '${process.env.STORAGE_BUCKET}',
 messagingSenderId: '${process.env.MESSAGING_SENDER_ID}',
 appId: '${process.env.APP_ID}',
 measurementId: '${process.env.MEASUREMENT_ID}',
},
};
`;
const targetPath = path.join(__dirname, "./src/environments/environment.ts");
fs.writeFile(targetPath, envFile, (err) => {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.log(
      successColor,
      `${checkSign} Successfully generated environment.ts`
    );
  }
});
