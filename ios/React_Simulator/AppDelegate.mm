#import "AppDelegate.h"

#import <FirebaseCore/FirebaseCore.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>

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

// Add support for custom URL schemes (e.g. reactmarket://)
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

// Add support for Universal Links (browsing web user activities)
- (BOOL)application:(UIApplication *)application
continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
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
