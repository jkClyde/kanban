import mongoose from 'mongoose';

// Ensure mongoose is initialized
let Project;

try {
  // Try to get the existing model to prevent overwrite error
  Project = mongoose.model('Project');
} catch (error) {
  // Define the schema
  const ProjectSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      techStack: {
        frontend: [{
          type: String
        }],
        backend: [{
          type: String
        }],
        database: [{
          type: String
        }],
        devOps: [{
          type: String
        }]
      },
      status: {
        type: String,
        required: true,
        enum: ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'],
        default: 'Planning'
      },
      completion: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
      },
      gitRepo: {
        type: String,
        trim: true
      },
      domain: {
        type: String,
        trim: true
      },
      startDate: {
        type: Date
      },
      targetEndDate: {
        type: Date
      },
      actualEndDate: {
        type: Date,
        default: null
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

  Project = mongoose.model('Project', ProjectSchema);
}

export default Project;