package com.sub;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.HeadlessJsTaskService;

public class TimePlaceReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        boolean isTime = intent.getBooleanExtra("isTime", false);
        boolean isPlace = intent.getBooleanExtra("isPlace", false);

        Log.i("TimePlaceReceiver", "broadcast event 받음, isTime = " + isTime + ", isPlace = " + isPlace);

        if (isTime) {
            boolean isMidnight = intent.getBooleanExtra("isMidnight", false);

            if (isMidnight) {
                // 12시마다 반복되는 부분
                // headless 보내기
                Log.i("TimePlaceReceiver", "12시 알람 받음");

                Intent midnightIntent = new Intent(context, MidnightEventService.class);
                midnightIntent.putExtra("Midnight", true);

                context.startService(midnightIntent);
                HeadlessJsTaskService.acquireWakeLockNow(context);

                // *TODO : 다음 날 12시에 다시 예약
            } else {
                // *TODO : 내용 뽑아오기
                // *TODO : headless로 전달
            }
        } else if (isPlace) {
            // *TODO : 내용 뽑아오기
            // *TODO : headless로 전달
        }
    }
}