// const Joi = require("joi");

// module.exports.listingSchema = Joi.object({
//   listing: Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),
//     image: Joi.string().allow("", null),
//     location: Joi.string().required(),
//     country: Joi.string().required(),
//     price: Joi.number().required().min(0),
//   }).required(),
// });

// module.exports.reviewSchema = Joi.object({
//   review: Joi.object({
//     rating: Joi.number().required().min(1).max(5),
//     comment: Joi.string().required(),
//   }).required(),
// });

// const Joi = require("joi");

// module.exports.listingSchema = Joi.object({
//   listing: Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),
//     image: Joi.object({
//       url: Joi.string().uri().allow("", null),
//       filename: Joi.string().allow("", null),
//     })
//       .optional()
//       .allow(null),
//     location: Joi.string().required(),
//     country: Joi.string().required(),
//     price: Joi.number().required().min(0),
//   }).required(),
// });

// const Joi = require("joi");

// module.exports.listingSchema = Joi.object({
//   listing: Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),

//     // ✅ Final, bulletproof fix:
//     image: Joi.alternatives()
//       .try(
//         Joi.object({
//           url: Joi.string().uri().allow("", null),
//           filename: Joi.string().allow("", null),
//         }),
//         Joi.valid(null)
//       )
//       .optional(), // <-- makes it optional

//     location: Joi.string().required(),
//     country: Joi.string().required(),
//     price: Joi.number().required().min(0),
//   }).required(),
// });

// const Joi = require("joi");

// module.exports.listingSchema = Joi.object({
//   listing: Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),

//     image: Joi.alternatives()
//       .try(
//         Joi.object({
//           url: Joi.string().uri().allow("", null),
//           filename: Joi.string().allow("", null),
//         }),
//         Joi.string().uri().allow(""), // ✅ if it comes as a string (like URL directly)
//         Joi.valid(null)
//       )
//       .optional(), // ✅ allow image to be missing

//     location: Joi.string().required(),
//     country: Joi.string().required(),
//     price: Joi.number().required().min(0),
//   }).required(),
// });

const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.alternatives()
      .try(
        Joi.object({
          url: Joi.string().uri().allow("", null),
          filename: Joi.string().allow("", null),
        }),
        Joi.string().uri().allow(""),
        Joi.valid(null)
      )
      .optional(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
  }).required(),
});

module.exports = {
  listingSchema,
  reviewSchema, // ✅ Add this
};
