// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import { Turbo } from "@hotwired/turbo-rails"
import "./controllers"
import * as bootstrap from "bootstrap"

// プログレスバーの表示遅延を短くする
Turbo.setProgressBarDelay(200)
