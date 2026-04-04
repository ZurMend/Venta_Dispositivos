package com.zurmend.chatto

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class ChatListAdapter(
    private val items: List<MainActivity.ChatItem>,
    private val onClick: (MainActivity.ChatItem) -> Unit
) : RecyclerView.Adapter<ChatListAdapter.VH>() {

    inner class VH(view: View) : RecyclerView.ViewHolder(view) {
        val tvLetter:  TextView = view.findViewById(R.id.tvItemLetter)
        val tvName:    TextView = view.findViewById(R.id.tvItemName)
        val tvPreview: TextView = view.findViewById(R.id.tvItemPreview)
        val tvTime:    TextView = view.findViewById(R.id.tvItemTime)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
        val v = LayoutInflater.from(parent.context).inflate(R.layout.item_chat, parent, false)
        return VH(v)
    }

    override fun onBindViewHolder(holder: VH, position: Int) {
        val item = items[position]
        holder.tvLetter.text  = if (item.type == "ai") "🤖" else item.name.firstOrNull()?.uppercaseChar()?.toString() ?: "?"
        holder.tvName.text    = item.name
        holder.tvPreview.text = item.preview.ifEmpty {
            when (item.type) {
                "group" -> "${item.memberCount} miembros"
                "ai"    -> "Claude · Chat inteligente"
                else    -> "Sin mensajes"
            }
        }
        holder.tvTime.text = item.time
        holder.itemView.setOnClickListener { onClick(item) }
    }

    override fun getItemCount() = items.size
}