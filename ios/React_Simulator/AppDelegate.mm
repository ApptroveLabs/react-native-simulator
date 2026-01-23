#import "AppDelegate.h"

#import <FirebaseCore/FirebaseCore.h>
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

  // Manual Firebase configuration to avoid GoogleService-Info.plist crash
  // Using values from android/app/google-services.json where available
  FIROptions *options =
      [[FIROptions alloc] initWithGoogleAppID:@"1:5902S1156446:ios:a1b2c3d4e5f6"
                                  GCMSenderID:@"590241156446"];
  options.APIKey = @"AIzaSyAZSEOY0MpDXsABUL0o3ucSmG2M_Xf4eIY";
  options.projectID = @"trackier-Ga207";
  options.storageBucket = @"trackier-5a207.firebasestorage.app";

  [FIRApp configureWithOptions:options];

  self.moduleName = @"React_Simulator";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application
      didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
  return [self bundleURL];
}

- (NSURL *)bundleURL {
#if DEBUG
  return
      [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main"
                                 withExtension:@"jsbundle"];
#endif
}

@end
