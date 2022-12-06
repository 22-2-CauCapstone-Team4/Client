package com.sub;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

public class HeadlessEventService extends HeadlessJsTaskService {
    public HeadlessEventService() {
    }

    @Override
    protected @Nullable
    HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        String key = intent.getStringExtra("key");

        Log.i("HeadlessEventService", key + " 트리거, headless로 이벤트 전송");

        if (extras != null) {
            return new HeadlessJsTaskConfig(
                    key,
                    Arguments.fromBundle(extras),
                    5000,
                    true
            );
        }
        return null;
    }
}
