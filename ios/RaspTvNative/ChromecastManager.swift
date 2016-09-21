//
//  ChromecastManager.swift
//  ChromeCastExperiments
//
//  Created by Edmondo Pentangelo on 13/08/2015.
//

import Foundation

// ChromecastManager.swift

@objc(ChromecastManager)
class ChromecastManager: NSObject, GCKDeviceScannerListener, GCKDeviceManagerDelegate, GCKMediaControlChannelDelegate {

  var bridge          : RCTBridge!

  fileprivate var deviceManager: GCKDeviceManager?
  fileprivate var deviceScanner: GCKDeviceScanner
  fileprivate var mediaControlChannel: GCKMediaControlChannel?

  fileprivate lazy var kReceiverAppID:String = {
    //You can add your own app id here that you get by registering with the
    // Google Cast SDK Developer Console https://cast.google.com/publish
    return kGCKMediaDefaultReceiverApplicationID
  }()

  fileprivate var devices: Dictionary<String, GCKDevice> = Dictionary<String, GCKDevice>()

  // Required init.
  required override init() {
    let filterCriteria = GCKFilterCriteria(forAvailableApplicationWithID: kGCKMediaDefaultReceiverApplicationID)
    deviceScanner = GCKDeviceScanner(filterCriteria:filterCriteria)
  }

  @objc func startScan() -> Void {
    DispatchQueue.main.async(execute: { [unowned self] in
      // Initialize device scanner
      print("Started scanning")
      self.deviceScanner.add(self)
      self.deviceScanner.startScan()
      })
  }
  
  @objc func stopScan() -> Void {
    DispatchQueue.main.async(execute: { [unowned self] in
      print("Stopped scanning")
      self.deviceScanner.remove(self)
      self.deviceScanner.stopScan()
    })
  }
  
  @objc func connectToDevice(_ deviceName: String) -> Void {
    let selectedDevice = self.devices[deviceName]
    if (selectedDevice == nil) {
      return
    }

    DispatchQueue.main.async(execute: { [unowned self] in
      let identifier = Bundle.main.infoDictionary?["CFBundleIdentifier"] as! String
      self.deviceManager = GCKDeviceManager(device: selectedDevice!, clientPackageName: identifier)
      self.deviceManager!.delegate = self
      self.deviceManager!.connect()
      })
  }

  @objc func disconnect() -> Void {
    if (self.deviceManager == nil) {
      return
    }
    DispatchQueue.main.async(execute: { [unowned self] in
      // Disconnect button.
      self.deviceManager!.leaveApplication()
      self.deviceManager!.disconnect()
      })
  }

  @objc func pause() -> Void {
    self.mediaControlChannel?.pause();
  }

  @objc func play() -> Void {
    self.mediaControlChannel?.play();
  }

  @objc func stop() -> Void {
    self.mediaControlChannel?.stop();
  }

  @objc func seekToTime(_ time: Double) -> Void {
    let timeInterval = TimeInterval(time);
    self.mediaControlChannel?.seek(toTimeInterval: timeInterval);
  }

  @objc func getStreamPosition(_ successCallback: RCTResponseSenderBlock) -> Void {
    let position = self.mediaControlChannel?.approximateStreamPosition();
    if (position != nil) {
      let positionDouble = Double(position!);
      successCallback([positionDouble]);
    }
  }

  @objc func castVideo(_ videoUrl: String, title: String, movieId: Int, episodeId: Int, imageUrl: String) -> Void {
    print("Cast Video")

    // Show alert if not connected.
    if (deviceManager?.connectionState != GCKConnectionState.connected) {
      print("Not connected to device");
      return
    }

    // [START media-metadata]
    // Define Media Metadata.
    let metadata = GCKMediaMetadata()
    metadata!.setString(title, forKey: kGCKMetadataKeyTitle)
    metadata!.setInteger(movieId, forKey: "movieId")
    metadata!.setInteger(episodeId, forKey: "episodeId")

    let url = URL(string:imageUrl)
    metadata!.addImage(GCKImage(url: url!, width: 480, height: 360))
    // [END media-metadata]

    // [START load-media]
    // Define Media Information.
    let mediaInformation = GCKMediaInformation(
      contentID: videoUrl,
      streamType: GCKMediaStreamType.none,
      contentType: "video/mp4",
      metadata: metadata,
      streamDuration: 0,
      mediaTracks: [],
      textTrackStyle: nil,
      customData: nil
    )

    DispatchQueue.main.async(execute: { [unowned self] in
      // Cast the media
      self.mediaControlChannel!.loadMedia(mediaInformation, autoplay: true)
    })
  }

  func mediaControlChannelDidUpdateStatus(_ mediaControlChannel: GCKMediaControlChannel) {
    print("updated status");
    if (mediaControlChannel.isConnected && mediaControlChannel.mediaStatus != nil) {
      let info = mediaControlChannel.mediaStatus?.mediaInformation;
      if (info == nil) {
        return;
      }

      print(info!.streamDuration);
      let data = ["Duration": info!.streamDuration,
                  "Title": info!.metadata!.string(forKey: kGCKMetadataKeyTitle),
                  "IsPaused": mediaControlChannel.mediaStatus?.playerState == GCKMediaPlayerState.paused,
                  "MovieId": info!.metadata!.integer(forKey: "movieId"),
                  "EpisodeId": info!.metadata!.integer(forKey: "episodeId"),
                  "Position": mediaControlChannel.mediaStatus!.streamPosition] as [String : Any]
      self.bridge.eventDispatcher().sendDeviceEvent(withName: "MediaStatusUpdated", body: data);
    }
  }

  func deviceManagerDidConnect(_ deviceManager: GCKDeviceManager) {
    print("Connected.")
    DispatchQueue.main.async(execute: { [unowned self] in
      self.deviceManager!.launchApplication(self.kReceiverAppID, with: GCKLaunchOptions())
    })
  }

  func deviceManager(_ deviceManager: GCKDeviceManager, didConnectToCastApplication applicationMetadata: GCKApplicationMetadata, sessionID: String, launchedApplication: Bool) {
    print("Application has launched.")
    self.mediaControlChannel = GCKMediaControlChannel()
    mediaControlChannel!.delegate = self
    deviceManager.add(mediaControlChannel!)
    mediaControlChannel!.requestStatus()
  }

  func deviceDidComeOnline(_ device: GCKDevice) {
    print("Device found: \(device.friendlyName)")
    devices[device.friendlyName!] = device;
    emitDeviceListChanged(["Devices": Array(devices.keys)])  }

  func deviceDidGoOffline(_ device: GCKDevice) {
    print("Device went away: \(device.friendlyName)")
    devices.removeValue(forKey: device.friendlyName!);
    emitDeviceListChanged(["Devices": Array(devices.keys)])
  }

  fileprivate func emitDeviceListChanged(_ data: Dictionary<String, Any>) {
    self.bridge.eventDispatcher().sendDeviceEvent(withName: "DeviceListChanged", body: data)
  }
}
