package com.sub;

import android.util.Log;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class JsonTransmitter {
    static ArrayList<AppInfo> convertJsonToAppListStr(String JsonAppListStr) {
        ArrayList<AppInfo> appList = null;

        try {
            JSONArray JsonAppList = new JSONArray(JsonAppListStr);
            appList = convertJsonToAppList(JsonAppList);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return appList;
    }

    static ArrayList<AppInfo> convertJsonToAppList(JSONArray JsonAppList) {
        ArrayList<AppInfo> appList = new ArrayList<>();

        try {
            for (int i = 0; i < JsonAppList.length(); i++) {
                JSONObject temp = JsonAppList.getJSONObject(i);
                String packageName = temp.getString("packageName");
                String name = temp.getString("name");

                Log.i("JsonTransmitter", "package name = " + packageName + ", name = " + name);

                AppInfo newAppInfo = new AppInfo(packageName, name);
                appList.add(newAppInfo);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return appList;
    }

    // json 객체로 변환해서 받아오기
    static JSONObject convertMapToJson(ReadableMap readableMap) {
        JSONObject object = new JSONObject();

        try {
            ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
            while (iterator.hasNextKey()) {
                String key = iterator.nextKey();
                switch (readableMap.getType(key)) {
                    case Null:
                        object.put(key, JSONObject.NULL);
                        break;
                    case Boolean:
                        object.put(key, readableMap.getBoolean(key));
                        break;
                    case Number:
                        object.put(key, readableMap.getDouble(key));
                        break;
                    case String:
                        object.put(key, readableMap.getString(key));
                        break;
                    case Map:
                        object.put(key, convertMapToJson(readableMap.getMap(key)));
                        break;
                    case Array:
                        object.put(key, convertArrayToJson(readableMap.getArray(key)));
                        break;
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return object;
    }

    static JSONArray convertArrayToJson(ReadableArray readableArray) {
        JSONArray array = new JSONArray();

        try {
            for (int i = 0; i < readableArray.size(); i++) {
                switch (readableArray.getType(i)) {
                    case Null:
                        break;
                    case Boolean:
                        array.put(readableArray.getBoolean(i));
                        break;
                    case Number:
                        array.put(readableArray.getDouble(i));
                        break;
                    case String:
                        array.put(readableArray.getString(i));
                        break;
                    case Map:
                        array.put(convertMapToJson(readableArray.getMap(i)));
                        break;
                    case Array:
                        array.put(convertArrayToJson(readableArray.getArray(i)));
                        break;
                }
            }
        }
        catch (JSONException e) {
            e.printStackTrace();
        }

        return array;
    }
}
