package com.sub;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

public class AlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        action.equals("android. ")
        Toast.makeText(context, "알람~!!", Toast.LENGTH_SHORT).show();    // AVD 확인용
        Log.e("Alarm", "알람입니다.");    // 로그 확인용
    }
}