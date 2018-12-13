package com.classcast;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.BV.LinearGradient.LinearGradientPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;
import cl.json.RNSharePackage;
import com.RNFetchBlob.RNFetchBlobPackage;
//import com.reactnativenavigation.NavigationReactPackage;
import org.wonday.pdf.RCTPdfView;
import com.zmxv.RNSound.RNSoundPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
//import com.RNFetchBlob.RNFetchBlobPackage;
//import com.reactnativeandroidmediaplayer.mediaplayer.MediaPlayerPackage;
//import com.brentvatne.react.ReactVideoPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.links.RNFirebaseLinksPackage;
import io.invertase.firebase.invites.RNFirebaseInvitesPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
//import io.invertase.firebase.instanceid.RNFirebaseInstanceIdPackage;
import com.iou90.autoheightwebview.AutoHeightWebViewPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.centaurwarchief.smslistener.SmsListenerPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.horcrux.svg.SvgPackage;
import ca.bigdata.voice.contacts.BDVSimpleContactsPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
//import com.magus.fblogin.FacebookLoginPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
//import com.wix.reactnativenotifications.RNNotificationsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new LinearGradientPackage(),
            new RNGestureHandlerPackage(),
            new RNVersionCheckPackage(),
            new RNSharePackage(),
            new RNFetchBlobPackage(),
           // new NavigationReactPackage(),
            new RCTPdfView(),
            new RNSoundPackage(),
            new CookieManagerPackage(),
            new SplashScreenReactPackage(),
        
            new ReactVideoPackage(),
            new RNFirebasePackage(),
            new RNFirebaseAnalyticsPackage(),
            new RNFirebaseLinksPackage(),
            new RNFirebaseInvitesPackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage(),
            new RNFirebaseAuthPackage(),
            new RNFirebaseStoragePackage(),
            //new RNFirebaseInstanceIdPackage(),
            new RNFirebaseDatabasePackage(),
            new AutoHeightWebViewPackage(),
            new RNGoogleSigninPackage(),
            new SmsListenerPackage(),
            new ReactVideoPackage(),
            new SvgPackage(),
            new BDVSimpleContactsPackage(),
            new OrientationPackage(),
            new LinearGradientPackage(),
            new PickerPackage()
            //new RNNotificationsPackage(MainApplication.this)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
