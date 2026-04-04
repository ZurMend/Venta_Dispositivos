package com.zurmend.chatto

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch
import org.json.JSONObject

class RegisterActivity : AppCompatActivity() {

    private lateinit var etNombre: EditText
    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var btnRegister: Button
    private lateinit var btnLogin: TextView
    private lateinit var tvError: TextView
    private lateinit var progressBar: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        etNombre    = findViewById(R.id.etNombre)
        etEmail     = findViewById(R.id.etEmail)
        etPassword  = findViewById(R.id.etPassword)
        btnRegister = findViewById(R.id.btnRegister)
        btnLogin    = findViewById(R.id.btnLogin)
        tvError     = findViewById(R.id.tvError)
        progressBar = findViewById(R.id.progressBar)

        btnRegister.setOnClickListener { doRegister() }
        btnLogin.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
    }

    private fun doRegister() {
        val nombre = etNombre.text.toString().trim()
        val email  = etEmail.text.toString().trim()
        val pass   = etPassword.text.toString()

        if (nombre.isEmpty() || email.isEmpty() || pass.isEmpty()) {
            showError("Todos los campos son requeridos"); return
        }
        if (pass.length < 6) {
            showError("La contraseña debe tener mínimo 6 caracteres"); return
        }

        setLoading(true)
        lifecycleScope.launch {
            try {
                val body = JSONObject().apply {
                    put("nombre", nombre)
                    put("email", email)
                    put("password", pass)
                }
                val res = ApiClient.post("api/auth.php?action=register", body)
                if (res.optBoolean("ok")) {
                    Prefs.userId     = res.optInt("id")
                    Prefs.userName   = res.optString("nombre")
                    Prefs.userEmail  = email
                    Prefs.isLoggedIn = true
                    startActivity(Intent(this@RegisterActivity, MainActivity::class.java))
                    finish()
                } else {
                    showError(res.optString("error", "Error al registrar"))
                }
            } catch (e: Exception) {
                showError("Error de conexión")
            }
            setLoading(false)
        }
    }

    private fun showError(msg: String) {
        runOnUiThread {
            tvError.text = msg
            tvError.visibility = View.VISIBLE
        }
    }

    private fun setLoading(loading: Boolean) {
        runOnUiThread {
            progressBar.visibility = if (loading) View.VISIBLE else View.GONE
            btnRegister.isEnabled = !loading
        }
    }
}