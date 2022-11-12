package com.sub;

import android.app.AppOpsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Message;
import android.os.Messenger;
import android.os.RemoteException;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;

public class ForegroundServiceModule extends ReactContextBaseJavaModule {
    // 서비스 시작 유무 확인
    private boolean isServiceStarted = false;
    private Messenger messenger = null;

    ForegroundServiceModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "ForegroundServiceModule";
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

            Log.i("ForegroundServiceModule",  "허용 함수 호출");
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

    @ReactMethod
    public void startService(ReadableArray appList) {
        ReactApplicationContext context = getReactApplicationContext();

        if (!checkPermission(context) || !LockAppModule.checkPermission(context)) {
            return;
        }

        Intent checkAppServiceIntent = new Intent(context, ForegroundService.class);
        Bundle bundle = new Bundle();

        // 번들에 내용 담아서 넣어주기
        ArrayList<String> appArrList = Arguments.toList(appList);
        bundle.putStringArrayList("appList", appArrList);
        checkAppServiceIntent.putExtras(bundle);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            context.startForegroundService(checkAppServiceIntent);
        else
            context.startService(checkAppServiceIntent);

        isServiceStarted = true;
    }

    private void allowPermission() {
        ReactApplicationContext context = getReactApplicationContext();

        if (!checkPermission(context)) {
            Intent permissionIntent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS, Uri.parse("package:" + context.getPackageName()));
            permissionIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(permissionIntent);
        }
    }

    // 권한 체크 함수
    private boolean checkPermission(ReactApplicationContext context) {
        boolean granted;
        AppOpsManager appOps = (AppOpsManager) context.getSystemService(Context.APP_OPS_SERVICE);

        int mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS,
                android.os.Process.myUid(), context.getPackageName());

        if (mode == AppOpsManager.MODE_DEFAULT)
            granted = (context.checkCallingOrSelfPermission(
                    android.Manifest.permission.PACKAGE_USAGE_STATS) == PackageManager.PERMISSION_GRANTED);
        else granted = (mode == AppOpsManager.MODE_ALLOWED);

        return granted;
    }
}