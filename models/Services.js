import mongoose from 'mongoose';

// Ensure mongoose is initialized
let Service;

try {
  // Try to get the existing model to prevent overwrite error
  Service = mongoose.model('Service');
} catch (error) {
  // Define the schema
  const ServiceSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true
      },
      color: {
        type: String,
        trim: true
      },
    },
    {
      timestamps: true,
    }
  );

  Service = mongoose.model('Service', ServiceSchema);
}

export default Service;