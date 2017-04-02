package com.rasptvnative;

import android.support.v7.app.MediaRouteButton;
import android.view.View;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.google.android.gms.cast.framework.CastButtonFactory;

/**
 * Created by Joe on 4/1/17.
 */

public class ChromecastButtonManager extends SimpleViewManager<MediaRouteButton> {
    @Override
    public String getName() {
        return "ChromecastButtonManager";
    }

    @Override
    protected MediaRouteButton createViewInstance(ThemedReactContext reactContext) {
        MediaRouteButton btn = new MediaRouteButton(reactContext);
        CastButtonFactory.setUpMediaRouteButton(reactContext, btn);
        return btn;
    }
}
