package com.rasptvnative;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.google.android.gms.cast.framework.CastContext;

/**
 * Created by Joe on 4/1/17.
 */

public class ChromecastManager extends ReactContextBaseJavaModule {
    public ChromecastManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ChromecastManager";
    }
}
