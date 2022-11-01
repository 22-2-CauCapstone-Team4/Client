package com.sub;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

public class CheckAppService extends Service {
    private static final int SERVICE_NOTIFICATION_ID = 0315;
    private static final String CHANNEL_ID = "PHONELOCK";

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        createNotificationChannel(); // Creating channel for API 26+
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                // 실제 알림창에 뜨는 내용 설정
                .setContentTitle("감지 중")
                .setContentText("금지 앱 접속을 감지 중입니다. ")
                .setSmallIcon(R.mipmap.ic_launcher)
                .build();

        startForeground(SERVICE_NOTIFICATION_ID, notification);
        return START_STICKY;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            // 애플리케이션 -> 설정 -> 알림 카테고리에 뜨는 이름, 설명 설정
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "PHONE LOCK", importance);
            channel.setDescription("금지 앱 접속 확인 기능이 종료되지 않고 계속 수행되기 위해 필요한 알림입니다. ");
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }
}