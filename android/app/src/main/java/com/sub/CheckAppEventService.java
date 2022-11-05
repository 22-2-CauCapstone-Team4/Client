package com.sub;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

public class CheckAppEventService extends HeadlessJsTaskService {
    public CheckAppEventService() {
    }

    @Override
    protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        if (extras != null) {
            return new HeadlessJsTaskConfig(
                    "CheckApp",
                    Arguments.fromBundle(extras),
                    5000,
                    true
            );
        }
        return null;
    }
}