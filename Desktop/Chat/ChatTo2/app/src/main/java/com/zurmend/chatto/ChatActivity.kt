package com.zurmend.chatto

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject

class ChatActivity : AppCompatActivity() {

    private lateinit var btnBack: TextView
    private lateinit var tvChatName: TextView
    private lateinit var tvChatSub: TextView
    private lateinit var tvChatAvatarLetter: TextView
    private lateinit var recyclerMessages: RecyclerView
    private lateinit var typingIndicator: LinearLayout
    private lateinit var etMessage: EditText
    private lateinit var btnSend: TextView

    private var chatType = "conv"
    private var chatId = 0
    private var chatName = ""
    private var lastMsgId = 0
    private val messages = mutableListOf<Message>()
    private val aiHistory = mutableListOf<JSONObject>()

    private val handler = Handler(Looper.getMainLooper())
    private var pollRunnable: Runnable? = null

    data class Message(
        val id: Int,
        val text: String,
        val isMe: Boolean,
        val isAI: Boolean = false,
        val senderName: String = "",
        val time: String = ""
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_chat)

        chatType = intent.getStringExtra("type") ?: "conv"
        chatId   = intent.getIntExtra("id", 0)
        chatName = intent.getStringExtra("name") ?: ""
        val memberCount = intent.getIntExtra("memberCount", 0)

        btnBack            = findViewById(R.id.btnBack)
        tvChatName         = findViewById(R.id.tvChatName)
        tvChatSub          = findViewById(R.id.tvChatSub)
        tvChatAvatarLetter = findViewById(R.id.tvChatAvatarLetter)
        recyclerMessages   = findViewById(R.id.recyclerMessages)
        typingIndicator    = findViewById(R.id.typingIndicator)
        etMessage          = findViewById(R.id.etMessage)
        btnSend            = findViewById(R.id.btnSend)

        tvChatName.text = chatName
        tvChatSub.text  = when (chatType) {
            "conv"  -> "Chat privado"
            "group" -> "$memberCount miembros"
            "ai"    -> "Claude · Responde al instante"
            else    -> ""
        }
        tvChatAvatarLetter.text = if (chatType == "ai") "🤖"
        else chatName.firstOrNull()?.uppercaseChar()?.toString() ?: "?"

        recyclerMessages.layoutManager = LinearLayoutManager(this).apply {
            stackFromEnd = true
        }
        recyclerMessages.adapter = MessagesAdapter()

        btnBack.setOnClickListener { finish() }
        btnSend.setOnClickListener { sendMessage() }

        if (chatType == "ai") {
            addMessage(Message(-1, "¡Hola! Soy tu asistente IA integrado en ChatTo. ¿En qué puedo ayudarte?", false, true, "🤖 Asistente IA"))
        } else {
            loadMessages(0)
            startPoll()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        stopPoll()
    }

    private fun loadMessages(sinceId: Int) {
        lifecycleScope.launch {
            try {
                val url = when (chatType) {
                    "conv"  -> "api/messages.php?action=get&conv_id=$chatId&since_id=$sinceId"
                    "group" -> "api/messages.php?action=get_group&grupo_id=$chatId&since_id=$sinceId"
                    else    -> return@launch
                }
                val res = ApiClient.get(url)
                val arr = res.optJSONArray("messages") ?: JSONArray()
                if (arr.length() == 0) return@launch

                val newMsgs = mutableListOf<Message>()
                for (i in 0 until arr.length()) {
                    val m = arr.getJSONObject(i)
                    val isMe = m.optInt("remitente_id") == Prefs.userId
                    newMsgs.add(Message(
                        id         = m.optInt("id"),
                        text       = m.optString("texto"),
                        isMe       = isMe,
                        senderName = if (!isMe && chatType == "group") m.optString("remitente_nombre") else "",
                        time       = formatTime(m.optString("created_at"))
                    ))
                }

                val lastId = arr.getJSONObject(arr.length() - 1).optInt("id")

                runOnUiThread {
                    if (sinceId == 0) {
                        messages.clear()
                        messages.addAll(newMsgs)
                    } else {
                        messages.addAll(newMsgs)
                    }
                    lastMsgId = lastId
                    recyclerMessages.adapter?.notifyDataSetChanged()
                    recyclerMessages.scrollToPosition(messages.size - 1)
                }
            } catch (e: Exception) {}
        }
    }

