import * as Keychain from 'react-native-keychain';

const TOKEN_KEY = 'wawa_jwt_token';

// Save token to Keychain
export const saveToken = async (token) => {
    await Keychain.setGenericPassword(TOKEN_KEY, token);
};

// Retrieve token from Keychain
export const getToken = async () => {
    const credentials = await Keychain.getGenericPassword();
    return credentials ? credentials.password : null;
};

// Delete token from Keychain (logout)
export const deleteToken = async () => {
    await Keychain.resetGenericPassword();
};