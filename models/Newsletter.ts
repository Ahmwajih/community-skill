import mongoose from 'mongoose';

const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', NewsletterSchema);

export default Newsletter;
