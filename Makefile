deploy:
	xcodebuild -workspace ios/RaspTvNative.xcworkspace -scheme RaspTvNative \
		-configuration Release

deploy-android:
	cd android && ./gradlew assembleRelease
	adb install -r android/app/build/outputs/apk/app-release.apk

.PHONY: deploy deploy-android
