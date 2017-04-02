package com.rasptvnative;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactFragmentActivity;
import com.google.android.gms.cast.framework.CastContext;

public class MainActivity extends ReactFragmentActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "RaspTvNative";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }
}
