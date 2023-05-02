import mongoose from "mongoose";
import domPurifier from 'dompurify';
import { JSDOM } from 'jsdom';
const htmlPurify = domPurifier(new JSDOM().window);


const InstitutionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    province: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    banner: String,
  },
  {
    timestamps: true,
  }
);

InstitutionSchema.pre('validate', function(next) {
  //check if there is a description
  if (this.description) {
      this.description = htmlPurify.sanitize(this.description);
  }

  next();
});

const Institution =
  mongoose.models.Institution || mongoose.model("Institution", InstitutionSchema);
export default Institution;
