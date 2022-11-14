package com.sub;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.io.ByteArrayOutputStream;
import java.util.List;

public class AppListModule extends ReactContextBaseJavaModule {
    WritableMap map = null;

    AppListModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "AppListModule";
    }

    private Runnable getAppListRunnable = new Runnable() {
        @Override
        public void run() {
            Log.i("AppListModule", "앱 리스트 부르기 시작");
            ReactApplicationContext context = getReactApplicationContext();

            PackageManager pm = context.getPackageManager();
            List<PackageInfo> infoList = pm.getInstalledPackages(0);

            // js에서 사용 가능한 arr, map
            map = Arguments.createMap();
            WritableArray array = Arguments.createArray();

            for (PackageInfo info : infoList) {
                WritableMap app = Arguments.createMap();
                app.putString("name", info.applicationInfo.loadLabel(pm) + "");
                app.putString("packageName", info.packageName);

                // icon img
                // 1. drawble -> bitmap
                Drawable iconBitmapDrawable = info.applicationInfo.loadIcon(pm);
                Bitmap iconBitmap = Bitmap.createBitmap(iconBitmapDrawable.getIntrinsicWidth(), iconBitmapDrawable.getIntrinsicHeight(), Bitmap.Config.RGB_565);
                iconBitmap = Bitmap.createScaledBitmap(iconBitmap, 100, 100, true);
                Canvas canvas = new Canvas(iconBitmap);
                iconBitmapDrawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
                iconBitmapDrawable.draw(canvas);

                // 2. bitmap -> string
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                iconBitmap.compress(Bitmap.CompressFormat.JPEG, 30, baos);
                byte[] bytes = baos.toByteArray();
                String iconStr = Base64.encodeToString(bytes, Base64.DEFAULT);

                app.putString("icon", "data:image/jpeg;base64," + iconStr);

                array.pushMap(app);
            }
            map.putArray("appList", array);

            Log.i("AppListModule", "앱 리스트 부르기 종료");
        }
    };

    @ReactMethod
    public void getAppList(Promise promise) {
        try {
            Thread thread = new Thread(getAppListRunnable);
            thread.start();
            thread.join(); // 스레드 종료할 때까지 대기

            promise.resolve(map);
            map = null;
        } catch (Exception e) {
            promise.reject("error", e);
        }
    }
}
