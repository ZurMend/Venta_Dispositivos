package com.zurmend.chatto

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject

class MainActivity : AppCompatActivity() {

    private lateinit var tvUserName: TextView
    private lateinit var tvAvatarLetter: TextView
    private lateinit var btnNewChat: TextView
    private lateinit var btnNewGroup: TextView
    private lateinit var btnLogout: TextView
    private lateinit var etSearch: EditText
    private lateinit var tabChats: TextView
    private lateinit var tabGroups: TextView
    private lateinit var tabAI: TextView
    private lateinit var recyclerList: RecyclerView
    private lateinit var emptyState: LinearLayout
    private lateinit var emptyIcon: TextView
    private lateinit var emptyText: TextView
    private lateinit var progressBar: ProgressBar

    private var activeTab = "chats"
    private val handler = Handler(Looper.getMainLooper())
    private var pollRunnable: Runnable? = null

    data class ChatItem(
        val id: Int,
        val name: String,
        val preview: String,
        val time: String,
        val type: String, // "conv" | "group" | "ai"
        val otherId: Int = 0,
        val memberCount: Int = 0
    )

    private var items = listOf<ChatItem>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        tvUserName    = findViewById(R.id.tvUserName)
        tvAvatarLetter = findViewById(R.id.tvAvatarLetter)
        btnNewChat    = findViewById(R.id.btnNewChat)
        btnNewGroup   = findViewById(R.id.btnNewGroup)
        btnLogout     = findViewById(R.id.btnLogout)
        etSearch      = findViewById(R.id.etSearch)
        tabChats      = findViewById(R.id.tabChats)
        tabGroups     = findViewById(R.id.tabGroups)
        tabAI         = findViewById(R.id.tabAI)
        recyclerList  = findViewById(R.id.recyclerList)
        emptyState    = findViewById(R.id.emptyState)
        emptyIcon     = findViewById(R.id.emptyIcon)
        emptyText     = findViewById(R.id.emptyText)
        progressBar   = findViewById(R.id.progressBar)

        tvUserName.text = Prefs.userName
        tvAvatarLetter.text = Prefs.userName.firstOrNull()?.uppercaseChar()?.toString() ?: "?"

        recyclerList.layoutManager = LinearLayoutManager(this)

        tabChats.setOnClickListener  { switchTab("chats") }
        tabGroups.setOnClickListener { switchTab("groups") }
        tabAI.setOnClickListener     { switchTab("ai") }

        btnNewChat.setOnClickListener  { showNewChatDialog() }
        btnNewGroup.setOnClickListener { showNewGroupDialog() }
        btnLogout.setOnClickListener   { doLogout() }

