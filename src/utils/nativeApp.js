const KEY = 'NativeAppName'

const isNativeApp = () => {
  return new RegExp(KEY).test(navigator.userAgent)
}

const getNativeAppName = () => {
  const regex = new RegExp(`⁠^(.*)(${KEY})/(ios|android)(.*)$`)
  return (navigator.userAgent).replace(regex, '$3')
}

/**
 * The function changes the theme in the native app (if webView is detected)
 * @param isLightTheme an optional parameter describing the new theme, default: true
 */
export const changeTheme = (isLightTheme = true) => {
  if (isNativeApp()) {
    const appName = getNativeAppName()
    const newTheme = isLightTheme ? 'light' : 'dark'
    try {
      if (appName === 'android') {
        window.Android.changeTheme(newTheme)
      } else if (appName === 'ios') {
        window.webkit.messageHandlers.Theme.postMessage(newTheme)
      } else {
        throw new Error('Wrong app name')
      }
    } catch (error) {
      console.error(error)
    }
  }
}