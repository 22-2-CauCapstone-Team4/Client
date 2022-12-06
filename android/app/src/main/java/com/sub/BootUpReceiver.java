package com.sub;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.HeadlessJsTaskService;

public class BootUpReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if (action.equals("android.intent.action.BOOT_COMPLETED")) {
            // 걍 이벤트만 받아서 앱을 깨우고, 그때 RN 켜지면서 작업 되도록 처리

            Log.i("BootUpService", "부트 이벤트 발생");

            Intent bootIntent = new Intent(context, HeadlessEventService.class);
            bootIntent.putExtra("key", "Boot");
            bootIntent.putExtra("Boot", true);

            context.startService(bootIntent);
            HeadlessJsTaskService.acquireWakeLockNow(context);
        }
    }
}
