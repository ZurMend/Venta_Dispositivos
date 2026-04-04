package com.zurmend.chatto

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch
import org.json.JSONObject

class LoginActivity : AppCompatActivity() {

    private lateinit var tabPassword: TextView
    private lateinit var tabFinger: TextView
    private lateinit var panelPassword: View
    private lateinit var panelFinger: View
    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var btnLogin: Button
    private lateinit var btnFinger: View
    private lateinit var tvError: TextView
    private lateinit var btnRegister: TextView
    private lateinit var progressBar: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Si ya está logueado, ir directo a MainActivity
        if (Prefs.isLoggedIn) {
            startActivity(Intent(this, MainActivity::class.java))
            finish()
            return
        }

        setContentView(R.layout.activity_login)

        tabPassword  = findViewById(R.id.tabPassword)
        tabFinger    = findViewById(R.id.tabFinger)
        panelPassword = findViewById(R.id.panelPassword)
        panelFinger  = findViewById(R.id.panelFinger)
        etEmail      = findViewById(R.id.etEmail)
        etPassword   = findViewById(R.id.etPassword)
        btnLogin     = findViewById(R.id.btnLogin)
        btnFinger    = findViewById(R.id.btnFinger)
        tvError      = findViewById(R.id.tvError)
        btnRegister  = findViewById(R.id.btnRegister)
        progressBar  = findViewById(R.id.progressBar)

        tabPassword.setOnClickListener { switchTab("password") }
        tabFinger.setOnClickListener   { switchTab("finger") }

        btnLogin.setOnClickListener { doLogin() }
        btnFinger.setOnClickListener { doFingerprint() }

        btnRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }

    private fun switchTab(tab: String) {
        if (tab == "password") {
            tabPassword.setBackgroundResource(R.drawable.tab_active)
            tabPassword.setTextColor(ContextCompat.getColor(this, R.color.accent))
            tabFinger.background = null
            tabFinger.setTextColor(ContextCompat.getColor(this, R.color.muted))
            panelPassword.visibility = View.VISIBLE
            panelFinger.visibility   = View.GONE
        } else {
            tabFinger.setBackgroundResource(R.drawable.tab_active)
            tabFinger.setTextColor(ContextCompat.getColor(this, R.color.accent))
            tabPassword.background = null
            tabPassword.setTextColor(ContextCompat.getColor(this, R.color.muted))
            panelPassword.visibility = View.GONE
            panelFinger.visibility   = View.VISIBLE
        }
        tvError.visibility = View.GONE
    }

    private fun doLogin() {
        val email = etEmail.text.toString().trim()
        val pass  = etPassword.text.toString()
        if (email.isEmpty() || pass.isEmpty()) {
            showError("Ingresa tu correo y contraseña")
            return
        }
        setLoading(true)
        lifecycleScope.launch {
            try {
                val body = JSONObject().apply {
                    put("email", email)
                    put("password", pass)
                }
                val res = ApiClient.post("api/auth.php?action=login", body)
                if (res.optBoolean("ok")) {
                    Prefs.userId    = res.optInt("id")
                    Prefs.userName  = res.optString("nombre")
                    Prefs.userEmail = email
                    Prefs.isLoggedIn = true
                    startActivity(Intent(this@LoginActivity, MainActivity::class.java))
                    finish()
                } else {
                    showError(res.optString("error", "Credenciales incorrectas"))
                }
            } catch (e: Exception) {
                showError("Error de conexión")
            }
            setLoading(false)
        }
    }

    private fun doFingerprint() {
        if (!Prefs.isLoggedIn && Prefs.userId == -1) {
            showError("Inicia sesión con contraseña primero")
            return
        }

        val biometricManager = BiometricManager.from(this)
        when (biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG)) {
            BiometricManager.BIOMETRIC_SUCCESS -> { /* ok */ }
            BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE ->
            { showError("Tu dispositivo no tiene sensor biométrico"); return }
            BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED ->
            { showError("No tienes huellas registradas en este dispositivo"); return }
            else -> { showError("Autenticación biométrica no disponible"); return }
        }

        val executor = ContextCompat.getMainExecutor(this)
        val prompt = BiometricPrompt(this, executor,
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    startActivity(Intent(this@LoginActivity, MainActivity::class.java))
                    finish()
                }
                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    if (errorCode != BiometricPrompt.ERROR_USER_CANCELED &&
                        errorCode != BiometricPrompt.ERROR_NEGATIVE_BUTTON) {
                        showError("Error: $errString")
                    }
                }
                override fun onAuthenticationFailed() {
                    showError("Huella no reconocida. Intenta de nuevo.")
                }
            })

        val info = BiometricPrompt.PromptInfo.Builder()
            .setTitle("ChatTo")
            .setSubtitle("Usa tu huella para entrar")
            .setNegativeButtonText("Usar contraseña")
            .build()

        prompt.authenticate(info)
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
            btnLogin.isEnabled = !loading
        }
    }
}