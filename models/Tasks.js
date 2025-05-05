import mongoose from 'mongoose';

let Task;

try {
  Task = mongoose.model('Task');
} catch (error) {
  const TaskSchema = new mongoose.Schema(
    {
      projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
      },
      title: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      status: {
        type: String,
        required: true,
        enum: ['To Do', 'In Progress', 'In Review', 'Completed'],
        default: 'To Do'
      },
      priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
      },
      assignedTo: {
        type: String,
        trim: true
      },
      dueDate: {
        type: Date
      },
      tags: [{
        type: String,
        trim: true
      }]
    },
    {
      timestamps: true,
    }
  );

  Task = mongoose.model('Task', TaskSchema);
}

export default Task;