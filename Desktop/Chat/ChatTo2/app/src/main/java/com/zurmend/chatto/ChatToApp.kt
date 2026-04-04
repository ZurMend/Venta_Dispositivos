package com.zurmend.chatto

import android.app.Application

class ChatToApp : Application() {
    override fun onCreate() {
        super.onCreate()
        Prefs.init(this)
    }
}