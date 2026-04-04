package com.zurmend.chatto

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

object ApiClient {

    const val BASE = "https://limegreen-elk-680782.hostingersite.com"
    private val client = OkHttpClient()
    private val JSON = "application/json; charset=utf-8".toMediaType()

    suspend fun get(path: String): JSONObject = withContext(Dispatchers.IO) {
        val req = Request.Builder().url("$BASE/$path").build()
        val res = client.newCall(req).execute()
        JSONObject(res.body?.string() ?: "{}")
    }

    suspend fun post(path: String, body: JSONObject): JSONObject = withContext(Dispatchers.IO) {
        val rb = body.toString().toRequestBody(JSON)
        val req = Request.Builder().url("$BASE/$path").post(rb).build()
        val res = client.newCall(req).execute()
        JSONObject(res.body?.string() ?: "{}")
    }
}