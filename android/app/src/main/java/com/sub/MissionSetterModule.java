package com.sub;

import android.Manifest;
import android.app.AlarmManager;
import android.app.AppOpsManager;
import android.app.LauncherActivity;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.LauncherApps;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingClient;
import com.google.android.gms.location.GeofencingRequest;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;

import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.Executor;

public class MissionSetterModule extends ReactContextBaseJavaModule {
    private static AlarmManager alarmManager = null;
    private static GeofencingClient geofencingClient = null;

    MissionSetterModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "MissionSetterModule";
    }

    // 권한 확인 함수
    @ReactMethod
    public void checkPermission(Promise promise) {
        try {
            ReactApplicationContext context = getReactApplicationContext();
            WritableMap map = Arguments.createMap();

            if (!checkPermission(context)) map.putBoolean("isAllowed", false);
            else {
                // 권한 이미 허용된 경우
                map.putBoolean("isAllowed", true);
            }

            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("error", e);
        }
    }

    // 권한 허용 함수
    @ReactMethod
    public void allowPermission(Promise promise) {
        try {
            ReactApplicationContext context = getReactApplicationContext();
            WritableMap map = Arguments.createMap();

            Log.i("MissionSetterModule",  "허용 함수 호출");
            allowPermission();
            if (!checkPermission(context)) map.putBoolean("isAllowed", false);
            else {
                // 권한 이미 허용된 경우
                map.putBoolean("isAllowed", true);
            }

            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("error", e);
        }
    }

    // 10분 뒤 휴식 종료
    @ReactMethod
    public void setBreakTimeEndAlarm() {
        Log.i("MissionSetterModule", "휴식 종료 알람 세팅 시작");
        Bundle bundle = new Bundle();
        bundle.putBoolean("isTime", true);
        bundle.putBoolean("isMidnight", false);
        bundle.putBoolean("isBreaktimeEnd", true);

        Date date = new Date(); // 현재 시간

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MINUTE, 10);

        setTime(bundle, calendar, 1);
    }

    @ReactMethod
    public void startMidnightAlarm() {
        Log.i("MissionSetterModule", "정각 알람 세팅 시작");
        Bundle bundle = new Bundle();
        bundle.putBoolean("isTime", true);
        bundle.putBoolean("isMidnight", true);
        bundle.putBoolean("isBreaktimeEnd", false);

        Date date = new Date(); // 현재 시간

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);

        // test code
        // calendar.set(Calendar.MINUTE, 1);

        setTime(bundle, calendar, 0);
    }

    @ReactMethod
    public void setTimeMission(int hour, int min, String id, int code) {
        Log.i("MissionSetterModule", "시간 알람 세팅 시작, id = " + id + ", 시간 = " + hour + ":" + min);

        Date date = new Date(); // 현재 시간

        Bundle bundle = new Bundle();
        bundle.putBoolean("isTime", true);
        bundle.putBoolean("isMidnight", false);
        bundle.putBoolean("isBreaktimeEnd", false);
        bundle.putString("id", id);

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, hour);
        calendar.set(Calendar.MINUTE, min);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);

        setTime(bundle, calendar, code);
    }

    @ReactMethod
    public void setPlaceMission(double lat, double lng, float rad, boolean isEnter, String id, int code) {
        Log.i("MissionSetterModule", "공간 알람 세팅 시작");

        Bundle bundle = new Bundle();
        bundle.putBoolean("isPlace", true);
        bundle.putString("id", id);

        Date date = new Date(); // 현재 시간

        // 끝날 시간 = 다음 날
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);

        long millisec = calendar.getTimeInMillis() - date.getTime();

        setGeo(bundle, lat, lng, rad, millisec, isEnter, id, code);
    }

    private void setTime(Bundle bundle, Calendar calendar, int code) {
        Log.i("MissionSetterModule", "시간 알림 추가");

        ReactApplicationContext context = getReactApplicationContext();

        if (alarmManager == null)
            alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

        Intent intent = new Intent(context, TimePlaceReceiver.class);
        intent.putExtras(bundle);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, code, intent, PendingIntent.FLAG_IMMUTABLE);

        if (Build.VERSION.SDK_INT >= 23) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
        } else {
            if (Build.VERSION.SDK_INT >= 19) {
                alarmManager.setExact(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
            } else {
                alarmManager.set(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
            }
        }
    }

    private void setGeo(Bundle bundle, double lat, double lng, float rad, long millisec, boolean isEnter, String id, int code) {
        Log.i("MissionSetterModule", "지오펜스 추가");
        Log.i("MissionSetterModule", "lat = " + lat + ", lng = " + lng + ", rad = " + rad);

        ReactApplicationContext context = getReactApplicationContext();

        if (geofencingClient == null) geofencingClient = LocationServices.getGeofencingClient(context);

        // 지오펜스 생성
        Geofence newGeo = new Geofence.Builder()
                .setRequestId(id)
                .setCircularRegion(lat, lng, rad)
                .setLoiteringDelay(180000) // 3분
                .setExpirationDuration(millisec)
                .setTransitionTypes(isEnter ? Geofence.GEOFENCE_TRANSITION_ENTER : Geofence.GEOFENCE_TRANSITION_EXIT)
                .build();

        GeofencingRequest.Builder builder = new GeofencingRequest.Builder();
        builder.setInitialTrigger(isEnter ? GeofencingRequest.INITIAL_TRIGGER_ENTER : Geofence.GEOFENCE_TRANSITION_EXIT); // 첫 처리 어떻게 할지
        builder.addGeofence(newGeo);

        Intent intent = new Intent(context, TimePlaceReceiver.class);
        intent.putExtras(bundle);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, code, intent, PendingIntent.FLAG_IMMUTABLE);

        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            geofencingClient.addGeofences(builder.build(), pendingIntent)
                    .addOnSuccessListener(new OnSuccessListener<Void>() {
                        @Override
                        public void onSuccess(Void aVoid) {
                            Log.i("MissionSetterModule", "추가 성공");
                        }
                    })
                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(Exception e) {
                            Log.i("MissionSetterModule", "추가 실패");
                            Log.i("MissionSetterModule", e.getMessage());
                        }
                    });
            Log.i("MissionSetterModule", "지오펜스 추가 완료");
        }
    }

    private void allowPermission() {
        ReactApplicationContext context = getReactApplicationContext();

        if (!checkPermission(context)) {
//            ActivityCompat.requestPermissions(context.getCurrentActivity(), new String[]{Manifest.permission.ACCESS_BACKGROUND_LOCATION}, 0);
            Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + context.getPackageName()));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        }
    }

    // 권한 체크 함수
    private boolean checkPermission(ReactApplicationContext context) {
        return ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_BACKGROUND_LOCATION) != PackageManager.PERMISSION_DENIED;
    }
}
