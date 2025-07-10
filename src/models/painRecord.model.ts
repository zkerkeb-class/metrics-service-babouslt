import mongoose, { Schema, Document } from "mongoose";

export interface IPainEvolution {
  date: Date;
  note?: string;
  intensite?: number;
  symptomes?: string;
}

export interface IPainRecord extends Document {
  userId: string;
  symptomes: string;
  localisation: string;
  cause?: string;
  dateDebut: Date;
  intensiteDouleur: number;
  evolutions: IPainEvolution[];
  status: "actif" | "fini";
  dateFin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PainEvolutionSchema = new Schema<IPainEvolution>(
  {
    date: { type: Date, required: true },
    note: { type: String },
    intensite: { type: Number, min: 1, max: 10 },
    symptomes: { type: String },
  },
  { _id: false }
);

const PainRecordSchema = new Schema<IPainRecord>(
  {
    userId: { type: String, required: true, index: true },
    symptomes: { type: String, required: true },
    localisation: { type: String, required: true },
    cause: { type: String },
    dateDebut: { type: Date, required: true },
    intensiteDouleur: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
      default: 5,
    },
    evolutions: { type: [PainEvolutionSchema], default: [] },
    status: {
      type: String,
      enum: ["actif", "fini"],
      default: "actif",
      required: true,
    },
    dateFin: { type: Date },
  },
  { timestamps: true }
);

PainRecordSchema.index({ userId: 1, dateDebut: -1 });

export default mongoose.model<IPainRecord>("PainRecord", PainRecordSchema);
