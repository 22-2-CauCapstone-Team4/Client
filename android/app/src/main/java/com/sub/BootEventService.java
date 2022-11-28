package com.sub;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
public class BootEventService extends HeadlessJsTaskService {
    public BootEventService() {
    }

    @Override
    protected @Nullable
    HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        Log.i("BootEventService", "headless로 전송");

        if (extras != null) {
            return new HeadlessJsTaskConfig(
                    "Boot",
                    Arguments.fromBundle(extras),
                    5000,
                    true
            );
        }
        return null;
    }
}