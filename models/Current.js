import mongoose from 'mongoose';

// Ensure mongoose is initialized
let Current;

try {
  // Try to get the existing model to prevent overwrite error
  Current = mongoose.model('Current');
} catch (error) {
  // Define the schema
  const CurrentSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true
      },
      project_id: {
        type: String,
        required: true,
        trim: true
      }
    },
    {
      timestamps: true,
    }
  );

  Current = mongoose.model('Current', CurrentSchema);
}

export default Current;