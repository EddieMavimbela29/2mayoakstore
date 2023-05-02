import mongoose from "mongoose";
import domPurifier from 'dompurify';
import { JSDOM } from 'jsdom';
const htmlPurify = domPurifier(new JSDOM().window);


const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    province: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    english: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    accounting: { type: Number, required: true, default: 0 },
    economics: { type: Number, required: true, default: 0 },
    businessStudies: { type: Number, required: true, default: 0 },
    
    agriculture: { type: Number, required: true, default: 0 },
    physicalSciences: { type: Number, required: true, default: 0 },
    lifeSciences: { type: Number, required: true, default: 0 },
    maths: { type: Number, required: true, default: 0 },
    mathsLit: { type: Number, required: true, default: 0 },
    apsscore: { type: Number, required: true, default: 0 },
    university: { type: String, required: true },
    faculty: { type: String, required: true },
    location: { type: String, required: true },
    closingDate: { type: String, required: true },
    banner: String,
  },
  {
    timestamps: true,
  }
);

courseSchema.pre('validate', function(next) {
  //check if there is a description
  if (this.description) {
      this.description = htmlPurify.sanitize(this.description);
  }

  next();
});

const Course =
  mongoose.models.Course || mongoose.model("Course", courseSchema);
export default Course;
