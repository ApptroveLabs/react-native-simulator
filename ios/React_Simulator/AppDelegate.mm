#import "AppDelegate.h"

#import <FirebaseCore/FirebaseCore.h>
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

  // Manual Firebase configuration using valid parameters from GoogleService-Info.plist
  FIROptions *options =
      [[FIROptions alloc] initWithGoogleAppID:@"1:758572953491:ios:30fec10e619cc49ebac266"
                                  GCMSenderID:@"758572953491"];
  options.APIKey = @"AIzaSyBVziZhCm0vjS_XLui0WA1HKx7_P8iPEGc";
  options.projectID = @"react-market-a2b0e";
  options.storageBucket = @"react-market-a2b0e.firebasestorage.app";

  [FIRApp configureWithOptions:options];

  self.moduleName = @"ReactMarket";
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
