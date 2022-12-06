package com.sub;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.app.usage.UsageEvents;
import android.app.usage.UsageStatsManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;
import android.util.LongSparseArray;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

import com.facebook.react.HeadlessJsTaskService;

import java.util.ArrayList;

public class ForegroundService extends Service {
    // 미션 새로 생길 때마다 다시 앱 리스트 넣어 줄 필요 없도록
    private static ArrayList<AppInfo> prohibitedAppList = null;

    private static final int SERVICE_NOTIFICATION_ID = 315;
    private static final String CHANNEL_ID = "PHONELOCK";

    private String phoneUsageState = "INIT";
    private String appPackageName = "";
    private boolean isProhibitedApp = false;

    private NotificationManager notificationManager;
    private Notification notification;

    private Thread thread;

    private BroadcastReceiver screenReceiver;
    private IntentFilter intentFilter;

    private boolean isThreadRunning = false;
    // private Handler handler = new Handler();
    private Runnable checkCurApp = new Runnable() {
        @Override
        public void run() {
            Context context = getApplicationContext();

            if (isThreadRunning) return;
            isThreadRunning = true;

            while (isThreadRunning) {
                // 현재 foreground 앱의 패키지 이름 확인
                String nowAppPackageName = getPackageName(context);

                // 앱 이름 알아내기
                String appName = "";
                for (AppInfo app : prohibitedAppList) {
                    if (app.getPackageName().equals(nowAppPackageName)) {
                        appName = app.getName();
                        break;
                    }
                }
                boolean nowIsProhibitedApp = !appName.isEmpty();

                Log.i("ForegroundService", "app package name = " + nowAppPackageName + ", app name = " + appName);

                // ""이 오는 경우, 같은 화면 유지 중인 상황 (고려할 필요 X)
                if (!nowAppPackageName.isEmpty() && !nowAppPackageName.equals(appPackageName)) {
                    // 현재 앱이 금지 앱이거나, 현재 앱이 금지 앱이 아니고 직전 앱이 금지 앱이었던 경우
                    // JS쪽에 이벤트를 보내 금지 앱 상황 알리기
                    if (nowIsProhibitedApp || isProhibitedApp)
                        sendAppPackageNameToJS(context, nowAppPackageName, appName, nowIsProhibitedApp, phoneUsageState);
                    if (!phoneUsageState.equals("")){
                        Log.i("ForegroundService", phoneUsageState);
                        phoneUsageState = "";
                    }

                    appPackageName = nowAppPackageName;
                    isProhibitedApp = nowIsProhibitedApp;
                }

                try {
                    Thread.sleep(500);
                } catch (Exception e) {
                    e.printStackTrace();
                    break;
                }
            }

            // handler.postDelayed(this, 2000); // 2초에 한 번
        }
    };

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        Log.i("ForegroundService", "서비스 첫 생성");
        prohibitedAppList = null;

