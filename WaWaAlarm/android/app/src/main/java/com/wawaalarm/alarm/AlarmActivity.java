package com.wawaalarm.alarm;

import android.app.Activity;
import android.os.Bundle;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.view.Gravity;

public class AlarmActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().addFlags(
            WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
            WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON |
            WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
        );

        LinearLayout layout = new LinearLayout(this);
        layout.setGravity(Gravity.CENTER);

        Button stopButton = new Button(this);
        stopButton.setText("Stop Alarm");
        stopButton.setOnClickListener(v -> {
            if (AlarmModule.currentRingtone != null) {
                AlarmModule.currentRingtone.stop();
                AlarmModule.currentRingtone = null;
            }
            finish();
        });

        layout.addView(stopButton);
        setContentView(layout);
    }
}
