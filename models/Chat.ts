//create chat model
const chatSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);