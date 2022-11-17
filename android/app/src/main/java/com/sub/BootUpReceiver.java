package com.sub;

import static com.sub.ForegroundService.sendAppPackageNameToJS;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.HeadlessJsTaskService;

public class BootUpReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if (action.equals("android.intent.action.BOOT_COMPLETED")) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(new Intent(context, ForegroundService.class));
            } else {
                context.startService(new Intent(context, ForegroundService.class));
            }

            Intent bootIntent = new Intent(context, BootEventService.class);

            Bundle bundle = new Bundle();
            bootIntent.putExtras(bundle);

            Log.i("BootUpService", "부트 이벤트 발생");
            context.startService(bootIntent);

            HeadlessJsTaskService.acquireWakeLockNow(context);
        }
    }
}
