package com.rasptvnative;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.cast.Cast;
import com.google.android.gms.cast.MediaInfo;
import com.google.android.gms.cast.MediaMetadata;
import com.google.android.gms.cast.framework.CastContext;
import com.google.android.gms.cast.framework.CastSession;
import com.google.android.gms.cast.framework.CastState;
import com.google.android.gms.cast.framework.CastStateListener;
import com.google.android.gms.cast.framework.media.RemoteMediaClient;
import com.google.android.gms.common.images.WebImage;

import java.util.Map;
import java.util.HashMap;

import javax.annotation.Nullable;

public class ChromecastManager extends ReactContextBaseJavaModule {

    private final String MOVIE_ID_KEY = "MovieId";
    private final String EPISODE_ID_KEY = "EpisodeId";
    private final String LOG_TAG = "ChromecastManager";

    private final ReactApplicationContext reactContext;
    private final ChromecastStateListener stateListener;
    private final MediaInfoUpdateListener mediaInfoUpdateListener;

    private class ChromecastStateListener implements CastStateListener {
        @Override
        public void onCastStateChanged(int i) {
            sendCastState(i);
        }
    }

    private class LifeCycleListener implements LifecycleEventListener {
        @Override
        public void onHostResume() {
            reactContext.runOnUiQueueThread(new Runnable() {
                @Override
                public void run() {
                    Log.d(LOG_TAG, "Host Resume");
                    CastContext.getSharedInstance(reactContext).addCastStateListener(stateListener);
                    CastContext.getSharedInstance(reactContext).removeCastStateListener(stateListener);
                    CastContext.getSharedInstance(reactContext).addCastStateListener(stateListener);
                }
            });
        }

        @Override
        public void onHostPause() {
            reactContext.runOnUiQueueThread(new Runnable() {
                @Override
                public void run() {
                    Log.d(LOG_TAG, "Host Paused");
                    CastContext.getSharedInstance(reactContext).removeCastStateListener(stateListener);
                }
            });
        }

        @Override
        public void onHostDestroy() {
        }
    }

    private class MediaInfoUpdateListener implements RemoteMediaClient.Listener {
        private void sendUpdate() {
            reactContext.runOnUiQueueThread(new Runnable() {
                @Override
                public void run() {
                    Log.d(LOG_TAG, "Metadata Update");
                    CastSession session = CastContext.getSharedInstance(reactContext).getSessionManager().getCurrentCastSession();
                    if (session == null) {
                        return;
                    }

                    RemoteMediaClient rmClient = session.getRemoteMediaClient();
                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("MediaStatusUpdated", convertMediaInfoToJsObj(rmClient));
                }
            });
        }
        @Override
        public void onStatusUpdated() {
//            sendUpdate();
        }

        @Override
        public void onMetadataUpdated() {
            sendUpdate();
        }

        @Override
        public void onQueueStatusUpdated() {

        }

        @Override
        public void onPreloadStatusUpdated() {

        }

        @Override
        public void onSendingRemoteMediaRequest() {

        }

        @Override
        public void onAdBreakStatusUpdated() {

        }
    }

    public ChromecastManager(ReactApplicationContext ctx) {
        super(ctx);
        this.reactContext = ctx;
        stateListener = new ChromecastStateListener();
        mediaInfoUpdateListener = new MediaInfoUpdateListener();
        reactContext.addLifecycleEventListener(new LifeCycleListener());
    }

