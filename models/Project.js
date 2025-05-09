import { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'],
      default: 'Planning',
    },
    completion: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    gitRepo: {
      type: String,
      trim: true,
    },
    domain: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    targetEndDate: {
      type: Date,
    },
    actualEndDate: {
      type: Date,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = models.Project || model('Project', ProjectSchema);

export default Project;
