package com.wawa.alarm;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.KeyguardManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AlarmModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext context;
    public static android.media.Ringtone currentRingtone;

    public AlarmModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
    }

    @Override
    public String getName() {
        return "AlarmModule";
    }

    @ReactMethod
    public void setAlarm(int alarmId, double timestamp) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(context, AlarmReceiver.class);
        intent.putExtra("alarmId", alarmId);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
            context, alarmId, intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        alarmManager.setAlarmClock(
            new AlarmManager.AlarmClockInfo((long) timestamp, pendingIntent),
            pendingIntent
        );
    }

    @ReactMethod
    public void cancelAlarm(int alarmId) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(context, AlarmReceiver.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
            context, alarmId, intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        alarmManager.cancel(pendingIntent);
    }

    @ReactMethod
    public void requestDismissKeyguard(final Promise promise) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "no current activity");
            return;
        }
        activity.runOnUiThread(() -> {
            KeyguardManager km =
                (KeyguardManager) activity.getSystemService(Context.KEYGUARD_SERVICE);
            km.requestDismissKeyguard(activity, new KeyguardManager.KeyguardDismissCallback() {
                @Override public void onDismissSucceeded() { promise.resolve(true); } 
                @Override public void onDismissCancelled() { promise.resolve(false); }
                @Override public void onDismissError()     { promise.reject("DISMISS_ERROR", "error"); }
            });
        });
    }

    @ReactMethod
    public void stopAlarm() {
        if (currentRingtone != null) {
            currentRingtone.stop();
            currentRingtone = null;
        }
        Activity activity = getCurrentActivity();
        if (activity instanceof AlarmActivity) {
            activity.finish();
        }
    }

     @ReactMethod
    public void stopRingtone() {
        if (currentRingtone != null) {
            currentRingtone.stop();
            currentRingtone = null;
        }
    }

    @ReactMethod
    public void dismissAndReturn() {
        if (currentRingtone != null) {
            currentRingtone.stop();
            currentRingtone = null;
        }
        Activity activity = getCurrentActivity();
        if (activity instanceof AlarmActivity) {
            Intent launch = context.getPackageManager()
                .getLaunchIntentForPackage(context.getPackageName());
            if (launch != null) {
                launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                context.startActivity(launch);
            }
            activity.finish();
        }
    }
}