    @Override
    public void initialize() {
        super.initialize();
        reactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                Log.d(LOG_TAG, "Initialized");
                int state = CastContext.getSharedInstance(reactContext).getCastState();
                sendCastState(state);
            }
        });
    }

    @ReactMethod
    public void castVideo(final String videoUrl, final String title, final int movieId, final int episodeId, final String imageUrl) {
        reactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                Log.d(LOG_TAG, String.format("Casting %s - %s", title, videoUrl));
                CastSession session = CastContext.getSharedInstance(reactContext).getSessionManager().getCurrentCastSession();
                if (session == null) {
                    return;
                }

                MediaMetadata metadata = new MediaMetadata(MediaMetadata.MEDIA_TYPE_MOVIE);
                metadata.putString(MediaMetadata.KEY_TITLE, title);
                metadata.addImage(new WebImage(Uri.parse(imageUrl), 480, 360));
                metadata.putInt(MOVIE_ID_KEY, movieId);
                metadata.putInt(EPISODE_ID_KEY, episodeId);

                MediaInfo mediaInfo = new MediaInfo.Builder(videoUrl)
                        .setStreamType(MediaInfo.STREAM_TYPE_BUFFERED)
                        .setContentType("video/mp4")
                        .setMetadata(metadata)
                        .build();

                RemoteMediaClient rmClient = session.getRemoteMediaClient();
                rmClient.addListener(mediaInfoUpdateListener);
                rmClient.load(mediaInfo);
            }
        });
    }

    @ReactMethod
    public void pause() {
        reactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                Log.d(LOG_TAG, "Pause");
                CastSession session = CastContext.getSharedInstance(reactContext).getSessionManager().getCurrentCastSession();
                if (session == null) {
                    return;
                }

                session.getRemoteMediaClient().pause();
            }
        });
    }

    @ReactMethod
    public void stop() {
        reactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                Log.d(LOG_TAG, "Stop");
                CastSession session = CastContext.getSharedInstance(reactContext).getSessionManager().getCurrentCastSession();
                if (session == null) {
                    return;
                }

                RemoteMediaClient rmClient = session.getRemoteMediaClient();
                rmClient.removeListener(mediaInfoUpdateListener);
                rmClient.stop();
            }
        });
    }

    @ReactMethod
    public void getStreamPosition(final Callback cb) {
        reactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                CastSession session = CastContext.getSharedInstance(reactContext).getSessionManager().getCurrentCastSession();
                if (session == null) {
                    cb.invoke(0);
                    return;
                }

                long pos = session.getRemoteMediaClient().getApproximateStreamPosition();
                Log.v(LOG_TAG, "Get Stream Position: " + pos);
                cb.invoke((int) pos);
            }
        });
    }

    @ReactMethod
    public void seekToTime(final int position) {
        reactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                Log.d(LOG_TAG, "Seek to " + position);
                CastSession session = CastContext.getSharedInstance(reactContext).getSessionManager().getCurrentCastSession();
                if (session == null) {
                    return;
                }

                session.getRemoteMediaClient().seek(position);
            }
        });
    }

    @ReactMethod
    public void play() {
        reactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                Log.d(LOG_TAG, "Play");
                CastSession session = CastContext.getSharedInstance(reactContext).getSessionManager().getCurrentCastSession();
                if (session == null) {
                    return;
                }

                session.getRemoteMediaClient().play();
            }
        });
    }

    @ReactMethod
    public void getCurrentSession(final Promise promise) {
        reactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                Log.d(LOG_TAG, "GetCurrentSession");
                CastSession session = CastContext.getSharedInstance(reactContext).getSessionManager().getCurrentCastSession();
                if (session == null) {
                    Log.d(LOG_TAG, "GetCurrentSession no session");
                    promise.resolve(null);
                    return;
                }

                RemoteMediaClient rmClient = session.getRemoteMediaClient();
                if (rmClient == null) {
                    Log.d(LOG_TAG, "GetCurrentSession no remote media client");
                    promise.resolve(null);
                    return;
                }

                promise.resolve(convertMediaInfoToJsObj(rmClient));
            }
        });
    }

    @Override
    public String getName() {
        return "ChromecastManager";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("CAST_STATE_CONNECTED", CastState.CONNECTED);
        constants.put("CAST_STATE_CONNECTING", CastState.CONNECTING);
        constants.put("CAST_STATE_NO_DEVICES_AVAILABLE", CastState.NO_DEVICES_AVAILABLE);
        constants.put("CAST_STATE_NOT_CONNECTED", CastState.NOT_CONNECTED);
        return constants;
    }

    private WritableMap convertMediaInfoToJsObj(RemoteMediaClient rmClient) {
        MediaInfo mediaInfo = rmClient.getMediaInfo();
        if (mediaInfo == null) {
            return null;
        }
        MediaMetadata metadata = mediaInfo.getMetadata();
        WritableMap jsObject = Arguments.createMap();
        jsObject.putDouble("Duration", mediaInfo.getStreamDuration());
        jsObject.putString("Title", metadata.getString(MediaMetadata.KEY_TITLE));
        jsObject.putBoolean("IsPaused", rmClient.isPaused());
        jsObject.putInt("MovieId", metadata.getInt(MOVIE_ID_KEY));
        jsObject.putInt("EpisodeId", metadata.getInt(EPISODE_ID_KEY));
        jsObject.putDouble("Position", rmClient.getApproximateStreamPosition());
        jsObject.putBoolean("IsPlaying", rmClient.isPlaying());
        return jsObject;
    }

    private void sendCastState(int i) {
        Log.d(LOG_TAG, "Cast state = "+i);
        WritableMap params = Arguments.createMap();
        params.putInt("state", i);
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("CastStateChanged", params);
    }
}
