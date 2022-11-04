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
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.util.LongSparseArray;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

import com.facebook.react.HeadlessJsTaskService;

import java.util.ArrayList;

public class CheckAppService extends Service {
    private static final int SERVICE_NOTIFICATION_ID = 315;
    private static final String CHANNEL_ID = "PHONELOCK";

    private String appPackageName = "";
    private boolean isProhibitedApp = true; // 처음에는 일단 JS쪽에 신호 보내야 함
    private ArrayList<String> prohibitedAppList = null;

    private NotificationManager notificationManager;
    private Notification notification;

    private BroadcastReceiver receiver;
    private IntentFilter intentFilter;

    private boolean isThreadRunning = false;
    // private Handler handler = new Handler();
    private Runnable runnableCode = new Runnable() {
        @Override
        public void run() {
            Context context = getApplicationContext();

            if (isThreadRunning) return;
            isThreadRunning = true;

            while (isThreadRunning) {
                // 현재 foreground 앱의 패키지 이름 확인
                String nowAppPackageName = getPackageName(context);
                boolean nowIsProhibitedApp = prohibitedAppList.contains(nowAppPackageName);

                Log.i("CheckAppService", "AppName = " + nowAppPackageName);

                // ""이 오는 경우, 같은 화면 유지 중인 상황 (고려할 필요 X)
                if (!nowAppPackageName.equals("") && !nowAppPackageName.equals(appPackageName)) {
                    // 현재 앱이 금지 앱이거나, 현재 앱이 금지 앱이 아니고 직전 앱이 금지 앱이었던 경우
                    // JS쪽에 이벤트를 보내 금지 앱 상황 알리기
                    if (prohibitedAppList.contains(nowAppPackageName) || (!prohibitedAppList.contains(nowAppPackageName) && isProhibitedApp))
                        sendAppPackageNameToJS(context, nowAppPackageName, nowIsProhibitedApp);

                    appPackageName = nowAppPackageName;
                    isProhibitedApp = nowIsProhibitedApp;
                }

                try {
                    Thread.sleep(2000);
                } catch (Exception e) {
                    e.printStackTrace();
                    break;
                }
            }

            // handler.postDelayed(this, 2000); // 2초에 한 번
        }
    };

    private Thread thread;

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // 번들의 내용 받아오기
        if (intent.getExtras() != null && intent.getExtras().containsKey("appList")) {
            ArrayList<String> appArrList = intent.getExtras().getStringArrayList("appList");
            if (appArrList != null)
                prohibitedAppList = appArrList;

            for (String appName : appArrList)
                Log.i("CheckAppService", appName);
        }

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

        thread = new Thread(runnableCode);
        thread.start();

        // 화면 꺼지고 켜지는 상황 대응하기
        intentFilter = new IntentFilter();
        intentFilter.addAction(Intent.ACTION_SCREEN_OFF);
        intentFilter.addAction(Intent.ACTION_SCREEN_ON);

        receiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (intent.getAction().equals(Intent.ACTION_SCREEN_OFF)) {
                    Log.i("CheckAppService", "화면 꺼짐");

                    // 화면 끈 경우, 코드가 반복될 필요 없음 (켜졌을 때 다시 반복을 시작해주면 됨)
                    // handler.removeCallbacks(runnableCode);
                    isThreadRunning = false;

                    // 감지 앱 사용 중이었던 경우, 꺼졌다는 신호를 보내주어야 함
                    if (isProhibitedApp)
                        sendAppPackageNameToJS(context, "", false);

                    appPackageName = "";
                    isProhibitedApp = false;
                } else if (intent.getAction().equals(Intent.ACTION_SCREEN_ON)) {
                    Log.i("CheckAppService", "화면 켜짐");

                    // 화면 켠 경우, 다시 반복 시작
                    // handler.post(runnableCode);
                    thread = new Thread(runnableCode);
                    thread.start();
                }
            }
        };
        registerReceiver(receiver, intentFilter);

        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        // handler.removeCallbacks(runnableCode);
        isThreadRunning = false;
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

    private void sendAppPackageNameToJS(Context context, String nowAppPackageName, boolean nowIsProhibitedApp) {
        Intent checkAppIntent = new Intent(context, CheckAppEventService.class);
        Bundle bundle = new Bundle();

        bundle.putString("appPackageName", nowAppPackageName);
        bundle.putBoolean("isProhibitedApp", nowIsProhibitedApp);
        checkAppIntent.putExtras(bundle);

        Log.i("CheckAppService", "JS쪽으로 전송");
        context.startService(checkAppIntent);

        HeadlessJsTaskService.acquireWakeLockNow(context);
    }
}