import mongoose from 'mongoose';

// Ensure mongoose is initialized
let Card;

try {
  // Try to get the existing model to prevent overwrite error
  Card = mongoose.model('Card');
} catch (error) {
  // Define the schema
  const CardSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      column: {
        type: String,
        required: true,
        enum: ['todo', 'in-progress', 'done'],
      },
      order: {
        type: Number,
        default: 0,
      },
      projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
      },
      position: {
        type: Number,
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      assignedTo: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      tags: [
        {
          type: String,
        },
      ],
      dueDate: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

  // Create the model
  Card = mongoose.model('Card', CardSchema);
}

export default Card;