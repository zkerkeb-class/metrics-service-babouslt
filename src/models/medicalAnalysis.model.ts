import mongoose, { Schema, Document } from "mongoose";

export interface IMedicalAnalysis extends Document {
  userId: string;
  requestData: {
    age: number;
    sexe: string;
    taille: number;
    poids: number;
    symptomes: string;
    niveauDouleur: number;
    localisationDouleur: string;
  };
  responseData: {
    response: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const MedicalAnalysisSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    requestData: {
      age: {
        type: Number,
        required: true,
      },
      sexe: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
      },
      taille: {
        type: Number,
        required: true,
      },
      poids: {
        type: Number,
        required: true,
      },
      symptomes: {
        type: String,
        required: true,
      },
      niveauDouleur: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
      localisationDouleur: {
        type: String,
        required: true,
      },
    },
    responseData: {
      response: {
        type: String,
        required: true,
      },
      usage: {
        prompt_tokens: {
          type: Number,
          required: true,
        },
        completion_tokens: {
          type: Number,
          required: true,
        },
        total_tokens: {
          type: Number,
          required: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index to optimize queries by user
MedicalAnalysisSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IMedicalAnalysis>(
  "MedicalAnalysis",
  MedicalAnalysisSchema
);
