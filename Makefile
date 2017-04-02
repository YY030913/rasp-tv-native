deploy:
	xcodebuild -workspace ios/RaspTvNative.xcworkspace -scheme RaspTvNative \
		-configuration Release

.PHONY: deploy