        etSearch.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) { filterList(s.toString()) }
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
        })

        loadList()
        startPoll()
    }

    override fun onResume() {
        super.onResume()
        loadList()
        startPoll()
    }

    override fun onPause() {
        super.onPause()
        stopPoll()
    }

    private fun switchTab(tab: String) {
        activeTab = tab
        listOf(tabChats, tabGroups, tabAI).forEach {
            it.setBackgroundResource(0)
            it.setTextColor(getColor(R.color.muted))
        }
        when (tab) {
            "chats"  -> { tabChats.setBackgroundResource(R.drawable.tab_active); tabChats.setTextColor(getColor(R.color.accent)) }
            "groups" -> { tabGroups.setBackgroundResource(R.drawable.tab_active); tabGroups.setTextColor(getColor(R.color.accent)) }
            "ai"     -> { tabAI.setBackgroundResource(R.drawable.tab_active); tabAI.setTextColor(getColor(R.color.accent)) }
        }
        loadList()
    }

    private fun loadList() {
        if (activeTab == "ai") {
            items = listOf(ChatItem(0, "Asistente IA", "Claude · Chat inteligente", "", "ai"))
            renderList(items)
            return
        }
        progressBar.visibility = View.VISIBLE
        lifecycleScope.launch {
            try {
                val endpoint = if (activeTab == "chats")
                    "api/conversations.php?action=list"
                else
                    "api/groups.php?action=list"

                val res = ApiClient.get(endpoint)
                val newItems = mutableListOf<ChatItem>()

                if (activeTab == "chats") {
                    val arr = res.optJSONArray("conversations") ?: JSONArray()
                    for (i in 0 until arr.length()) {
                        val c = arr.getJSONObject(i)
                        newItems.add(ChatItem(
                            id      = c.optInt("id"),
                            name    = c.optString("otro_nombre"),
                            preview = c.optString("preview"),
                            time    = formatTime(c.optString("ultimo_at")),
                            type    = "conv",
                            otherId = c.optInt("otro_id")
                        ))
                    }
                } else {
                    val arr = res.optJSONArray("groups") ?: JSONArray()
                    for (i in 0 until arr.length()) {
                        val g = arr.getJSONObject(i)
                        newItems.add(ChatItem(
                            id          = g.optInt("id"),
                            name        = g.optString("nombre"),
                            preview     = g.optString("preview"),
                            time        = formatTime(g.optString("ultimo_at")),
                            type        = "group",
                            memberCount = g.optInt("total_miembros")
                        ))
                    }
                }
                items = newItems
                runOnUiThread { renderList(items) }
            } catch (e: Exception) {
                runOnUiThread { progressBar.visibility = View.GONE }
            }
        }
    }

    private fun renderList(list: List<ChatItem>) {
        progressBar.visibility = View.GONE
        val filtered = if (etSearch.text.isNullOrEmpty()) list
        else list.filter { it.name.contains(etSearch.text.toString(), ignoreCase = true) }

        if (filtered.isEmpty()) {
            emptyState.visibility = View.VISIBLE
            recyclerList.visibility = View.GONE
            emptyIcon.text = if (activeTab == "chats") "💬" else if (activeTab == "groups") "👥" else "🤖"
            emptyText.text = if (activeTab == "chats") "Sin conversaciones aún\nToca ✏️ para iniciar un chat"
            else if (activeTab == "groups") "Sin grupos aún\nToca 👥 para crear uno"
            else "Toca para chatear con la IA"
        } else {
            emptyState.visibility = View.GONE
            recyclerList.visibility = View.VISIBLE
            recyclerList.adapter = ChatListAdapter(filtered) { item ->
                openChat(item)
            }
        }
    }

    private fun filterList(query: String) {
        renderList(items)
    }

    private fun openChat(item: ChatItem) {
        val intent = Intent(this, ChatActivity::class.java).apply {
            putExtra("type", item.type)
            putExtra("id", item.id)
            putExtra("name", item.name)
            putExtra("otherId", item.otherId)
            putExtra("memberCount", item.memberCount)
        }
        startActivity(intent)
    }

    private fun showNewChatDialog() {
        val dialogView = layoutInflater.inflate(R.layout.activity_register, null)
        // Usamos un AlertDialog simple con un EditText
        val input = EditText(this).apply {
            hint = "Buscar usuario por nombre o correo"
            setTextColor(getColor(R.color.text))
            setHintTextColor(getColor(R.color.muted))
            setPadding(32, 24, 32, 24)
        }
        val container = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(32, 16, 32, 0)
            addView(input)
        }
        val listView = ListView(this).apply {
            setPadding(32, 0, 32, 16)
        }
        container.addView(listView)

        val dialog = AlertDialog.Builder(this)
            .setTitle("Nueva conversación")
            .setView(container)
            .setNegativeButton("Cancelar", null)
            .create()

        var userList = listOf<JSONObject>()

        input.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                val q = s.toString().trim()
                if (q.isEmpty()) return
                lifecycleScope.launch {
                    try {
                        val res = ApiClient.get("api/users.php?action=search&q=${q}")
                        val arr = res.optJSONArray("users") ?: JSONArray()
                        userList = (0 until arr.length()).map { arr.getJSONObject(it) }
                        val names = userList.map { it.optString("nombre") + " - " + it.optString("email") }
                        runOnUiThread {
                            listView.adapter = ArrayAdapter(this@MainActivity, android.R.layout.simple_list_item_1, names)
                        }
                    } catch (e: Exception) {}
                }
            }
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
        })

        listView.setOnItemClickListener { _, _, position, _ ->
            val user = userList[position]
            dialog.dismiss()
            lifecycleScope.launch {
                try {
                    val body = JSONObject().put("otro_id", user.optInt("id"))
                    val res = ApiClient.post("api/conversations.php?action=create", body)
                    if (res.optBoolean("ok")) {
                        loadList()
                        openChat(ChatItem(
                            id = res.optInt("id"),
                            name = user.optString("nombre"),
                            preview = "",
                            time = "",
                            type = "conv",
                            otherId = user.optInt("id")
                        ))
                    }
                } catch (e: Exception) {}
            }
        }
        dialog.show()
    }

    private fun showNewGroupDialog() {
        val container = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(32, 16, 32, 0)
        }
        val etName = EditText(this).apply {
            hint = "Nombre del grupo"
            setTextColor(getColor(R.color.text))
            setHintTextColor(getColor(R.color.muted))
            setPadding(0, 16, 0, 16)
        }
        container.addView(etName)

        AlertDialog.Builder(this)
            .setTitle("Crear grupo")
            .setView(container)
            .setPositiveButton("Crear") { _, _ ->
                val name = etName.text.toString().trim()
                if (name.isEmpty()) { Toast.makeText(this, "Escribe el nombre del grupo", Toast.LENGTH_SHORT).show(); return@setPositiveButton }
                lifecycleScope.launch {
                    try {
                        val body = JSONObject().apply {
                            put("nombre", name)
                            put("miembros", org.json.JSONArray())
                        }
                        val res = ApiClient.post("api/groups.php?action=create", body)
                        if (res.optBoolean("ok")) {
                            loadList()
                            switchTab("groups")
                        }
                    } catch (e: Exception) {}
                }
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }

    private fun doLogout() {
        AlertDialog.Builder(this)
            .setTitle("Cerrar sesión")
            .setMessage("¿Estás seguro?")
            .setPositiveButton("Salir") { _, _ ->
                lifecycleScope.launch {
                    try { ApiClient.post("api/auth.php?action=logout", JSONObject()) } catch (e: Exception) {}
                    Prefs.clear()
                    startActivity(Intent(this@MainActivity, LoginActivity::class.java))
                    finish()
                }
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }

    private fun startPoll() {
        stopPoll()
        pollRunnable = object : Runnable {
            override fun run() {
                loadList()
                handler.postDelayed(this, 5000)
            }
        }
        handler.postDelayed(pollRunnable!!, 5000)
    }

    private fun stopPoll() {
        pollRunnable?.let { handler.removeCallbacks(it) }
        pollRunnable = null
    }

    private fun formatTime(dt: String): String {
        if (dt.isEmpty()) return ""
        return try {
            val sdf = java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.getDefault())
            val date = sdf.parse(dt) ?: return ""
            val now = java.util.Date()
            val cal1 = java.util.Calendar.getInstance().apply { time = date }
            val cal2 = java.util.Calendar.getInstance().apply { time = now }
            if (cal1.get(java.util.Calendar.DAY_OF_YEAR) == cal2.get(java.util.Calendar.DAY_OF_YEAR))
                java.text.SimpleDateFormat("HH:mm", java.util.Locale.getDefault()).format(date)
            else
                java.text.SimpleDateFormat("dd/MM", java.util.Locale.getDefault()).format(date)
        } catch (e: Exception) { "" }
    }
}