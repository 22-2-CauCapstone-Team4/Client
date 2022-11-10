package com.sub;

import android.app.AppOpsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;

public class LockAppModule extends ReactContextBaseJavaModule {
    boolean isAllowed;

    LockAppModule(ReactApplicationContext context) {
        super(context);
        isAllowed = checkPermission(context);
    }

    @Override
    public String getName() {
        return "LockAppModule";
    }

    // 권한 확인 함수
    @ReactMethod
    public void checkPermission(Promise promise) {
        try {
            ReactApplicationContext context = getReactApplicationContext();
            WritableMap map = Arguments.createMap();

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

    @ReactMethod
    public void viewLockScreen() {
        ReactApplicationContext context = getReactApplicationContext();

        if (checkPermission(context)) {
            Intent intent = new Intent(context, MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        }
    }

    private void allowPermission() {
        ReactApplicationContext context = getReactApplicationContext();

        if (!checkPermission(context) && Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Intent permissionIntent = null;
            permissionIntent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + context.getPackageName()));
            permissionIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(permissionIntent);
        }
    }

    // 권한 체크 함수
    private boolean checkPermission(ReactApplicationContext context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
            return Settings.canDrawOverlays(context);
        else return true;
    }
}
