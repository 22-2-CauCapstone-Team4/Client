package com.sub;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.util.Date;

public class MissionActivity extends AppCompatActivity {
    private int passedTimeInt = 0;
    private int leftTimeInt = 0;
    private TextView passedTime;
    private TextView usedTime;
    private TextView leftTime;
    private TextView ableText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Bundle bundle = getIntent().getExtras();
        super.onCreate(bundle);
        setContentView(R.layout.mission_activity);

        // text 설정
        TextView goal = findViewById(R.id.categoryText);
        goal.setText(bundle.getString("goal") + " | ");

        TextView mission = findViewById(R.id.missionText);
        mission.setText(bundle.getString("mission"));

        TextView infoText = findViewById(R.id.infoText);
        infoText.setText("전체 " + bundle.getInt("totalNum") + "명이 함께함");

        passedTime = findViewById(R.id.passedTime);
        passedTimeInt = bundle.getInt("passedTime");
        passedTime.setText(mkTimeIntToStr(passedTimeInt));

        TextView usedTime = findViewById(R.id.usedTime);
        int usedTimeInt = bundle.getInt("usedTime");
        usedTime.setText(mkTimeIntToStr(usedTimeInt));

        leftTimeInt = bundle.getInt("leftTime");
        leftTime = findViewById(R.id.leftText);
        ableText = findViewById(R.id.ableText);
        if (leftTimeInt > 0) {
            ableText.setVisibility(View.GONE);
            leftTime.setVisibility(View.VISIBLE);
            leftTime.setText(mkTimeIntToStrWithText(leftTimeInt) + " 뒤 사용 가능");
        }

        Button quitButton = findViewById(R.id.quit);
        quitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Context context = getApplicationContext();

                Intent intent = new Intent(context, MainActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            }
        });

        Button useButton = findViewById(R.id.useButton);
        useButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // *TODO : headless 연결 (버튼 클릭)
            }
        });

        // 1초마다 화면 갱신
        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                if (true) {
                    handler.postDelayed(this,1000);
                }
                passedTimeInt++;
                passedTime.setText(mkTimeIntToStr(passedTimeInt));

                if (leftTimeInt > 0) {
                    leftTimeInt--;
                    leftTime.setText(mkTimeIntToStrWithText(leftTimeInt) + " 뒤 사용 가능");
                } if (leftTimeInt == 0) {
                    ableText.setVisibility(View.VISIBLE);
                    leftTime.setVisibility(View.GONE);
                }
            }
        }, 1000);
    }

    //뒤로 가기 차단
    @Override
    public void onBackPressed() {
        // super.onBackPressed();
    }

    private String mkTimeIntToStr(int time) {
        int hour = (int)(time / (60 * 60));
        time -= hour * 60 * 60;
        int min = (int)(time / 60);
        time -= min * 60;
        int sec = time;

        return hour + ":" +  (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
    }

    private String mkTimeIntToStrWithText(int time) {
        int hour = (int)(time / (60 * 60));
        time -= hour * 60 * 60;
        int min = (int)(time / 60);
        time -= min * 60;
        int sec = time;

        return (hour != 0 ? hour + "시간 "  : "") +  (min != 0 ? (min < 10 ? "0" + min : min) + "분 " : "") + (sec < 10 ? "0" + sec : sec) + "초";
    }
}