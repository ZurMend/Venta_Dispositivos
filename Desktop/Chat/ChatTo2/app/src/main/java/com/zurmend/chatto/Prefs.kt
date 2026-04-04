package com.zurmend.chatto

import android.content.Context
import android.content.SharedPreferences

object Prefs {
    private const val NAME = "chatto_prefs"
    private lateinit var prefs: SharedPreferences

    fun init(context: Context) {
        prefs = context.getSharedPreferences(NAME, Context.MODE_PRIVATE)
    }

    var userId: Int
        get() = prefs.getInt("user_id", -1)
        set(v) = prefs.edit().putInt("user_id", v).apply()

    var userName: String
        get() = prefs.getString("user_name", "") ?: ""
        set(v) = prefs.edit().putString("user_name", v).apply()

    var userEmail: String
        get() = prefs.getString("user_email", "") ?: ""
        set(v) = prefs.edit().putString("user_email", v).apply()

    var isLoggedIn: Boolean
        get() = prefs.getBoolean("logged_in", false)
        set(v) = prefs.edit().putBoolean("logged_in", v).apply()

    fun clear() = prefs.edit().clear().apply()
}