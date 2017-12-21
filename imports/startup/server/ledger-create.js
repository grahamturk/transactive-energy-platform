import sequence from 'sequence-sdk';

console.log('inside sequence setup');
const ledger = new sequence.Client({
    ledger: 'gmturk-development',
    credential: 'MDAwZWxvY2F0aW9uIAowMDM3aWRlbnRpZmllciAKEJp_q0dbKNlkgGojl4XSk_4SBWJldGExGgwIy5Kg0QUQpe2HnAIKMDAxYWNpZCAKDxoNa3RoLW1pY3JvZ3JpZAowMDJkY2lkIDBmYWM1NWM4LWE0OWMtNGM5NS04MTE4LWMxOWIwOGE1ZjZlNQowMDUxdmlkILhKSad3rfWztVpHwmewNP3gWU2gf1FTyqT4RzrKmYVqzi12ZlDa6mHsd-qa4j7-iTlDrImJpp801dv2b16OjTT2hqbLjzyQHAowMDA4Y2wgCjAwMmZzaWduYXR1cmUgpfYf7Tr-VIp2WPIdzZXw9g1R1i8QiQ9Lw1wXI3-GancK',
});

export default ledger;

