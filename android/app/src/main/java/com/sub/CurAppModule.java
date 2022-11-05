package com.sub;

import android.app.AppOpsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;

public class CurAppModule extends ReactContextBaseJavaModule {
    boolean isAllowed;

    CurAppModule(ReactApplicationContext context) {
        super(context);
        isAllowed = checkPermission(context);
    }

    @Override
    public String getName() {
        return "CurAppModule";
    }

    // 권한 허용 함수
    @ReactMethod
    public void allowPermission(Promise promise) {
        try {
            ReactApplicationContext context = getReactApplicationContext();
            WritableMap map = Arguments.createMap();

            allowPermission();

            if (!checkPermission(context)) map.putBoolean("alreadyAllowed", false);
            else {
                // 권한 이미 허용된 경우
                isAllowed = true;
                map.putBoolean("alreadyAllowed", true);
            }

            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("error", e);
        }
    }

    private void allowPermission() {
        ReactApplicationContext context = getReactApplicationContext();

        if (!checkPermission(context)) {
            Intent permissionIntent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS, Uri.parse("package:" + context.getPackageName()));
            permissionIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(permissionIntent);
        }
    }

    @ReactMethod
    public void startService(ReadableArray appList) {
        ReactApplicationContext context = getReactApplicationContext();

        if (!checkPermission(context)) {
            allowPermission();
            return;
        }

        Intent checkAppServiceIntent = new Intent(context, CheckAppService.class);
        Bundle bundle = new Bundle();

        // 번들에 내용 담아서 넣어주기
        ArrayList<String> appArrList = Arguments.toList(appList);
        bundle.putStringArrayList("appList", appArrList);
        checkAppServiceIntent.putExtras(bundle);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            context.startForegroundService(checkAppServiceIntent);
        else
            context.startService(checkAppServiceIntent);
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