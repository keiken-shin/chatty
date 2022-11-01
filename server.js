const express = require("express");

const PORT = 8080 || process.env.PORT;

const app = express();

app.listen(PORT, () => console.log(`App is listening on port: ${PORT}`));
