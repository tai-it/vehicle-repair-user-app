package com.suaxe4dot0;

import android.os.Bundle;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;

import com.reactnativenavigation.NavigationActivity;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends NavigationActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);

      SplashScreen.show(this);

      // setContentView(R.layout.launch_screen);

      // ImageView launchImage = (ImageView) findViewById(R.id.launchImage);
      // Animation rotationAnimation = AnimationUtils.loadAnimation(MainActivity.this, R.anim.clockwise_rotation);
      // launchImage.startAnimation(rotationAnimation);
  }
}
