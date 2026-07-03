import { PermissionsAndroid, Platform } from 'react-native';

export async function requestNotificationPermissionIfNeeded() {
    if (Platform.OS !== 'android') return true;
    if (Platform.Version < 33) return true;

    const already = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (already) return true;

    const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return res === PermissionsAndroid.RESULTS.GRANTED;
}

export async function hasNotificationPermission() {
    if (Platform.OS !== 'android') return true;
    if (Platform.Version < 33) return true;
    return PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
}