        createNotificationChannel(); // Creating channel for API 26+

        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_IMMUTABLE);

        notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                // 실제 알림창에 뜨는 내용 설정
                .setContentTitle("감지 중")
                .setContentText("금지 앱 접속을 감지 중입니다. ")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(contentIntent)
                .build();

        startForeground(SERVICE_NOTIFICATION_ID, notification);

        // 화면 꺼지고 켜지는 상황 대응하기
        intentFilter = new IntentFilter();
        intentFilter.addAction(Intent.ACTION_SCREEN_OFF);
        intentFilter.addAction(Intent.ACTION_SHUTDOWN);
        intentFilter.addAction(Intent.ACTION_SCREEN_ON);

        screenReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (intent.getAction().equals(Intent.ACTION_SCREEN_OFF) || intent.getAction().equals((Intent.ACTION_SHUTDOWN))) {
                    Log.i("ForegroundService", "화면 꺼짐");

                    // 화면 끈 경우, 코드가 반복될 필요 없음 (켜졌을 때 다시 반복을 시작해주면 됨)
                    isThreadRunning = false;

                    // 감지 앱 사용 중이었던 경우, 꺼졌다는 신호를 보내주어야 함
                    // if (isProhibitedApp)
                    sendAppPackageNameToJS(context, "", "", false, "PHONE_OFF");

                    appPackageName = "";
                    isProhibitedApp = false;

                    if (intent.getAction().equals((Intent.ACTION_SHUTDOWN))) {
                        onDestroy();
                    }
                } else if (intent.getAction().equals(Intent.ACTION_SCREEN_ON)) {
                    Log.i("ForegroundService", "화면 켜짐");
                    // 화면 켠 경우, 다시 반복 시작
                    if (prohibitedAppList != null && prohibitedAppList.size() != 0) {
                        Log.i("ForegroundService", "스레드 시작");
                        phoneUsageState = "PHONE_ON";

                        thread = new Thread(checkCurApp);
                        thread.start();
                    } else {
                        Log.i("ForegroundService", "phone on 알림 보내기");
                        sendAppPackageNameToJS(context, "", "", false, "PHONE_ON");
                    }
                }
            }
        };

        registerReceiver(screenReceiver, intentFilter);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.i("ForegroundService", "서비스 생성 시작");

        // 번들의 내용 받아오기
        if (intent.getExtras() != null) {
            if (intent.getExtras().containsKey("appList")) {
                Log.i("ForegroundService", "금지 앱 리스트 추가/변경");

                String JsonAppListStr = intent.getExtras().getString("appList");
                if (JsonAppListStr != null) {
                    prohibitedAppList = JsonTransmitter.convertJsonToAppListStr(JsonAppListStr);
                }
            }
            
            if (intent.getExtras().containsKey("isNotiNeeded") && intent.getBooleanExtra("isNotiNeeded", false)) {
                String title = intent.getExtras().getString("title");
                String content = intent.getExtras().getString("content");

                notifyMission(title, content);
            }
        }

        if (prohibitedAppList != null && prohibitedAppList.size() != 0) {
            // 금지 앱 리스트에 하나라도 금지 앱 존재하는 경우, 스레드 시작
            Log.i("ForegroundService", "스레드 시작");
            thread = new Thread(checkCurApp);
            thread.start();
        }

        if (phoneUsageState.equals("INIT")) {
            Log.i("ForegroundService", "phone on 알림 보내기");
            sendAppPackageNameToJS(getApplicationContext(), "", "", false, "PHONE_ON");
        }

        Log.i("ForegroundService", "현재 금지 앱 개수 = " + prohibitedAppList.size());
        Log.i("ForegroundService", "서비스 생성 종료");
        return START_REDELIVER_INTENT;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        unregisterReceiver(screenReceiver);
        // handler.removeCallbacks(runnableCode);
        isThreadRunning = false;
    }
    
    public void notifyMission(String title, String content) {
        Log.i("ForegroundService", "미션 noti 울리기");

        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_IMMUTABLE);

        notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                // 실제 알림창에 뜨는 내용 설정
                .setContentTitle(title)
                .setContentText(content)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(contentIntent)
                .build();

        startForeground(SERVICE_NOTIFICATION_ID, notification);
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            // 애플리케이션 -> 설정 -> 알림 카테고리에 뜨는 이름, 설명 설정
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "PHONE LOCK", importance);
            channel.setDescription("금지 앱 접속 확인 기능이 종료되지 않고 계속 수행되기 위해 필요한 알림입니다. ");
            notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    private static String getPackageName(@NonNull Context context) {
        UsageStatsManager usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);

        long lastRunAppTimeStamp = 0L;

        final long INTERVAL = 10000; // 1분 전에 켠 앱부터 확인
        final long end = System.currentTimeMillis();
        final long begin = end - INTERVAL;

        LongSparseArray packageNameMap = new LongSparseArray<>();

        final UsageEvents usageEvents = usageStatsManager.queryEvents(begin, end);

        while (usageEvents.hasNextEvent()) {

            UsageEvents.Event event = new UsageEvents.Event();
            usageEvents.getNextEvent(event);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                if (isForeGroundEvent(event)) {
                    packageNameMap.put(event.getTimeStamp(), event.getPackageName());
                    if (event.getTimeStamp() > lastRunAppTimeStamp) {
                        lastRunAppTimeStamp = event.getTimeStamp();
                    }
                }
            }
        }

        return packageNameMap.get(lastRunAppTimeStamp, "").toString();
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    private static boolean isForeGroundEvent(UsageEvents.Event event) {
        if (event == null) return false;

        if (BuildConfig.VERSION_CODE >= 29)
            return event.getEventType() == UsageEvents.Event.ACTIVITY_RESUMED;

        return event.getEventType() == UsageEvents.Event.MOVE_TO_FOREGROUND;
    }

    private void sendAppPackageNameToJS(Context context, String nowAppPackageName, String nowAppName, boolean nowIsProhibitedApp, String phoneUsageState) {
        Intent checkAppIntent = new Intent(context, HeadlessEventService.class);
        Bundle bundle = new Bundle();

        bundle.putString("appPackageName", nowAppPackageName);
        bundle.putString("appName", nowAppName);
        bundle.putBoolean("isProhibitedApp", nowIsProhibitedApp);
        if (phoneUsageState.equals("PHONE_ON")) bundle.putBoolean("isPhoneOn", true);
        else if (phoneUsageState.equals("PHONE_OFF")) bundle.putBoolean("isPhoneOff", true);

        checkAppIntent.putExtras(bundle);
        checkAppIntent.putExtra("key", "CheckApp");

        Log.i("ForegroundService", "checkAppEvnet JS쪽으로 전송");
        context.startService(checkAppIntent);

        HeadlessJsTaskService.acquireWakeLockNow(context);
    }
}