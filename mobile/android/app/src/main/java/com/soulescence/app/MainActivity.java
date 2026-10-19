package com.soulescence.app;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import androidx.core.content.FileProvider;
import com.getcapacitor.BridgeActivity;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        pasangBridgeInterface();
    }

    @Override
    public void onResume() {
        super.onResume();
        pasangBridgeInterface();
    }

    private void pasangBridgeInterface() {
        try {
            if (getBridge() != null && getBridge().getWebView() != null) {
                final WebView webView = getBridge().getWebView();

                webView.setDownloadListener(new DownloadListener() {
                    @Override
                    public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                        try {
                            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(intent);
                        } catch (Exception e) {}
                    }
                });

                webView.addJavascriptInterface(new Object() {
                    @JavascriptInterface
                    public void bukaUrl(String url) {
                        try {
                            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(intent);
                        } catch (Exception e) {}
                    }

                    @JavascriptInterface
                    public void unduhDanPasangApk(final String urlStr) {
                        new Thread(new Runnable() {
                            @Override
                            public void run() {
                                HttpURLConnection conn = null;
                                InputStream in = null;
                                FileOutputStream out = null;
                                try {
                                    URL currentUrl = new URL(urlStr);
                                    int redirects = 0;
                                    while (redirects < 8) {
                                        conn = (HttpURLConnection) currentUrl.openConnection();
                                        conn.setInstanceFollowRedirects(true);
                                        conn.setRequestProperty("User-Agent", "SoulEssence-App");
                                        conn.setConnectTimeout(20000);
                                        conn.setReadTimeout(60000);
                                        conn.connect();
                                        int code = conn.getResponseCode();
                                        if (code == HttpURLConnection.HTTP_MOVED_PERM || code == HttpURLConnection.HTTP_MOVED_TEMP || code == 303 || code == 307 || code == 308) {
                                            String loc = conn.getHeaderField("Location");
                                            if (loc != null) {
                                                currentUrl = new URL(currentUrl, loc);
                                            }
                                            conn.disconnect();
                                            redirects++;
                                        } else {
                                            break;
                                        }
                                    }

                                    int finalCode = conn.getResponseCode();
                                    if (finalCode != HttpURLConnection.HTTP_OK) {
                                        throw new Exception("Server merespons kode HTTP " + finalCode);
                                    }

                                    final long totalLength = conn.getContentLengthLong();

                                    File dir = getExternalCacheDir();
                                    if (dir == null) dir = getCacheDir();
                                    if (!dir.exists()) dir.mkdirs();

                                    final File apkFile = new File(dir, "Soul-Essence-Update.apk");
                                    if (apkFile.exists()) apkFile.delete();

                                    in = conn.getInputStream();
                                    out = new FileOutputStream(apkFile);
                                    byte[] buf = new byte[16384];
                                    long totalRead = 0;
                                    int read;
                                    long lastPostTime = 0;

                                    while ((read = in.read(buf)) != -1) {
                                        out.write(buf, 0, read);
                                        totalRead += read;
                                        long now = System.currentTimeMillis();
                                        if (now - lastPostTime > 150) {
                                            lastPostTime = now;
                                            final int percent = totalLength > 0 ? (int) ((totalRead * 100) / totalLength) : -1;
                                            final long curMb = totalRead / (1024 * 1024);
                                            webView.post(new Runnable() {
                                                @Override
                                                public void run() {
                                                    if (percent >= 0) {
                                                        webView.evaluateJavascript("if(window.onProgressUpdateApk)window.onProgressUpdateApk(" + percent + ");", null);
                                                    } else {
                                                        webView.evaluateJavascript("if(window.onProgressUpdateMb)window.onProgressUpdateMb(" + curMb + ");", null);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                    out.flush();
                                    out.close();
                                    out = null;
                                    in.close();
                                    in = null;

                                    final File berkasSelesai = apkFile;
                                    webView.post(new Runnable() {
                                        @Override
                                        public void run() {
                                            webView.evaluateJavascript("if(window.onProgressUpdateApk)window.onProgressUpdateApk(100);", null);
                                            pasangApk(berkasSelesai, webView);
                                        }
                                    });
                                } catch (final Exception e) {
                                    final String msg = e.getMessage() != null ? e.getMessage().replace("'", "\\'").replace("\n", " ") : "Gagal mengunduh berkas";
                                    webView.post(new Runnable() {
                                        @Override
                                        public void run() {
                                            webView.evaluateJavascript("if(window.onGagalUpdateApk)window.onGagalUpdateApk('" + msg + "');", null);
                                        }
                                    });
                                } finally {
                                    try { if (out != null) out.close(); } catch (Exception e) {}
                                    try { if (in != null) in.close(); } catch (Exception e) {}
                                    try { if (conn != null) conn.disconnect(); } catch (Exception e) {}
                                }
                            }
                        }).start();
                    }
                }, "AndroidNative");
            }
        } catch (Exception e) {}
    }

    private void pasangApk(File apkFile, final WebView webView) {
        try {
            if (!apkFile.exists() || apkFile.length() < 1000) {
                throw new Exception("Berkas APK hasil unduhan kosong atau rusak.");
            }

            apkFile.setReadable(true, false);

            Uri apkUri = FileProvider.getUriForFile(
                MainActivity.this,
                getPackageName() + ".fileprovider",
                apkFile
            );

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                if (!getPackageManager().canRequestPackageInstalls()) {
                    Intent settingsIntent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
                    settingsIntent.setData(Uri.parse("package:" + getPackageName()));
                    settingsIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(settingsIntent);
                    if (webView != null) {
                        webView.evaluateJavascript("if(window.onMintaIzinInstall)window.onMintaIzinInstall();", null);
                    }
                    return;
                }
            }

            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

            List<ResolveInfo> resolveLists = getPackageManager().queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY);
            for (ResolveInfo resolveInfo : resolveLists) {
                String packageName = resolveInfo.activityInfo.packageName;
                grantUriPermission(packageName, apkUri, Intent.FLAG_GRANT_READ_URI_PERMISSION);
            }

            startActivity(intent);
        } catch (Exception e) {
            final String err = e.getMessage() != null ? e.getMessage().replace("'", "\\'").replace("\n", " ") : "Gagal membuka penginstal";
            if (webView != null) {
                webView.evaluateJavascript("if(window.onGagalUpdateApk)window.onGagalUpdateApk('" + err + "');", null);
            }
        }
    }
}

