package com.sub;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy;
import com.facebook.react.jstasks.LinearCountingRetryPolicy;

public class BootEventService extends HeadlessJsTaskService {
    HeadlessJsTaskRetryPolicy retryPolicy = new LinearCountingRetryPolicy(
            5, // Max number of retry attempts
            2000 // Delay between each retry attempt
    );

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
                    true,
                    retryPolicy
            );
        }
        return null;
    }
}