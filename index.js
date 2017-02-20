const express = require('express');
const expressJWT = require('express-jwt');
const port    = process.env.PORT || 4000;
const app     = express();
const dest    = `${__dirname}/public`;

app.use(express.static(dest));

app.get('/*', (req, res) => res.sendFile(`${dest}/index.html`));

app.listen(port, () => console.log(`Express has started on port: ${port}`));
