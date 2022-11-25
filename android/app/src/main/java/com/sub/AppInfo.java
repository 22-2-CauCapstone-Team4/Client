package com.sub;

public class AppInfo {
    private String packageName;
    private String name;

    AppInfo(String packageName, String name) {
        this.packageName = packageName;
        this.name = name;
    }

    String getPackageName() {
        return packageName;
    }

    String getName() {
        return name;
    }
}
