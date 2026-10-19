#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn buka_url(url: String) {
    #[cfg(target_os = "windows")]
    {
        let _ = std::process::Command::new("cmd")
            .args(["/C", "start", "", &url])
            .spawn();
    }
    #[cfg(not(target_os = "windows"))]
    {
        let _ = std::process::Command::new("xdg-open")
            .arg(&url)
            .spawn();
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![buka_url])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

