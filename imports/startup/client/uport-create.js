import { Connect, SimpleSigner, MNID } from 'uport-connect'

const uport = new Connect('Transactergy', {
    clientId: '2onRBAEr7CU5irELYafbo8DsFxGXQDP6WoC',
    network: 'rinkeby',
    signer: SimpleSigner('3f26a07f740c746972beacacadd77e037db5239b1bd16478f6043f8ea08bb92f')
});

const web3 = uport.getWeb3();

export { web3, uport, MNID };
