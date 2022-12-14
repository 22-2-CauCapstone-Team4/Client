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
            boolean isBreaktimeEnd = intent.getBooleanExtra("isBreaktimeEnd", false);

            Log.i("TimePlaceReceiver", "isMidnight = " + isMidnight + ", isBreaktimeEnd = " + isBreaktimeEnd);

            if (isMidnight) {
                // 12시마다 반복되는 부분
                // headless 보내기
                Log.i("TimePlaceReceiver", "12시 알람 받음");

                Intent midnightIntent = new Intent(context, HeadlessEventService.class);
                midnightIntent.putExtra("key", "Midnight");
                midnightIntent.putExtra("Midnight", true);

                context.startService(midnightIntent);
                HeadlessJsTaskService.acquireWakeLockNow(context);
            } else if (isBreaktimeEnd) {
                // 쉬는 시간 종료됨
                // headless 보내기
                Log.i("TimePlaceReceiver", "쉬는 시간 종료 알람 받음");

                Intent breakTimeEndIntent = new Intent(context, HeadlessEventService.class);
                breakTimeEndIntent.putExtra("key", "BreakTimeEnd");
                breakTimeEndIntent.putExtra("Time", true);

                context.startService(breakTimeEndIntent);
                HeadlessJsTaskService.acquireWakeLockNow(context);
            } else {
                Log.i("TimePlaceReceiver", "미션 알람 받음 - 시간");

                String id = intent.getStringExtra("id");

                Intent missionIntent = new Intent(context, HeadlessEventService.class);
                missionIntent.putExtra("key", "MissionTrigger");
                missionIntent.putExtra("id", id);

                context.startService(missionIntent);
                HeadlessJsTaskService.acquireWakeLockNow(context);
            }
        } else if (isPlace) {
            Log.i("TimePlaceReceiver", "미션 알람 받음 - 공간");

            String id = intent.getStringExtra("id");

            Intent missionIntent = new Intent(context, HeadlessEventService.class);
            missionIntent.putExtra("key", "MissionTrigger");
            missionIntent.putExtra("id", id);

            context.startService(missionIntent);
            HeadlessJsTaskService.acquireWakeLockNow(context);
        }
    }
}