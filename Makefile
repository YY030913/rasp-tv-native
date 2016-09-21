deploy:
	xcodebuild -workspace ios/RaspTvNative.xcworkspace -scheme RaspTvNative \
		-configuration Release \
		-destination "platform=iOS,id=232669f87b43cd4d1aef0033f60cb669cc2ae05f"

.PHONY: deploy