    private fun sendMessage() {
        val text = etMessage.text.toString().trim()
        if (text.isEmpty()) return
        etMessage.setText("")

        if (chatType == "ai") {
            sendAIMessage(text)
            return
        }

        val optimistic = Message(
            id   = System.currentTimeMillis().toInt(),
            text = text,
            isMe = true,
            time = "ahora"
        )
        addMessage(optimistic)

        lifecycleScope.launch {
            try {
                val action = if (chatType == "conv") "send" else "send_group"
                val key    = if (chatType == "conv") "conv_id" else "grupo_id"
                val body   = JSONObject().apply {
                    put(key, chatId)
                    put("texto", text)
                }
                ApiClient.post("api/messages.php?action=$action", body)
            } catch (e: Exception) {}
        }
    }

    private fun sendAIMessage(text: String) {
        addMessage(Message(System.currentTimeMillis().toInt(), text, true, time = "ahora"))
        aiHistory.add(JSONObject().apply { put("role", "user"); put("content", text) })

        runOnUiThread { typingIndicator.visibility = View.VISIBLE }

        lifecycleScope.launch {
            try {
                val msgs = JSONArray()
                aiHistory.forEach { msgs.put(it) }
                val body = JSONObject().put("messages", msgs)
                val res  = ApiClient.post("api/ai.php?action=chat", body)
                val reply = if (res.optBoolean("ok")) res.optString("reply")
                else "⚠️ " + res.optString("error", "Error al conectar con la IA")

                aiHistory.add(JSONObject().apply { put("role", "assistant"); put("content", reply) })

                runOnUiThread {
                    typingIndicator.visibility = View.GONE
                    addMessage(Message(System.currentTimeMillis().toInt(), reply, false, true, "🤖 Asistente IA"))
                }
            } catch (e: Exception) {
                runOnUiThread {
                    typingIndicator.visibility = View.GONE
                    addMessage(Message(System.currentTimeMillis().toInt(), "⚠️ Error de conexión", false, true))
                }
            }
        }
    }

    private fun addMessage(msg: Message) {
        messages.add(msg)
        runOnUiThread {
            recyclerMessages.adapter?.notifyItemInserted(messages.size - 1)
            recyclerMessages.scrollToPosition(messages.size - 1)
        }
    }

    private fun startPoll() {
        stopPoll()
        pollRunnable = object : Runnable {
            override fun run() {
                loadMessages(lastMsgId)
                handler.postDelayed(this, 2500)
            }
        }
        handler.postDelayed(pollRunnable!!, 2500)
    }

    private fun stopPoll() {
        pollRunnable?.let { handler.removeCallbacks(it) }
        pollRunnable = null
    }

    private fun formatTime(dt: String): String {
        if (dt.isEmpty()) return ""
        return try {
            val sdf  = java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.getDefault())
            val date = sdf.parse(dt) ?: return ""
            java.text.SimpleDateFormat("HH:mm", java.util.Locale.getDefault()).format(date)
        } catch (e: Exception) { "" }
    }

    // ── Adapter mensajes ──────────────────────────────────────
    inner class MessagesAdapter : RecyclerView.Adapter<RecyclerView.ViewHolder>() {

        private val VIEW_OUT = 0
        private val VIEW_IN  = 1

        override fun getItemViewType(position: Int) =
            if (messages[position].isMe) VIEW_OUT else VIEW_IN

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
            val layout = if (viewType == VIEW_OUT) R.layout.item_message_out else R.layout.item_message_in
            val v = LayoutInflater.from(parent.context).inflate(layout, parent, false)
            return MsgVH(v)
        }

        override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
            val msg = messages[position]
            val vh  = holder as MsgVH
            vh.tvText.text = msg.text
            vh.tvTime.text = msg.time
            if (vh.tvSender != null) vh.tvSender.text = msg.senderName
            if (vh.tvSender != null) vh.tvSender.visibility =
                if (msg.senderName.isNotEmpty()) View.VISIBLE else View.GONE
        }

        override fun getItemCount() = messages.size

        inner class MsgVH(view: View) : RecyclerView.ViewHolder(view) {
            val tvText:   TextView  = view.findViewById(R.id.tvMsgText)
            val tvTime:   TextView  = view.findViewById(R.id.tvMsgTime)
            val tvSender: TextView? = view.findViewById(R.id.tvMsgSender)
        }
    }
}