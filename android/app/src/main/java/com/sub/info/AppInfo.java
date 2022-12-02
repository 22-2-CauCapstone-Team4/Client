package com.sub.info;

public class AppInfo {
    private String packageName;
    private String name;

    public AppInfo(String packageName, String name) {
        this.packageName = packageName;
        this.name = name;
    }

    public String getPackageName() {
        return packageName;
    }

    public String getName() {
        return name;
    }
}
