package com.soulescence.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
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

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

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
                                    while (redirects < 6) {
                                        conn = (HttpURLConnection) currentUrl.openConnection();
                                        conn.setInstanceFollowRedirects(true);
                                        conn.setRequestProperty("User-Agent", "SoulEssence-App");
                                        conn.setConnectTimeout(15000);
                                        conn.setReadTimeout(30000);
                                        conn.connect();
                                        int code = conn.getResponseCode();
                                        if (code == HttpURLConnection.HTTP_MOVED_PERM || code == HttpURLConnection.HTTP_MOVED_TEMP || code == 307 || code == 308) {
                                            String loc = conn.getHeaderField("Location");
                                            currentUrl = new URL(loc);
                                            redirects++;
                                        } else {
                                            break;
                                        }
                                    }

                                    long totalLength = conn.getContentLength();
                                    File dir = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                                    if (dir == null) dir = getCacheDir();
                                    final File apkFile = new File(dir, "Soul-Essence-Update.apk");
                                    if (apkFile.exists()) apkFile.delete();

                                    in = conn.getInputStream();
                                    out = new FileOutputStream(apkFile);
                                    byte[] buf = new byte[8192];
                                    long totalRead = 0;
                                    int read;
                                    long lastPostTime = 0;

                                    while ((read = in.read(buf)) != -1) {
                                        out.write(buf, 0, read);
                                        totalRead += read;
                                        long now = System.currentTimeMillis();
                                        if (totalLength > 0 && now - lastPostTime > 180) {
                                            lastPostTime = now;
                                            final int percent = (int) ((totalRead * 100) / totalLength);
                                            webView.post(new Runnable() {
                                                @Override
                                                public void run() {
                                                    webView.evaluateJavascript("if(window.onProgressUpdateApk)window.onProgressUpdateApk(" + percent + ");", null);
                                                }
                                            });
                                        }
                                    }
                                    out.flush();
                                    out.close();
                                    out = null;
                                    in.close();
                                    in = null;

                                    webView.post(new Runnable() {
                                        @Override
                                        public void run() {
                                            webView.evaluateJavascript("if(window.onProgressUpdateApk)window.onProgressUpdateApk(100);", null);
                                            try {
                                                Uri apkUri = FileProvider.getUriForFile(
                                                    MainActivity.this,
                                                    getPackageName() + ".fileprovider",
                                                    apkFile
                                                );
                                                Intent intent = new Intent(Intent.ACTION_VIEW);
                                                intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
                                                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                                                startActivity(intent);
                                            } catch (Exception e) {
                                                webView.evaluateJavascript("if(window.onGagalUpdateApk)window.onGagalUpdateApk('" + e.getMessage() + "');", null);
                                            }
                                        }
                                    });
                                } catch (final Exception e) {
                                    webView.post(new Runnable() {
                                        @Override
                                        public void run() {
                                            webView.evaluateJavascript("if(window.onGagalUpdateApk)window.onGagalUpdateApk('" + e.getMessage() + "');", null);
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
}
