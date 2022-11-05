package com.sub;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.util.Base64;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

public class AppListModule extends ReactContextBaseJavaModule {
    AppListModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "AppListModule";
    }

    @ReactMethod
    public void getAppList(Promise promise) {
        try {
            ReactApplicationContext context = getReactApplicationContext();

            PackageManager pm = context.getPackageManager();
            List<PackageInfo> infoList = pm.getInstalledPackages(0);

            // js에서 사용 가능한 arr, map
            WritableMap map = Arguments.createMap();
            WritableArray name = Arguments.createArray();
            WritableArray packageName = Arguments.createArray();
            WritableArray icon = Arguments.createArray();

            for (PackageInfo info : infoList) {
                name.pushString(info.applicationInfo.loadLabel(pm) + "");
                packageName.pushString(info.packageName);

                // icon img
                // 1. drawble -> bitmap
                Drawable iconBitmapDrawable = info.applicationInfo.loadIcon(pm);
                Bitmap iconBitmap = Bitmap.createBitmap(iconBitmapDrawable.getIntrinsicWidth(), iconBitmapDrawable.getIntrinsicHeight(), Bitmap.Config.ARGB_8888);
                iconBitmap = Bitmap.createScaledBitmap(iconBitmap, 150, 150, true);
                Canvas canvas = new Canvas(iconBitmap);
                iconBitmapDrawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
                iconBitmapDrawable.draw(canvas);

                // 2. bitmap -> string
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                iconBitmap.compress(Bitmap.CompressFormat.PNG, 50, baos);
                byte[] bytes = baos.toByteArray();
                String iconStr = Base64.encodeToString(bytes, Base64.DEFAULT);

                icon.pushString("data:image/png;base64," + iconStr);
            }

            map.putArray("nameList", name);
            map.putArray("packageNameList", packageName);
            map.putArray("iconList", icon);
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("error", e);
        }
    }
}