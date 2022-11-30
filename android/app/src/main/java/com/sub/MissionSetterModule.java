package com.sub;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Calendar;
import java.util.Date;

public class MissionSetterModule extends ReactContextBaseJavaModule {
    private static AlarmManager alarmManager = null;

    MissionSetterModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "MissionSetterModule";
    }

    @ReactMethod
    public void startMidnightAlarm() {
        Log.i("MissionSetterModule", "정각 알람 세팅 시작");
        Bundle bundle = new Bundle();
        bundle.putBoolean("isTime", true);
        bundle.putBoolean("isMidnight", true);

        Date date = new Date(); // 현재 시간

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);

        // test code
//        calendar.set(Calendar.MINUTE, 1);

        setTime(bundle, calendar);
    }

    @ReactMethod
    public void setMission() {
        // *TODO : 오늘 미션 정보 받아서 여기 넣기
    }

    private void setTime(Bundle bundle, Calendar calendar) {
        Log.i("MissionSetterModule", "알람 설정");

        ReactApplicationContext context = getReactApplicationContext();

        if (alarmManager == null) alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

        Intent intent = new Intent(context, TimePlaceReceiver.class);
        intent.putExtras(bundle);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);

        if (Build.VERSION.SDK_INT >= 23) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
        } else {
            if (Build.VERSION.SDK_INT >= 19){
                alarmManager.setExact(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
            } else {
                alarmManager.set(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
            }
        }
    }
}
