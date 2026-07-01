import { PermissionsAndroid, Platform } from 'react-native';

export async function requestNotificationPermissionIfNeeded() {
    if (Platform.OS !== 'android') return;
    if (Platform.Version < 33) return;

    const already = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (already) return;

    await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
}