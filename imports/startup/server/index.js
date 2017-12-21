// Import server startup through a single index entry point

console.log('inside server/index');
import './fixtures.js';
import './ledger-create.js';
import './register-api.js';
import './accounts-server-hooks.js';
import './ledger-setup.js';
