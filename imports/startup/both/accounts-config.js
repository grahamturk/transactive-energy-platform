import { AccountsTemplates } from 'meteor/useraccounts:core';

console.log('inside accounts config');

AccountsTemplates.configure({
    confirmPassword: true,
    enablePasswordChange: true,
    showForgotPasswordLink: true,
    showResendVerificationEmailLink: false,
});
